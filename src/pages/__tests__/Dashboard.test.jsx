import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/render';
import Dashboard from '../Dashboard';

describe('Job 2: Check what is new (feed)', () => {
  it('greets creator by name', () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByText(/hey/i)).toBeInTheDocument();
    expect(screen.getByText(/alex/i)).toBeInTheDocument();
  });

  it('shows today metrics: earnings, sales, views', () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByText(/earned today/i)).toBeInTheDocument();
    expect(screen.getByText(/sales today/i)).toBeInTheDocument();
    expect(screen.getByText(/views today/i)).toBeInTheDocument();
  });

  it('shows percentage changes', () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByText(/\+18\.5%/)).toBeInTheDocument();
    expect(screen.getByText(/\+40%/)).toBeInTheDocument();
    expect(screen.getByText(/\+12\.3%/)).toBeInTheDocument();
  });

  it('shows activity feed with sales', () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByText('Feed')).toBeInTheDocument();
    expect(screen.getAllByText(/notion system for freelancers/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/figma ui kit/i).length).toBeGreaterThanOrEqual(1);
  });

  it('shows milestone events', () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByText(/hit 400 sales/i)).toBeInTheDocument();
  });

  it('shows AI tip of the day', () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByText(/tip of the day/i)).toBeInTheDocument();
    expect(screen.getAllByText(/raise price/i).length).toBeGreaterThanOrEqual(1);
  });

  it('shows quick actions', () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByText(/create new product/i)).toBeInTheDocument();
    expect(screen.getByText(/view analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/withdraw funds/i)).toBeInTheDocument();
  });

  it('shows audience widget', () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByText('Audience')).toBeInTheDocument();
    expect(screen.getByText(/12,400/)).toBeInTheDocument();
  });
});
