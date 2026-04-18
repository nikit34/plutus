import { Router } from 'express';
import { z } from 'zod';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs/promises';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { HttpError } from '../middleware/error.js';
import { uniqueProductSlug } from '../lib/slug.js';
import { serializeProduct } from '../lib/serialize.js';
import { userDir, randomFileName, removeIfExists, storageRoot, toAbsolute, toRelative } from '../lib/storage.js';
import { config } from '../config.js';

export const productsRouter = Router();

// Multer — accept any file, we'll sort it out by field name
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.maxUploadMb * 1024 * 1024, files: 2 },
});

const productSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().max(5000).optional().default(''),
  price: z.union([z.number(), z.string()]).transform((v) => Number(v)).refine((v) => Number.isFinite(v) && v >= 0, 'invalid price'),
  currency: z.string().length(3).optional().default('USD'),
  theme: z.string().max(30).optional().default('midnight'),
  status: z.enum(['active', 'draft', 'archived']).optional().default('active'),
  contentType: z.enum(['file', 'link', 'text']).optional().default('file'),
  contentUrl: z.string().url().optional().or(z.literal('')).transform((v) => v || null),
  contentLabel: z.string().max(120).optional().or(z.literal('')).transform((v) => v || null),
  contentBody: z.string().max(20000).optional().or(z.literal('')).transform((v) => v || null),
  stripePaymentLink: z.string().url().optional().or(z.literal('')).transform((v) => v || null),
});

function parseBody(req) {
  // multer puts form fields on req.body as strings
  const raw = req.body || {};
  // Accept both multipart and JSON
  return productSchema.parse({
    title: raw.title,
    description: raw.description ?? '',
    price: raw.price,
    currency: raw.currency ?? 'USD',
    theme: raw.theme ?? 'midnight',
    status: raw.status ?? 'active',
    contentType: raw.contentType ?? 'file',
    contentUrl: raw.contentUrl ?? '',
    contentLabel: raw.contentLabel ?? '',
    contentBody: raw.contentBody ?? '',
    stripePaymentLink: raw.stripePaymentLink ?? '',
  });
}

async function saveUploadedFile(userId, kind, file) {
  if (!file) return null;
  const dir = await userDir(userId, kind);
  const filename = randomFileName(file.originalname);
  const absPath = path.join(dir, filename);
  await fs.writeFile(absPath, file.buffer);
  return absPath;
}

productsRouter.get('/', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT p.*,
              COALESCE(pur.sales, 0) AS sales,
              COALESCE(pur.revenue_cents, 0) AS revenue_cents,
              COALESCE(ev.views, 0) AS views
       FROM products p
       LEFT JOIN (
         SELECT product_id, COUNT(*)::int AS sales, SUM(amount_cents - platform_fee_cents)::bigint AS revenue_cents
         FROM purchases WHERE status = 'paid' GROUP BY product_id
       ) pur ON pur.product_id = p.id
       LEFT JOIN (
         SELECT product_id, COUNT(*)::int AS views FROM events WHERE type = 'view' GROUP BY product_id
       ) ev ON ev.product_id = p.id
       WHERE p.user_id = $1
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );
    res.json({ products: rows.map((r) => serializeProduct(r)) });
  } catch (err) { next(err); }
});

productsRouter.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT p.*,
              COALESCE(pur.sales, 0) AS sales,
              COALESCE(pur.revenue_cents, 0) AS revenue_cents,
              COALESCE(ev.views, 0) AS views
       FROM products p
       LEFT JOIN (SELECT product_id, COUNT(*)::int AS sales, SUM(amount_cents - platform_fee_cents)::bigint AS revenue_cents FROM purchases WHERE status='paid' GROUP BY product_id) pur ON pur.product_id = p.id
       LEFT JOIN (SELECT product_id, COUNT(*)::int AS views FROM events WHERE type='view' GROUP BY product_id) ev ON ev.product_id = p.id
       WHERE p.user_id = $1 AND p.id = $2`,
      [req.user.id, req.params.id]
    );
    if (!rows.length) throw new HttpError(404, 'not_found');
    res.json({ product: serializeProduct(rows[0]) });
  } catch (err) { next(err); }
});

productsRouter.post(
  '/',
  requireAuth,
  upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'contentFile', maxCount: 1 }]),
  async (req, res, next) => {
    try {
      const data = parseBody(req);
      const slug = await uniqueProductSlug(data.title);
      const cover = req.files?.cover?.[0];
      const contentFile = req.files?.contentFile?.[0];

      const coverAbs = cover ? await saveUploadedFile(req.user.id, 'covers', cover) : null;
      const contentAbs = contentFile && data.contentType === 'file' ? await saveUploadedFile(req.user.id, 'content', contentFile) : null;

      const priceCents = Math.round(Number(data.price) * 100);

      const { rows } = await query(
        `INSERT INTO products
         (user_id, slug, title, description, price_cents, currency, cover_path, theme, status,
          content_type, content_file_path, content_file_name, content_file_size, content_url, content_label, content_body, stripe_payment_link)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
         RETURNING *`,
        [
          req.user.id, slug, data.title, data.description, priceCents, data.currency,
          toRelative(coverAbs), data.theme, data.status,
          data.contentType,
          toRelative(contentAbs),
          contentFile?.originalname || null,
          contentFile?.size || null,
          data.contentUrl, data.contentLabel, data.contentBody,
          data.stripePaymentLink,
        ]
      );
      const p = rows[0];
      res.status(201).json({ product: serializeProduct({ ...p, sales: 0, revenue_cents: 0, views: 0 }) });
    } catch (err) { next(err); }
  }
);

productsRouter.patch(
  '/:id',
  requireAuth,
  upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'contentFile', maxCount: 1 }]),
  async (req, res, next) => {
    try {
      const { rows: existingRows } = await query('SELECT * FROM products WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
      const existing = existingRows[0];
      if (!existing) throw new HttpError(404, 'not_found');

      const data = parseBody(req);
      const cover = req.files?.cover?.[0];
      const contentFile = req.files?.contentFile?.[0];

      let coverPath = existing.cover_path;
      if (cover) {
        const abs = await saveUploadedFile(req.user.id, 'covers', cover);
        if (existing.cover_path) await removeIfExists(toAbsolute(existing.cover_path));
        coverPath = toRelative(abs);
      }

      let contentFilePath = existing.content_file_path;
      let contentFileName = existing.content_file_name;
      let contentFileSize = existing.content_file_size;
      if (data.contentType === 'file' && contentFile) {
        const abs = await saveUploadedFile(req.user.id, 'content', contentFile);
        if (existing.content_file_path) await removeIfExists(toAbsolute(existing.content_file_path));
        contentFilePath = toRelative(abs);
        contentFileName = contentFile.originalname;
        contentFileSize = contentFile.size;
      } else if (data.contentType !== 'file') {
        if (existing.content_file_path) await removeIfExists(toAbsolute(existing.content_file_path));
        contentFilePath = null;
        contentFileName = null;
        contentFileSize = null;
      }

      const priceCents = Math.round(Number(data.price) * 100);
      const { rows } = await query(
        `UPDATE products SET
           title=$1, description=$2, price_cents=$3, currency=$4, cover_path=$5,
           theme=$6, status=$7, content_type=$8, content_file_path=$9, content_file_name=$10,
           content_file_size=$11, content_url=$12, content_label=$13, content_body=$14,
           stripe_payment_link=$15, updated_at=now()
         WHERE id=$16 AND user_id=$17 RETURNING *`,
        [
          data.title, data.description, priceCents, data.currency, coverPath,
          data.theme, data.status, data.contentType, contentFilePath, contentFileName,
          contentFileSize, data.contentUrl, data.contentLabel, data.contentBody,
          data.stripePaymentLink, req.params.id, req.user.id,
        ]
      );
      const p = rows[0];
      res.json({ product: serializeProduct({ ...p, sales: 0, revenue_cents: 0, views: 0 }) });
    } catch (err) { next(err); }
  }
);

productsRouter.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM products WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
    const existing = rows[0];
    if (!existing) throw new HttpError(404, 'not_found');

    const { rows: usageRows } = await query("SELECT COUNT(*)::int AS n FROM purchases WHERE product_id=$1 AND status='paid'", [existing.id]);
    if (usageRows[0].n > 0) {
      await query("UPDATE products SET status='archived', updated_at=now() WHERE id=$1", [existing.id]);
      return res.json({ archived: true });
    }
    if (existing.cover_path) await removeIfExists(toAbsolute(existing.cover_path));
    if (existing.content_file_path) await removeIfExists(toAbsolute(existing.content_file_path));
    await query('DELETE FROM products WHERE id=$1', [existing.id]);
    res.json({ deleted: true });
  } catch (err) { next(err); }
});
