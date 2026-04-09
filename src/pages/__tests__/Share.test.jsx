import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/render';
import CreateProduct from '../CreateProduct';

describe('Job: Share product link on social', () => {
  it('shows share buttons after product creation', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateProduct />);
    await user.type(screen.getByPlaceholderText(/notion system/i), 'Test');
    await user.type(screen.getByPlaceholderText('29'), '10');
    await user.click(screen.getByRole('button', { name: /create product/i }));
    expect(screen.getByText(/share/i)).toBeInTheDocument();
  });

  it('shows Telegram, WhatsApp, X links', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateProduct />);
    await user.type(screen.getByPlaceholderText(/notion system/i), 'Test');
    await user.type(screen.getByPlaceholderText('29'), '10');
    await user.click(screen.getByRole('button', { name: /create product/i }));
    expect(screen.getByTitle('Telegram')).toBeInTheDocument();
    expect(screen.getByTitle('WhatsApp')).toBeInTheDocument();
    expect(screen.getByTitle('X')).toBeInTheDocument();
  });

  it('has copy link button', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateProduct />);
    await user.type(screen.getByPlaceholderText(/notion system/i), 'Test');
    await user.type(screen.getByPlaceholderText('29'), '10');
    await user.click(screen.getByRole('button', { name: /create product/i }));
    expect(screen.getByRole('button', { name: /copy link/i })).toBeInTheDocument();
  });

  it('share links contain correct URLs', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateProduct />);
    await user.type(screen.getByPlaceholderText(/notion system/i), 'My product');
    await user.type(screen.getByPlaceholderText('29'), '5');
    await user.click(screen.getByRole('button', { name: /create product/i }));
    expect(screen.getByTitle('Telegram').getAttribute('href')).toContain('t.me/share');
    expect(screen.getByTitle('WhatsApp').getAttribute('href')).toContain('wa.me');
  });
});
