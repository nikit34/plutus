import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Landing from '../Landing';

function renderLanding() {
  return render(
    <MemoryRouter>
      <Landing />
    </MemoryRouter>
  );
}

describe('Landing page', () => {
  it('shows the hero headline', () => {
    renderLanding();
    expect(screen.getByText(/sell digital products/i)).toBeInTheDocument();
  });

  it('shows a primary signup CTA', () => {
    renderLanding();
    const ctas = screen.getAllByRole('link', { name: /start.*free/i });
    expect(ctas.length).toBeGreaterThan(0);
    expect(ctas[0]).toHaveAttribute('href', '/signup');
  });

  it('shows the 5% fee in pricing', () => {
    renderLanding();
    expect(screen.getAllByText(/5%/).length).toBeGreaterThan(0);
  });

  it('includes FAQ section', () => {
    renderLanding();
    expect(screen.getByText(/good questions/i)).toBeInTheDocument();
  });
});
