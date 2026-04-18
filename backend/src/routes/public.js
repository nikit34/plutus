import { Router } from 'express';
import crypto from 'node:crypto';
import { query } from '../db.js';
import { serializeProduct } from '../lib/serialize.js';
import { HttpError } from '../middleware/error.js';

export const publicRouter = Router();

publicRouter.get('/products/:slug', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT p.*, u.name AS seller_name, u.avatar_url AS seller_avatar, u.social_link AS seller_social_link,
              u.social_label AS seller_social_label, u.subscribers AS seller_subscribers,
              COALESCE(pur.sales, 0) AS sales,
              COALESCE(ev.views, 0) AS views
       FROM products p
       JOIN users u ON u.id = p.user_id
       LEFT JOIN (SELECT product_id, COUNT(*)::int AS sales FROM purchases WHERE status='paid' GROUP BY product_id) pur ON pur.product_id = p.id
       LEFT JOIN (SELECT product_id, COUNT(*)::int AS views FROM events WHERE type='view' GROUP BY product_id) ev ON ev.product_id = p.id
       WHERE p.slug = $1 AND p.status <> 'archived'`,
      [req.params.slug]
    );
    if (!rows.length) throw new HttpError(404, 'not_found');
    const row = rows[0];
    const product = serializeProduct(row);
    product.seller = {
      name: row.seller_name,
      avatar: row.seller_avatar,
      socialLink: row.seller_social_link,
      socialLabel: row.seller_social_label,
      subscribers: row.seller_subscribers,
    };
    res.json({ product });
  } catch (err) { next(err); }
});

publicRouter.post('/products/:slug/events', async (req, res, next) => {
  try {
    const { type } = req.body || {};
    if (!['view', 'click_buy'].includes(type)) return res.status(400).json({ error: 'bad_type' });

    const { rows } = await query('SELECT id, user_id FROM products WHERE slug = $1', [req.params.slug]);
    if (!rows.length) return res.status(404).json({ error: 'not_found' });
    const p = rows[0];

    const ip = req.headers['x-forwarded-for']?.toString().split(',')[0].trim() || req.ip || '';
    const ua = req.headers['user-agent'] || '';
    const visitorHash = crypto.createHash('sha256').update(`${ip}|${ua}|${new Date().toISOString().slice(0, 10)}`).digest('hex');

    // Dedupe views per visitor per day
    if (type === 'view') {
      const { rows: existing } = await query(
        `SELECT 1 FROM events
         WHERE product_id=$1 AND type='view' AND visitor_hash=$2
           AND created_at >= now() - INTERVAL '1 day' LIMIT 1`,
        [p.id, visitorHash]
      );
      if (existing.length) return res.json({ ok: true, deduped: true });
    }

    await query(
      `INSERT INTO events (product_id, user_id, type, visitor_hash, meta)
       VALUES ($1, $2, $3, $4, $5)`,
      [p.id, p.user_id, type, visitorHash, req.body?.meta || null]
    );
    res.json({ ok: true });
  } catch (err) { next(err); }
});
