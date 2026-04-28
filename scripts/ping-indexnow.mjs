#!/usr/bin/env node
// ping-indexnow: notify Bing, Yandex, Naver, Seznam, and Yep that the URLs
// in our sitemap have changed. Gated by INDEXNOW=1 so local builds skip.
//
// Usage:
//   INDEXNOW=1 node scripts/ping-indexnow.mjs
//   INDEXNOW=1 DRY_RUN=1 node scripts/ping-indexnow.mjs   # log payload, no POST

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const root = join(here, '..');

const KEY = '3c81c246ca707743010eb365f03b2a72189bc97e055e417a10f403634223dd3e';
const SITE = (process.env.SITE_URL || 'https://plutus.firstmessage.ru').replace(/\/$/, '');
const KEY_LOCATION = `${SITE}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/IndexNow';
const DRY = process.env.DRY_RUN === '1';

if (process.env.INDEXNOW !== '1') {
  console.log('ping-indexnow: skipped (set INDEXNOW=1 to enable)');
  process.exit(0);
}

async function readSitemapUrls() {
  const xml = await readFile(join(root, 'public', 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function main() {
  const urlList = await readSitemapUrls();
  if (urlList.length === 0) {
    console.error('ping-indexnow: empty sitemap');
    process.exit(1);
  }
  const host = new URL(SITE).host;
  const body = { host, key: KEY, keyLocation: KEY_LOCATION, urlList };

  console.log(`ping-indexnow: ${urlList.length} URLs → ${ENDPOINT} (host=${host})`);

  if (DRY) {
    console.log(JSON.stringify(body, null, 2));
    return;
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });
  const text = await res.text().catch(() => '');
  // 200 = accepted, 202 = accepted (async), 422 = key/host validation failed
  // (e.g. key file not yet deployed on first run — expected on first build),
  // 429 = throttled, 4xx/5xx = error. Warn-only — never fail the build.
  console.log(`ping-indexnow: HTTP ${res.status} ${res.statusText}${text ? ` — ${text.slice(0, 200)}` : ''}`);
}

main().catch((err) => {
  // Don't fail the build because of a notification step.
  console.warn('ping-indexnow:', err.message);
});
