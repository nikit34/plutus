import { describe, it, expect, beforeAll } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { renderWithProviders } from '../../test/render';
import Dashboard from '../Dashboard';
import ProductPublic from '../ProductPublic';
import Settings from '../Settings';

beforeAll(() => { window.__NUMI_TEST__ = true; });

function renderProductPage(productId = 'prod_01') {
  return render(
    <MemoryRouter initialEntries={[`/product/${productId}`]}>
      <Routes><Route path="/product/:id" element={<ProductPublic />} /></Routes>
    </MemoryRouter>
  );
}

async function purchaseProduct(user) {
  await user.click(screen.getByRole('button', { name: /buy for/i }));
  await user.click(screen.getByText('Card'));
  await waitFor(() => {
    expect(screen.getByText(/payment successful/i)).toBeInTheDocument();
  });
}

describe('Job: Build audience', () => {
  describe('After purchase — follow creator', () => {
    it('shows follow prompt after purchase', async () => {
      const user = userEvent.setup();
      renderProductPage('prod_01');
      await purchaseProduct(user);
      expect(screen.getByText(/follow the creator/i)).toBeInTheDocument();
    });

    it('shows creator name', async () => {
      const user = userEvent.setup();
      renderProductPage('prod_01');
      await purchaseProduct(user);
      expect(screen.getByText('Alex Carter')).toBeInTheDocument();
    });

    it('shows follow button with link', async () => {
      const user = userEvent.setup();
      renderProductPage('prod_01');
      await purchaseProduct(user);
      const followLink = screen.getByText(/follow on youtube/i);
      expect(followLink).toBeInTheDocument();
      expect(followLink.closest('a').getAttribute('href')).toBeTruthy();
    });

    it('shows follower count', async () => {
      const user = userEvent.setup();
      renderProductPage('prod_01');
      await purchaseProduct(user);
      expect(screen.getByText(/12,400\+?\s*followers/i)).toBeInTheDocument();
    });
  });

  describe('Dashboard — audience widget', () => {
    it('shows audience widget with follower count', () => {
      renderWithProviders(<Dashboard />);
      expect(screen.getByText('Audience')).toBeInTheDocument();
      expect(screen.getByText(/12,400/)).toBeInTheDocument();
    });

    it('shows follower growth', () => {
      renderWithProviders(<Dashboard />);
      expect(screen.getByText(/\+12\.4%/)).toBeInTheDocument();
    });

    it('shows social channel label', () => {
      renderWithProviders(<Dashboard />);
      expect(screen.getAllByText(/youtube/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Settings — social channel', () => {
    it('shows social channel field', () => {
      renderWithProviders(<Settings />);
      expect(screen.getByText(/social channel/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/youtube\.com/i)).toBeInTheDocument();
    });

    it('shows label field', () => {
      renderWithProviders(<Settings />);
      expect(screen.getByPlaceholderText(/label/i)).toBeInTheDocument();
    });

    it('explains what the channel is for', () => {
      renderWithProviders(<Settings />);
      expect(screen.getByText(/buyers will see a follow prompt/i)).toBeInTheDocument();
    });
  });
});
