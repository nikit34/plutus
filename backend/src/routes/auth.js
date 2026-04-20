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
import {
  PROVIDERS, isProviderConfigured, redirectUri, generatePkce,
  signState, verifyState, exchangeCodeForToken, fetchUserInfo,
} from '../lib/oauth.js';
import { config } from '../config.js';

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

// --- OAuth (Google, X) ---

const VERIFIER_COOKIE = 'plutus_oauth_verifier';

function setVerifierCookie(res, value) {
  res.setHeader('Set-Cookie',
    `${VERIFIER_COOKIE}=${value}; HttpOnly; Path=/api/auth/oauth; Max-Age=600; SameSite=Lax`);
}
function clearVerifierCookie(res) {
  res.setHeader('Set-Cookie',
    `${VERIFIER_COOKIE}=; HttpOnly; Path=/api/auth/oauth; Max-Age=0; SameSite=Lax`);
}
function readCookie(req, name) {
  const raw = req.headers.cookie;
  if (!raw) return null;
  const pairs = raw.split(';');
  for (const p of pairs) {
    const idx = p.indexOf('=');
    if (idx < 0) continue;
    const k = p.slice(0, idx).trim();
    if (k === name) return decodeURIComponent(p.slice(idx + 1).trim());
  }
  return null;
}

authRouter.get('/oauth/providers', (_req, res) => {
  res.json({
    google: isProviderConfigured('google'),
    x: isProviderConfigured('x'),
  });
});

authRouter.get('/oauth/:provider/start', (req, res, next) => {
  try {
    const name = req.params.provider;
    if (!PROVIDERS[name]) throw new HttpError(404, 'unknown_provider');
    if (!isProviderConfigured(name)) throw new HttpError(500, 'provider_not_configured');

    const { verifier, challenge } = generatePkce();
    const nonce = Math.random().toString(36).slice(2);
    const state = signState({ provider: name, nonce });
    setVerifierCookie(res, verifier);

    const p = PROVIDERS[name];
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: p.clientId(),
      redirect_uri: redirectUri(name),
      scope: p.scope,
      state,
      code_challenge: challenge,
      code_challenge_method: 'S256',
    });
    if (name === 'google') params.append('access_type', 'online');
    res.redirect(`${p.authUrl}?${params.toString()}`);
  } catch (err) { next(err); }
});

authRouter.get('/oauth/:provider/callback', async (req, res) => {
  const name = req.params.provider;
  const returnToBrowser = (status, errorCode) => {
    const base = `${config.frontendBaseUrl}/oauth/callback`;
    if (status === 'ok') return res.redirect(`${base}#token=${encodeURIComponent(errorCode)}`);
    return res.redirect(`${base}#error=${encodeURIComponent(errorCode)}`);
  };

  try {
    if (!PROVIDERS[name]) return returnToBrowser('err', 'unknown_provider');
    const { code, state, error } = req.query;
    if (error) return returnToBrowser('err', String(error));
    if (!code || !state) return returnToBrowser('err', 'missing_params');

    const payload = verifyState(String(state));
    if (!payload || payload.provider !== name) return returnToBrowser('err', 'bad_state');

    const verifier = readCookie(req, VERIFIER_COOKIE);
    clearVerifierCookie(res);
    if (!verifier) return returnToBrowser('err', 'missing_verifier');

    const tokenResp = await exchangeCodeForToken(name, String(code), verifier);
    const info = await fetchUserInfo(name, tokenResp.access_token);

    // Find-or-create user.
    const { rows: byOauth } = await query(
      'SELECT * FROM users WHERE oauth_provider=$1 AND oauth_subject=$2',
      [name, info.subject]
    );
    let user = byOauth[0];

    if (!user && info.email) {
      const { rows: byEmail } = await query('SELECT * FROM users WHERE email=$1', [info.email.toLowerCase()]);
      if (byEmail[0]) {
        const { rows: updated } = await query(
          `UPDATE users SET oauth_provider=$1, oauth_subject=$2, updated_at=now()
           WHERE id=$3 RETURNING *`,
          [name, info.subject, byEmail[0].id]
        );
        user = updated[0];
      }
    }

    if (!user) {
      const email = info.email
        ? info.email.toLowerCase()
        : `${name}-${info.subject}@plutus.oauth`;
      const displayName = info.name || (info.username ? `@${info.username}` : email.split('@')[0]);
      const { rows: inserted } = await query(
        `INSERT INTO users (email, name, oauth_provider, oauth_subject)
         VALUES ($1,$2,$3,$4) RETURNING *`,
        [email, displayName, name, info.subject]
      );
      user = inserted[0];
      if (info.email) sendWelcome({ to: user.email, name: user.name }).catch(() => {});
    }

    const jwt = signAuthToken(user);
    return returnToBrowser('ok', jwt);
  } catch (err) {
    console.error(`OAuth ${name} callback error:`, err);
    return res.redirect(`${config.frontendBaseUrl}/oauth/callback#error=${encodeURIComponent(err.message || 'oauth_failed')}`);
  }
});
