import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import Landing from './pages/Landing.jsx';

export function renderLanding() {
  return renderToString(
    <MemoryRouter initialEntries={['/']}>
      <Landing />
    </MemoryRouter>
  );
}
