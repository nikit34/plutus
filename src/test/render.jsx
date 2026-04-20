import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { StoreProvider } from '../data/store';

export function renderWithProviders(ui, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <StoreProvider>
          {ui}
        </StoreProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}
