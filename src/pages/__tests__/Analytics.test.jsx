import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/render';
import Analytics from '../Analytics';

describe('Job 3: Analyze and optimize', () => {
  it('shows page title', () => {
    renderWithProviders(<Analytics />);
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  it('shows 4 key metrics', () => {
    renderWithProviders(<Analytics />);
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getAllByText('Sales').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Views').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Conversion').length).toBeGreaterThanOrEqual(1);
  });

  it('shows earnings trend chart', () => {
    renderWithProviders(<Analytics />);
    expect(screen.getByText(/earnings trend/i)).toBeInTheDocument();
    expect(screen.getByText(/last 7 months/i)).toBeInTheDocument();
    expect(screen.getByText('Oct')).toBeInTheDocument();
    expect(screen.getByText('Apr')).toBeInTheDocument();
  });

  it('shows AI forecast with potential', () => {
    renderWithProviders(<Analytics />);
    expect(screen.getByText(/ai forecast/i)).toBeInTheDocument();
    expect(screen.getByText(/total potential/i)).toBeInTheDocument();
    expect(screen.getByText(/unrealized revenue/i)).toBeInTheDocument();
  });

  it('shows revenue by product', () => {
    renderWithProviders(<Analytics />);
    expect(screen.getByText(/revenue by product/i)).toBeInTheDocument();
  });

  it('shows best conversion ranking', () => {
    renderWithProviders(<Analytics />);
    expect(screen.getByText(/best conversion/i)).toBeInTheDocument();
  });

  it('shows product breakdown table', () => {
    renderWithProviders(<Analytics />);
    expect(screen.getByText(/product breakdown/i)).toBeInTheDocument();
    expect(screen.getAllByText('Notion System for Freelancers').length).toBeGreaterThanOrEqual(1);
  });
});
