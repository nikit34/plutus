import '@testing-library/jest-dom';

// jsdom does not implement IntersectionObserver, which framer-motion's
// `whileInView` uses. Provide a no-op stub so components mount cleanly.
class NoopIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}
if (typeof globalThis.IntersectionObserver === 'undefined') {
  globalThis.IntersectionObserver = NoopIntersectionObserver;
  globalThis.IntersectionObserverEntry = class {};
}

// Same for ResizeObserver — some lucide / motion code paths touch it.
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Default: no network in tests. Individual tests override globalThis.fetch as needed.
globalThis.fetch = globalThis.fetch || (() => Promise.reject(new Error('network disabled in tests')));
