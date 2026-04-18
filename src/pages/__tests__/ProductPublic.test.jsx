import { describe, it, expect, beforeAll } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProductPublic from '../ProductPublic';

beforeAll(() => { window.__PLUTUS_TEST__ = true; });

function renderProductPage(productId = 'prod_01') {
  return render(
    <MemoryRouter initialEntries={[`/product/${productId}`]}>
      <Routes><Route path="/product/:id" element={<ProductPublic />} /></Routes>
    </MemoryRouter>
  );
}

describe('Job 5: Buyer purchases and gets content', () => {
  it('shows product info', () => {
    renderProductPage('prod_01');
    expect(screen.getByText('Notion System for Freelancers')).toBeInTheDocument();
    expect(screen.getByText(/complete project/i)).toBeInTheDocument();
  });

  it('shows price and buy button', () => {
    renderProductPage('prod_01');
    expect(screen.getAllByText(/\$29/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /buy for/i })).toBeInTheDocument();
  });

  it('shows social proof', () => {
    renderProductPage('prod_01');
    expect(screen.getByText(/412\+ bought/)).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
  });

  it('shows trust signals', () => {
    renderProductPage('prod_01');
    expect(screen.getByText(/instant access/i)).toBeInTheDocument();
    expect(screen.getByText(/lifetime access/i)).toBeInTheDocument();
    expect(screen.getByText(/secure checkout via stripe/i)).toBeInTheDocument();
  });

  it('shows content preview before purchase', () => {
    renderProductPage('prod_01');
    expect(screen.getByText(/what you get/i)).toBeInTheDocument();
  });

  it('shows payment method selection after clicking Buy', async () => {
    const user = userEvent.setup();
    renderProductPage('prod_01');
    await user.click(screen.getByRole('button', { name: /buy for/i }));
    expect(screen.getByText(/payment method/i)).toBeInTheDocument();
    expect(screen.getByText('Card')).toBeInTheDocument();
    expect(screen.getByText('Apple Pay')).toBeInTheDocument();
    expect(screen.getByText('Google Pay')).toBeInTheDocument();
  });

  it('shows content after completing payment', async () => {
    const user = userEvent.setup();
    renderProductPage('prod_01');

    await user.click(screen.getByRole('button', { name: /buy for/i }));
    await user.click(screen.getByText('Card'));

    await waitFor(() => {
      expect(screen.getByText(/payment successful/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/open notion template/i)).toBeInTheDocument();
  });

  it('shows follow prompt after purchase', async () => {
    const user = userEvent.setup();
    renderProductPage('prod_01');

    await user.click(screen.getByRole('button', { name: /buy for/i }));
    await user.click(screen.getByText('Card'));

    await waitFor(() => {
      expect(screen.getByText(/follow the creator/i)).toBeInTheDocument();
    });
    expect(screen.getByText('Alex Carter')).toBeInTheDocument();
  });

  it('does not require email', () => {
    renderProductPage('prod_01');
    expect(screen.queryByPlaceholderText(/mail/i)).not.toBeInTheDocument();
  });
});
