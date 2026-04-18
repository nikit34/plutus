import { verifyAuthToken } from '../lib/jwt.js';
import { query } from '../db.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'unauthorized' });
    const payload = verifyAuthToken(token);
    const { rows } = await query('SELECT * FROM users WHERE id = $1', [payload.sub]);
    if (!rows.length) return res.status(401).json({ error: 'unauthorized' });
    req.user = rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ error: 'unauthorized' });
  }
}
