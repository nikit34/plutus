import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/render';
import CreateProduct from '../CreateProduct';

describe('Job 1: Create product and get sharing link', () => {
  it('shows creation form with required fields', () => {
    renderWithProviders(<CreateProduct />);
    expect(screen.getByPlaceholderText(/notion system/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/describe your product/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('29')).toBeInTheDocument();
  });

  it('shows content type selector: file, link, text', () => {
    renderWithProviders(<CreateProduct />);
    expect(screen.getByText('File')).toBeInTheDocument();
    expect(screen.getByText('Link')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('switches content type and shows corresponding fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateProduct />);
    expect(screen.getByPlaceholderText(/presets\.zip/i)).toBeInTheDocument();
    await user.click(screen.getByText('Link'));
    expect(screen.getByPlaceholderText(/notion\.so/i)).toBeInTheDocument();
    await user.click(screen.getByText('Text'));
    expect(screen.getByPlaceholderText(/instructions, access codes/i)).toBeInTheDocument();
  });

  it('does not create product without title and price', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateProduct />);
    await user.click(screen.getByRole('button', { name: /create product/i }));
    expect(screen.queryByText(/link ready/i)).not.toBeInTheDocument();
  });

  it('creates product and shows shareable link', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateProduct />);
    await user.type(screen.getByPlaceholderText(/notion system/i), 'My Course');
    await user.type(screen.getByPlaceholderText('29'), '19');
    await user.click(screen.getByRole('button', { name: /create product/i }));
    expect(screen.getByText(/link ready/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copy$/i })).toBeInTheDocument();
  });

  it('shows live preview with title and price', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateProduct />);
    await user.type(screen.getByPlaceholderText(/notion system/i), 'Test Product');
    await user.type(screen.getByPlaceholderText('29'), '30');
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    const priceMatches = screen.getAllByText(/\$30/);
    expect(priceMatches.length).toBeGreaterThanOrEqual(1);
  });

  it('shows theme selector', () => {
    renderWithProviders(<CreateProduct />);
    expect(screen.getByText('Midnight')).toBeInTheDocument();
    expect(screen.getByText('Aurora')).toBeInTheDocument();
    expect(screen.getByText('Snow')).toBeInTheDocument();
  });
});
