#!/usr/bin/env node
import { readdir, stat, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const root = join(here, '..');
const publicDir = join(root, 'public');

const SITE = process.env.SITE_URL?.replace(/\/$/, '') || 'https://plutus.firstmessage.ru';

const SPA_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
];

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full)));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

function toUrlPath(file) {
  const rel = relative(publicDir, file).split(sep).join('/');
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'index.html'.length);
  return '/' + rel;
}

async function buildEntries() {
  let files = [];
  try { files = await walk(publicDir); } catch {}
  const htmlRoutes = files.map((f) => ({
    path: toUrlPath(f),
    changefreq: 'monthly',
    priority: '0.7',
    lastmod: undefined,
  }));
  const all = [...SPA_ROUTES, ...htmlRoutes];
  const seen = new Set();
  return all.filter((r) => (seen.has(r.path) ? false : seen.add(r.path)));
}

async function getLastMod(file) {
  try { return (await stat(file)).mtime.toISOString().slice(0, 10); } catch { return undefined; }
}

async function main() {
  const entries = await buildEntries();
  const urls = await Promise.all(entries.map(async (e) => {
    let lastmod = e.lastmod;
    if (e.path !== '/') {
      const rel = e.path === '/' ? 'index.html' : e.path.replace(/^\//, '');
      lastmod = await getLastMod(join(publicDir, rel));
    }
    return { ...e, lastmod };
  }));

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((u) => [
      '  <url>',
      `    <loc>${SITE}${u.path === '/' ? '/' : u.path}</loc>`,
      u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>` : null,
      `    <changefreq>${u.changefreq}</changefreq>`,
      `    <priority>${u.priority}</priority>`,
      '  </url>',
    ].filter(Boolean).join('\n')),
    '</urlset>',
    '',
  ].join('\n');

  const out = join(publicDir, 'sitemap.xml');
  await writeFile(out, xml, 'utf8');
  console.log(`sitemap: ${urls.length} URLs → ${relative(root, out)}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
