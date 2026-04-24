import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'
import { StoreProvider } from './data/store'
import { getToken } from './api/client'

const rootEl = document.getElementById('root');
const tree = (
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <StoreProvider>
          <App />
        </StoreProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

// The build prerenders Landing into #root. Hydrate when the prerender matches
// the expected first client render (anon user on any path, since non-`/` routes
// still render their own Suspense fallback over the prerender). For authed
// users, the prerendered Landing will never match the intended view — discard
// it and mount fresh.
const hasPrerender = rootEl.firstElementChild !== null;
const hasToken = !!getToken();

if (hasPrerender && !hasToken && window.location.pathname === '/') {
  hydrateRoot(rootEl, tree);
} else {
  if (hasPrerender) rootEl.innerHTML = '';
  createRoot(rootEl).render(tree);
}
