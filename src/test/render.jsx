import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { StoreProvider } from '../data/store';
import Notifications from '../components/Notifications';

export function renderWithProviders(ui, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <StoreProvider>
        <Notifications />
        {ui}
      </StoreProvider>
    </MemoryRouter>
  );
}
