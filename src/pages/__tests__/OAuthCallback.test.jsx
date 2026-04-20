import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import OAuthCallback from '../OAuthCallback';
import { AuthProvider } from '../../contexts/AuthContext';

beforeEach(() => {
  globalThis.fetch = vi.fn();
  try { localStorage.removeItem('plutus_token'); } catch { /* jsdom variant */ }
});

function renderAt(hash) {
  window.history.replaceState(null, '', '/oauth/callback' + hash);
  return render(
    <MemoryRouter initialEntries={['/oauth/callback' + hash]}>
      <AuthProvider>
        <Routes>
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          <Route path="*" element={<div>redirected</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('OAuthCallback', () => {
  it('shows error UI when the provider returned an error', async () => {
    renderAt('#error=bad_state');
    await waitFor(() => expect(screen.getByText(/sign-in failed/i)).toBeInTheDocument());
    expect(screen.getByText(/bad_state/)).toBeInTheDocument();
  });

  it('shows error UI when no token present', async () => {
    renderAt('');
    await waitFor(() => expect(screen.getByText(/sign-in failed/i)).toBeInTheDocument());
    expect(screen.getByText(/missing_token/)).toBeInTheDocument();
  });
});
