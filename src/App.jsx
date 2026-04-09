import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Notifications from './components/Notifications';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import CreateProduct from './pages/CreateProduct';
import ProductPublic from './pages/ProductPublic';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

export default function App() {
  const location = useLocation();
  const isPublicPage = location.pathname.startsWith('/product/');

  if (isPublicPage) {
    return (
      <>
        <Notifications />
        <Routes location={location}>
          <Route path="/product/:id" element={<ProductPublic />} />
        </Routes>
      </>
    );
  }

  return (
    <div className="min-h-screen" style={{ paddingLeft: 260 }}>
      <Sidebar />
      <main className="min-h-screen p-8 pb-16">
        <Notifications />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/create" element={<CreateProduct />} />
            <Route path="/edit/:id" element={<CreateProduct />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}
