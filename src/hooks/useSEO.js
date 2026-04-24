import { useEffect } from 'react';

const SITE = 'https://plutus.firstmessage.ru';
const DEFAULT_ROBOTS = 'index, follow, max-image-preview:large';
const NOINDEX_ROBOTS = 'noindex, nofollow';

function upsertMeta(selector, createAttrs, content) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    Object.entries(createAttrs).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function useSEO({
  title,
  description,
  canonicalPath,
  noindex = false,
  image,
  jsonLd,
} = {}) {
  const serializedJsonLd = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    if (title) {
      document.title = title;
      upsertMeta('meta[property="og:title"]', { property: 'og:title' }, title);
      upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, title);
    }
    if (description) {
      upsertMeta('meta[name="description"]', { name: 'description' }, description);
      upsertMeta('meta[property="og:description"]', { property: 'og:description' }, description);
      upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, description);
    }
    if (canonicalPath) {
      const href = canonicalPath.startsWith('http') ? canonicalPath : `${SITE}${canonicalPath}`;
      upsertLink('canonical', href);
      upsertMeta('meta[property="og:url"]', { property: 'og:url' }, href);
    }
    if (image) {
      upsertMeta('meta[property="og:image"]', { property: 'og:image' }, image);
      upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image' }, image);
    }
    upsertMeta(
      'meta[name="robots"]',
      { name: 'robots' },
      noindex ? NOINDEX_ROBOTS : DEFAULT_ROBOTS,
    );

    let scriptEl = null;
    if (serializedJsonLd) {
      scriptEl = document.createElement('script');
      scriptEl.type = 'application/ld+json';
      scriptEl.setAttribute('data-seo-dynamic', '1');
      scriptEl.textContent = serializedJsonLd;
      document.head.appendChild(scriptEl);
    }
    return () => {
      if (scriptEl) scriptEl.remove();
    };
  }, [title, description, canonicalPath, noindex, image, serializedJsonLd]);
}
