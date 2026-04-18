import crypto from 'node:crypto';
import { query } from '../db.js';

export function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60);
}

export async function uniqueProductSlug(title) {
  const base = slugify(title) || 'product';
  for (let i = 0; i < 5; i++) {
    const candidate = i === 0 ? base : `${base}-${crypto.randomBytes(3).toString('hex')}`;
    const { rows } = await query('SELECT 1 FROM products WHERE slug = $1', [candidate]);
    if (!rows.length) return candidate;
  }
  return `${base}-${crypto.randomBytes(5).toString('hex')}`;
}
