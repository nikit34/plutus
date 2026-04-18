import { Router } from 'express';
import { z } from 'zod';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs/promises';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { serializeUser } from '../lib/serialize.js';
import { hashPassword, verifyPassword } from '../lib/password.js';
import { HttpError } from '../middleware/error.js';
import { userDir, randomFileName, removeIfExists, toRelative, toAbsolute } from '../lib/storage.js';
import { config } from '../config.js';

export const settingsRouter = Router();

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const profileSchema = z.object({
  name: z.string().trim().max(120).optional(),
  socialLink: z.string().url().optional().or(z.literal('')).transform((v) => v || null),
  socialLabel: z.string().max(40).optional().or(z.literal('')).transform((v) => v || null),
  subscribers: z.union([z.number(), z.string()]).optional().transform((v) => (v === undefined || v === '' ? undefined : Number(v))),
  emailNotifSales: z.coerce.boolean().optional(),
  emailNotifPayouts: z.coerce.boolean().optional(),
  emailNotifTips: z.coerce.boolean().optional(),
});

settingsRouter.patch('/profile', requireAuth, upload.single('avatar'), async (req, res, next) => {
  try {
    const body = profileSchema.parse(req.body || {});
    let avatarPath = req.user.avatar_url;
    if (req.file) {
      const dir = await userDir(req.user.id, 'avatars');
      const filename = randomFileName(req.file.originalname);
      const abs = path.join(dir, filename);
      await fs.writeFile(abs, req.file.buffer);
      if (req.user.avatar_url && req.user.avatar_url.startsWith(`${config.apiBaseUrl}/files/`)) {
        const rel = req.user.avatar_url.replace(`${config.apiBaseUrl}/files/`, '');
        await removeIfExists(toAbsolute(rel));
      }
      avatarPath = `${config.apiBaseUrl}/files/${toRelative(abs).replace(/\\/g, '/')}`;
    }
    const { rows } = await query(
      `UPDATE users SET
         name = COALESCE($1, name),
         social_link = COALESCE($2, social_link),
         social_label = COALESCE($3, social_label),
         subscribers = COALESCE($4, subscribers),
         email_notif_sales = COALESCE($5, email_notif_sales),
         email_notif_payouts = COALESCE($6, email_notif_payouts),
         email_notif_tips = COALESCE($7, email_notif_tips),
         avatar_url = $8,
         updated_at = now()
       WHERE id=$9 RETURNING *`,
      [
        body.name ?? null,
        body.socialLink ?? null,
        body.socialLabel ?? null,
        body.subscribers ?? null,
        body.emailNotifSales ?? null,
        body.emailNotifPayouts ?? null,
        body.emailNotifTips ?? null,
        avatarPath,
        req.user.id,
      ]
    );
    res.json({ user: serializeUser(rows[0]) });
  } catch (err) { next(err); }
});

const pwSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(200),
});

settingsRouter.post('/password', requireAuth, async (req, res, next) => {
  try {
    const body = pwSchema.parse(req.body);
    const ok = await verifyPassword(body.currentPassword, req.user.password_hash);
    if (!ok) throw new HttpError(400, 'wrong_password', 'Current password is incorrect');
    const hash = await hashPassword(body.newPassword);
    await query('UPDATE users SET password_hash=$1, updated_at=now() WHERE id=$2', [hash, req.user.id]);
    res.json({ ok: true });
  } catch (err) { next(err); }
});
