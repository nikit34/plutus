import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import { config } from './config.js';
import { pool } from './db.js';
import { ensureStorage, storageRoot } from './lib/storage.js';
import { notFound, errorHandler } from './middleware/error.js';

import { authRouter } from './routes/auth.js';
import { productsRouter } from './routes/products.js';
import { publicRouter } from './routes/public.js';
import { checkoutRouter } from './routes/checkout.js';
import { webhookRouter } from './routes/webhooks.js';
import { downloadsRouter } from './routes/downloads.js';
import { walletRouter } from './routes/wallet.js';
import { analyticsRouter } from './routes/analytics.js';
import { notificationsRouter } from './routes/notifications.js';
import { settingsRouter } from './routes/settings.js';

const app = express();
app.set('trust proxy', 1);

// CORS
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (config.corsOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`Origin ${origin} not allowed`));
  },
  credentials: true,
}));

// Stripe webhook must use raw body — mount BEFORE json parser.
// Inside webhookRouter, the route is POST /stripe, so mount at /api/webhooks.
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRouter);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Generic API rate limit
const apiLimiter = rateLimit({ windowMs: 60 * 1000, max: 240, standardHeaders: true, legacyHeaders: false });
app.use('/api', apiLimiter);

// Serve stored files (covers, avatars). Content files are NOT served here — they go through download tokens.
app.use('/files', express.static(storageRoot(), {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=86400');
  },
}));

// Health
app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, env: config.env });
  } catch (err) {
    res.status(503).json({ ok: false, error: 'db_down' });
  }
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/public', publicRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/access', downloadsRouter);
app.use('/api/wallet', walletRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/settings', settingsRouter);

app.use(notFound);
app.use(errorHandler);

async function start() {
  await ensureStorage();
  app.listen(config.port, () => {
    console.log(`[plutus-backend] listening on :${config.port}  (env=${config.env})`);
    console.log(`[plutus-backend] storage at: ${path.resolve(storageRoot())}`);
  });
}

start().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
