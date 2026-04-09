import { describe, it, expect, beforeAll } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/render';
import Wallet from '../Wallet';

beforeAll(() => { window.__NUMI_TEST__ = true; });

describe('Job 4: Get paid (wallet)', () => {
  it('shows available balance', () => {
    renderWithProviders(<Wallet />);
    expect(screen.getByText(/available to withdraw/i)).toBeInTheDocument();
  });

  it('shows total earned', () => {
    renderWithProviders(<Wallet />);
    expect(screen.getByText(/total earned/i)).toBeInTheDocument();
  });

  it('shows paid out amount', () => {
    renderWithProviders(<Wallet />);
    expect(screen.getByText(/paid out/i)).toBeInTheDocument();
  });

  it('shows withdraw button', () => {
    renderWithProviders(<Wallet />);
    expect(screen.getByRole('button', { name: /withdraw funds/i })).toBeInTheDocument();
  });

  it('opens withdrawal modal with amount and breakdown', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Wallet />);
    await user.click(screen.getByRole('button', { name: /withdraw funds/i }));
    expect(screen.getByText(/withdrawal amount/i)).toBeInTheDocument();
    expect(screen.getByText(/stripe fee/i)).toBeInTheDocument();
    expect(screen.getByText(/you receive/i)).toBeInTheDocument();
    expect(screen.getByText(/arrives in 1-2 business days/i)).toBeInTheDocument();
  });

  it('completes full withdrawal flow: confirm → processing → done', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Wallet />);

    await user.click(screen.getByRole('button', { name: /withdraw funds/i }));
    await user.click(screen.getByRole('button', { name: /confirm withdrawal/i }));

    await waitFor(() => {
      expect(screen.getByText(/withdrawal sent/i)).toBeInTheDocument();
    });
  });

  it('updates balance after withdrawal', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Wallet />);

    await user.click(screen.getByRole('button', { name: /withdraw funds/i }));
    await user.click(screen.getByRole('button', { name: /confirm withdrawal/i }));

    await waitFor(() => { expect(screen.getByText(/withdrawal sent/i)).toBeInTheDocument(); });
    await user.click(screen.getByRole('button', { name: /done/i }));

    expect(screen.getByText(/no funds available/i)).toBeInTheDocument();
  });

  it('shows Stripe Connect as payout method', () => {
    renderWithProviders(<Wallet />);
    expect(screen.getByText(/payout method/i)).toBeInTheDocument();
    expect(screen.getByText(/stripe connect/i)).toBeInTheDocument();
    expect(screen.getByText('Connected')).toBeInTheDocument();
  });

  it('shows next payout date', () => {
    renderWithProviders(<Wallet />);
    expect(screen.getByText(/next payout/i)).toBeInTheDocument();
    expect(screen.getByText(/apr 28, 2026/i)).toBeInTheDocument();
  });

  it('shows payout history', () => {
    renderWithProviders(<Wallet />);
    expect(screen.getByText(/payout history/i)).toBeInTheDocument();
    expect(screen.getByText(/mar 28, 2026/i)).toBeInTheDocument();
  });

  it('shows platform fee', () => {
    renderWithProviders(<Wallet />);
    expect(screen.getByText(/platform fee/i)).toBeInTheDocument();
    expect(screen.getByText(/5%/)).toBeInTheDocument();
  });
});
