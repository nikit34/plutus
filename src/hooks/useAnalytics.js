import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GA_ID = import.meta.env.VITE_GA_ID;
const YM_ID = import.meta.env.VITE_YM_ID;

let gaInitialized = false;
let ymInitialized = false;

function initGA() {
  if (gaInitialized || !GA_ID) return;
  gaInitialized = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { send_page_view: false });
}

function initYM() {
  if (ymInitialized || !YM_ID) return;
  ymInitialized = true;

  // Standard Yandex.Metrika snippet (manual page-view tracking via ym('hit', ...))
  (function (m, e, t, r, i, k, a) {
    m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
    m[i].l = 1 * new Date();
    for (let j = 0; j < document.scripts.length; j++) {
      if (document.scripts[j].src === r) return;
    }
    k = e.createElement(t); a = e.getElementsByTagName(t)[0];
    k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

  window.ym(YM_ID, 'init', {
    defer: true,
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: false,
  });
}

export function trackEvent(name, params) {
  if (GA_ID && typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }
  if (YM_ID && typeof window.ym === 'function') {
    window.ym(YM_ID, 'reachGoal', name, params);
  }
}

export function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    initGA();
    initYM();
  }, []);

  useEffect(() => {
    const path = location.pathname + location.search;
    if (GA_ID && typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
    if (YM_ID && typeof window.ym === 'function') {
      window.ym(YM_ID, 'hit', window.location.href, {
        title: document.title,
        referer: document.referrer,
      });
    }
  }, [location.pathname, location.search]);
}
