import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/render';
import Wallet from '../Wallet';

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

  it('shows notification on withdrawal', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Wallet />);
    await user.click(screen.getByRole('button', { name: /withdraw funds/i }));
    expect(screen.getByText(/withdrawal request sent/i)).toBeInTheDocument();
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
    expect(screen.getByText(/feb 28, 2026/i)).toBeInTheDocument();
  });

  it('shows platform fee', () => {
    renderWithProviders(<Wallet />);
    expect(screen.getByText(/platform fee/i)).toBeInTheDocument();
    expect(screen.getByText(/5%/)).toBeInTheDocument();
  });
});
