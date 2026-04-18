import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { config } from '../config.js';

export function storageRoot() {
  return path.resolve(config.storageDir);
}

export async function ensureStorage() {
  await fs.mkdir(storageRoot(), { recursive: true });
}

export async function userDir(userId, kind /* 'covers' | 'content' */) {
  const dir = path.join(storageRoot(), String(userId), kind);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

export function randomFileName(originalName) {
  const ext = path.extname(originalName || '').slice(0, 10);
  return crypto.randomBytes(16).toString('hex') + (ext || '');
}

export async function removeIfExists(absPath) {
  if (!absPath) return;
  try {
    await fs.unlink(absPath);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
}

export function toRelative(absPath) {
  if (!absPath) return null;
  return path.relative(storageRoot(), absPath);
}

export function toAbsolute(relPath) {
  if (!relPath) return null;
  return path.join(storageRoot(), relPath);
}
