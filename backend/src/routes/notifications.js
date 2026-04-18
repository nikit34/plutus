import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { serializeNotification } from '../lib/serialize.js';

export const notificationsRouter = Router();

notificationsRouter.get('/', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50',
      [req.user.id]
    );
    res.json({ notifications: rows.map(serializeNotification) });
  } catch (err) { next(err); }
});

notificationsRouter.post('/read', requireAuth, async (req, res, next) => {
  try {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids : null;
    if (ids && ids.length) {
      await query('UPDATE notifications SET read_at=now() WHERE user_id=$1 AND id = ANY($2::bigint[]) AND read_at IS NULL', [req.user.id, ids]);
    } else {
      await query('UPDATE notifications SET read_at=now() WHERE user_id=$1 AND read_at IS NULL', [req.user.id]);
    }
    res.json({ ok: true });
  } catch (err) { next(err); }
});
