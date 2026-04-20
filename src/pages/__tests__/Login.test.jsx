import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../Login';
import { AuthProvider } from '../../contexts/AuthContext';

beforeEach(() => {
  // AuthProvider bootstraps via /auth/me; OAuthButtons fetches /auth/oauth/providers.
  // Return "no token" + no providers so tests render deterministically.
  globalThis.fetch = vi.fn((url) => {
    if (String(url).includes('/oauth/providers')) {
      return Promise.resolve({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ google: false, x: false }),
      });
    }
    return Promise.reject(new Error(`unexpected fetch: ${url}`));
  });
  try { localStorage.removeItem('plutus_token'); } catch { /* jsdom variant */ }
});

function renderLogin() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('Login page', () => {
  it('shows email + password fields', () => {
    const { container } = renderLogin();
    expect(container.querySelector('input[type="email"]')).toBeInTheDocument();
    expect(container.querySelector('input[type="password"]')).toBeInTheDocument();
  });

  it('shows sign-in submit button', () => {
    renderLogin();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('links to signup page', () => {
    renderLogin();
    expect(screen.getByRole('link', { name: /create one/i })).toHaveAttribute('href', '/signup');
  });
});
