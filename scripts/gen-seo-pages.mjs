#!/usr/bin/env node
// gen-seo-pages: renders static HTML SEO pages from content/seo/*.mjs specs
// into public/{dir}/{slug}.html. Each page is self-contained (no Vite bundle),
// styled by public/seo/style.css, indexed by public/sitemap.xml.

import { readdir, mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const root = join(here, '..');
const specsDir = join(root, 'content', 'seo');
const publicDir = join(root, 'public');
const SITE = (process.env.SITE_URL || 'https://plutus.firstmessage.ru').replace(/\/$/, '');

function esc(s) {
  return String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function renderCTA(cta) {
  const cls = cta.primary ? 'btn btn-primary' : 'btn btn-secondary';
  return `<a class="${cls}" href="${esc(cta.href)}">${esc(cta.label)}</a>`;
}

function renderHero(hero) {
  return `
  <section class="hero">
    <div class="wrap hero-inner">
      ${hero.eyebrow ? `<div class="eyebrow">${esc(hero.eyebrow)}</div>` : ''}
      <h1>${hero.h1}</h1>
      ${hero.lede ? `<p class="lede">${esc(hero.lede)}</p>` : ''}
      ${hero.ctas?.length ? `<div class="cta-row">${hero.ctas.map(renderCTA).join('')}</div>` : ''}
      ${hero.proof?.length ? `<div class="hero-proof">${hero.proof.map((p) => `<span><span class="check">✓</span> ${esc(p)}</span>`).join('')}</div>` : ''}
    </div>
  </section>`;
}

function renderSection(sec) {
  if (sec.type === 'text') {
    return `
    <section>
      <div class="wrap prose">
        ${sec.eyebrow ? `<div class="section-eyebrow">${esc(sec.eyebrow)}</div>` : ''}
        <h2>${esc(sec.h2)}</h2>
        ${sec.lede ? `<p class="section-lede">${esc(sec.lede)}</p>` : ''}
        ${(sec.paragraphs || []).map((p) => `<p>${p}</p>`).join('')}
      </div>
    </section>`;
  }
  if (sec.type === 'features') {
    return `
    <section>
      <div class="wrap">
        ${sec.eyebrow ? `<div class="section-eyebrow">${esc(sec.eyebrow)}</div>` : ''}
        <h2>${esc(sec.h2)}</h2>
        ${sec.lede ? `<p class="section-lede">${esc(sec.lede)}</p>` : ''}
        <div class="grid grid-3">
          ${sec.items.map((it) => `
            <div class="card">
              <h3>${esc(it.title)}</h3>
              <p>${esc(it.body)}</p>
            </div>`).join('')}
        </div>
      </div>
    </section>`;
  }
  if (sec.type === 'compare') {
    return `
    <section>
      <div class="wrap">
        ${sec.eyebrow ? `<div class="section-eyebrow">${esc(sec.eyebrow)}</div>` : ''}
        <h2>${esc(sec.h2)}</h2>
        ${sec.lede ? `<p class="section-lede">${esc(sec.lede)}</p>` : ''}
        <div class="compare">
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th class="highlight">${esc(sec.leftName || 'Plutus')}</th>
                <th>${esc(sec.rightName)}</th>
              </tr>
            </thead>
            <tbody>
              ${sec.rows.map((r) => `
                <tr>
                  <td class="row-label">${esc(r.label)}</td>
                  <td class="highlight">${esc(r.left)}</td>
                  <td>${esc(r.right)}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </section>`;
  }
  if (sec.type === 'howto') {
    return `
    <section>
      <div class="wrap">
        ${sec.eyebrow ? `<div class="section-eyebrow">${esc(sec.eyebrow)}</div>` : ''}
        <h2>${esc(sec.h2)}</h2>
        ${sec.lede ? `<p class="section-lede">${esc(sec.lede)}</p>` : ''}
        <ol class="prose">
          ${sec.steps.map((s) => `<li><strong>${esc(s.title)}.</strong> ${s.body}</li>`).join('')}
        </ol>
      </div>
    </section>`;
  }
  throw new Error(`Unknown section type: ${sec.type}`);
}

function renderFaq(faq) {
  if (!faq?.length) return '';
  return `
  <section id="faq">
    <div class="wrap">
      <div class="section-eyebrow">FAQ</div>
      <h2 style="margin-bottom: 48px;">Good questions</h2>
      <div class="faq">
        ${faq.map((f) => `
          <details>
            <summary>${esc(f.q)}</summary>
            <div class="answer">${f.a}</div>
          </details>`).join('')}
      </div>
    </div>
  </section>`;
}

function renderFinalCTA(cta) {
  if (!cta) return '';
  return `
  <section class="final-cta">
    <div class="wrap">
      <h2>${cta.h2}</h2>
      ${cta.lede ? `<p class="section-lede" style="margin-left:auto;margin-right:auto;text-align:center;max-width:520px;">${esc(cta.lede)}</p>` : ''}
      <a class="btn btn-primary" href="${esc(cta.href || '/signup')}">${esc(cta.label || 'Start selling free')} →</a>
    </div>
  </section>`;
}

function renderLdJson(objs) {
  return (objs || []).map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n    ');
}

function faqToSchema(faq) {
  if (!faq?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: stripHtml(f.a) },
    })),
  };
}

function breadcrumbSchema(crumbs) {
  if (!crumbs?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url.startsWith('http') ? c.url : `${SITE}${c.url}`,
    })),
  };
}

function stripHtml(s) {
  return String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function renderBreadcrumbs(crumbs) {
  if (!crumbs?.length) return '';
  const parts = crumbs
    .map((c, i, arr) => (i < arr.length - 1
      ? `<a href="${esc(c.url)}">${esc(c.name)}</a>`
      : `<span>${esc(c.name)}</span>`))
    .join('<span>/</span>');
  return `<nav class="crumbs">${parts}</nav>`;
}

function renderPage(spec) {
  const canonical = spec.canonical || `${SITE}/${spec.dir ? spec.dir + '/' : ''}${spec.slug}`;
  const schemas = [
    ...(spec.schemas || []),
    faqToSchema(spec.faq),
    breadcrumbSchema(spec.breadcrumbs),
  ].filter(Boolean);

  const metaTitle = spec.metaTitle || spec.title;
  const metaDesc = spec.metaDescription || spec.description || '';
  const ogImage = spec.ogImage || `${SITE}/og-image.png`;

  return `<!doctype html>
<html lang="${spec.lang || 'en'}">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(metaTitle)}</title>
  <meta name="description" content="${esc(metaDesc)}" />
  ${spec.keywords?.length ? `<meta name="keywords" content="${esc(spec.keywords.join(', '))}" />` : ''}
  <link rel="canonical" href="${esc(canonical)}" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <meta property="og:site_name" content="Plutus" />
  <meta property="og:title" content="${esc(metaTitle)}" />
  <meta property="og:description" content="${esc(metaDesc)}" />
  <meta property="og:type" content="${spec.ogType || 'website'}" />
  <meta property="og:url" content="${esc(canonical)}" />
  <meta property="og:image" content="${esc(ogImage)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(metaTitle)}" />
  <meta name="twitter:description" content="${esc(metaDesc)}" />
  <meta name="twitter:image" content="${esc(ogImage)}" />
  <link rel="stylesheet" href="/seo/style.css" />
  ${renderLdJson(schemas)}
</head>
<body>
  <header class="nav">
    <div class="nav-inner">
      <a class="brand" href="/"><span class="brand-dot"></span>Plutus</a>
      <a class="nav-cta" href="/signup">Start free</a>
    </div>
  </header>
  ${renderBreadcrumbs(spec.breadcrumbs)}
  ${renderHero(spec.hero)}
  ${(spec.sections || []).map(renderSection).join('')}
  ${renderFaq(spec.faq)}
  ${renderFinalCTA(spec.finalCta)}
  <footer>
    <div class="wrap footer-inner">
      <a class="brand" href="/"><span class="brand-dot"></span>Plutus</a>
      <div class="footer-links">
        <a href="/">Home</a>
        <a href="/#features">Features</a>
        <a href="/#pricing">Pricing</a>
        <a href="/#faq">FAQ</a>
      </div>
    </div>
  </footer>
</body>
</html>
`;
}

const MANAGED_DIRS = ['blog', 'vs', 'for', 'alternatives', 'tools', 'glossary'];
// plus top-level files emitted from specs with dir="" — tracked separately by listing files at gen time.

async function cleanManagedDirs() {
  for (const d of MANAGED_DIRS) {
    const p = join(publicDir, d);
    if (existsSync(p)) await rm(p, { recursive: true, force: true });
  }
}

async function loadSpecs() {
  let files = [];
  try { files = await readdir(specsDir); } catch { return []; }
  const out = [];
  for (const f of files) {
    if (!f.endsWith('.mjs')) continue;
    const mod = await import(pathToFileURL(join(specsDir, f)).href);
    const spec = mod.default;
    if (!spec?.slug) throw new Error(`${f}: missing slug`);
    out.push(spec);
  }
  return out;
}

async function main() {
  const specs = await loadSpecs();
  await cleanManagedDirs();

  const emitted = [];
  for (const spec of specs) {
    const outDir = spec.dir ? join(publicDir, spec.dir) : publicDir;
    await mkdir(outDir, { recursive: true });
    const outFile = join(outDir, `${spec.slug}.html`);
    await writeFile(outFile, renderPage(spec), 'utf8');
    emitted.push({
      file: outFile,
      url: `/${spec.dir ? spec.dir + '/' : ''}${spec.slug}`,
    });
  }

  console.log(`seo: ${emitted.length} pages`);
  for (const e of emitted) console.log(`  ${e.url}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
