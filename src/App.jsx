import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Loader2, Menu, Sparkles } from 'lucide-react';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Notifications from './components/Notifications';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import CreateProduct from './pages/CreateProduct';
import ProductPublic from './pages/ProductPublic';
import Analytics from './pages/Analytics';
import Wallet from './pages/Wallet';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import OAuthCallback from './pages/OAuthCallback';
import { useAuth } from './contexts/AuthContext';
import { useAnalytics } from './hooks/useAnalytics';

function RequireAuth({ children }) {
  const { status } = useAuth();
  const location = useLocation();
  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center text-text-tertiary gap-2"><Loader2 size={16} className="animate-spin" />Loading…</div>;
  }
  if (status === 'anon') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export default function App() {
  const location = useLocation();
  const { status } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useAnalytics();
  const isPublicProduct = location.pathname.startsWith('/product/');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isOAuthCallback = location.pathname === '/oauth/callback';
  const isLanding = location.pathname === '/' && status === 'anon';

  if (isOAuthCallback) {
    return (
      <Routes location={location}>
        <Route path="/oauth/callback" element={<OAuthCallback />} />
      </Routes>
    );
  }

  if (isPublicProduct) {
    return (
      <>
        <Notifications />
        <Routes location={location}>
          <Route path="/product/:id" element={<ProductPublic />} />
        </Routes>
      </>
    );
  }

  if (isLanding) {
    return (
      <Routes location={location}>
        <Route path="/" element={<Landing />} />
      </Routes>
    );
  }

  if (isAuthPage) {
    if (status === 'authed') return <Navigate to="/" replace />;
    return (
      <Routes location={location}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    );
  }

  return (
    <RequireAuth>
      <div className="min-h-screen md:pl-[260px]">
        <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />
        <header className="md:hidden sticky top-0 z-20 flex items-center justify-between px-4 h-14 border-b border-border bg-bg-card/90 backdrop-blur-xl">
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            className="p-2 -ml-2 text-text-secondary hover:text-text-primary"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2 text-gold">
            <Sparkles size={16} />
            <span className="font-display text-lg font-semibold tracking-tight">Plutus</span>
          </div>
          <div className="w-8" />
        </header>
        <main className="min-h-screen p-4 pb-16 md:p-8">
          <Notifications />
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/create" element={<CreateProduct />} />
              <Route path="/edit/:id" element={<CreateProduct />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </RequireAuth>
  );
}
