import { Router } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { query } from '../db.js';
import { hashPassword, verifyPassword } from '../lib/password.js';
import { signAuthToken } from '../lib/jwt.js';
import { serializeUser } from '../lib/serialize.js';
import { sendWelcome } from '../lib/email.js';
import { requireAuth } from '../middleware/auth.js';
import { HttpError } from '../middleware/error.js';

export const authRouter = Router();

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false });

const signupSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(8).max(200),
  name: z.string().trim().min(1).max(120).optional(),
});

authRouter.post('/signup', authLimiter, async (req, res, next) => {
  try {
    const body = signupSchema.parse(req.body);
    const email = body.email.toLowerCase();
    const existing = await query('SELECT 1 FROM users WHERE email = $1', [email]);
    if (existing.rows.length) throw new HttpError(409, 'email_taken', 'Email already registered');

    const hash = await hashPassword(body.password);
    const name = body.name || email.split('@')[0];
    const { rows } = await query(
      `INSERT INTO users (email, password_hash, name)
       VALUES ($1, $2, $3) RETURNING *`,
      [email, hash, name]
    );
    const user = rows[0];
    const token = signAuthToken(user);
    sendWelcome({ to: user.email, name: user.name }).catch(() => {});
    res.status(201).json({ token, user: serializeUser(user) });
  } catch (err) {
    next(err);
  }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post('/login', authLimiter, async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);
    const email = body.email.toLowerCase();
    const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];
    if (!user) throw new HttpError(401, 'invalid_credentials', 'Invalid email or password');
    const ok = await verifyPassword(body.password, user.password_hash);
    if (!ok) throw new HttpError(401, 'invalid_credentials', 'Invalid email or password');
    const token = signAuthToken(user);
    res.json({ token, user: serializeUser(user) });
  } catch (err) {
    next(err);
  }
});

authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ user: serializeUser(req.user) });
});
