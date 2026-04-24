import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProductPublic from '../ProductPublic';

const mockProduct = {
  slug: 'my-test-ebook',
  title: 'My Test eBook',
  description: 'A 40-page guide to test fixtures.',
  image: 'https://example.com/cover.png',
  price: 29,
  currency: 'USD',
  theme: 'midnight',
  sales: 42,
  content: { type: 'file', fileName: 'ebook.pdf' },
};

beforeEach(() => {
  globalThis.fetch = vi.fn((url) => {
    const u = String(url);
    if (u.includes('/api/public/products/')) {
      return Promise.resolve({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ product: mockProduct }),
      });
    }
    if (u.includes('/api/public/events')) {
      return Promise.resolve({ ok: true, headers: { get: () => 'application/json' }, json: () => Promise.resolve({}) });
    }
    return Promise.reject(new Error(`unexpected fetch: ${url}`));
  });
  document.head.innerHTML = '';
});

describe('ProductPublic SEO', () => {
  it('sets title, description, canonical, and Product JSON-LD once product loads', async () => {
    render(
      <MemoryRouter initialEntries={['/product/my-test-ebook']}>
        <Routes>
          <Route path="/product/:id" element={<ProductPublic />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(document.title).toBe('My Test eBook — Plutus'));

    const desc = document.querySelector('meta[name="description"]')?.getAttribute('content');
    expect(desc).toBe('A 40-page guide to test fixtures.');

    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
    expect(canonical).toBe('https://plutus.firstmessage.ru/product/my-test-ebook');

    const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
    expect(ogImage).toBe('https://example.com/cover.png');

    const ld = document.querySelector('script[type="application/ld+json"][data-seo-dynamic]');
    expect(ld).toBeTruthy();
    const parsed = JSON.parse(ld.textContent);
    expect(parsed['@type']).toBe('Product');
    expect(parsed.name).toBe('My Test eBook');
    expect(parsed.offers.price).toBe('29');
    expect(parsed.offers.priceCurrency).toBe('USD');
    expect(parsed.url).toBe('https://plutus.firstmessage.ru/product/my-test-ebook');
  });
});
