import { Router } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { query } from '../db.js';
import { HttpError } from '../middleware/error.js';
import { toAbsolute } from '../lib/storage.js';

export const downloadsRouter = Router();

// GET /api/access/:token — returns product access info for the buyer (content + download link)
downloadsRouter.get('/:token', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT pu.*, p.title AS product_title, p.slug AS product_slug, p.theme, p.content_type,
              p.content_file_name, p.content_file_size, p.content_url, p.content_label, p.content_body,
              p.content_file_path
       FROM purchases pu JOIN products p ON p.id = pu.product_id
       WHERE pu.download_token = $1 AND pu.status = 'paid'`,
      [req.params.token]
    );
    const row = rows[0];
    if (!row) throw new HttpError(404, 'invalid_token');
    res.json({
      productTitle: row.product_title,
      productSlug: row.product_slug,
      theme: row.theme,
      content: serializeBuyerContent(row),
      fileDownloadUrl: row.content_type === 'file' && row.content_file_path ? `/api/access/${req.params.token}/file` : null,
    });
  } catch (err) { next(err); }
});

downloadsRouter.get('/:token/file', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT pu.download_token, p.content_file_path, p.content_file_name, p.content_type
       FROM purchases pu JOIN products p ON p.id = pu.product_id
       WHERE pu.download_token = $1 AND pu.status = 'paid'`,
      [req.params.token]
    );
    const row = rows[0];
    if (!row || row.content_type !== 'file' || !row.content_file_path) throw new HttpError(404, 'not_found');
    const abs = toAbsolute(row.content_file_path);
    if (!fs.existsSync(abs)) throw new HttpError(404, 'file_missing');
    res.download(abs, row.content_file_name || path.basename(abs));
  } catch (err) { next(err); }
});

function serializeBuyerContent(row) {
  if (row.content_type === 'file') {
    return { type: 'file', fileName: row.content_file_name, fileSize: row.content_file_size };
  }
  if (row.content_type === 'link') {
    return { type: 'link', url: row.content_url, label: row.content_label };
  }
  if (row.content_type === 'text') {
    return { type: 'text', body: row.content_body };
  }
  return null;
}
