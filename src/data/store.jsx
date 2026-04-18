import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { productsApi, notificationsApi, walletApi, analyticsApi, settingsApi } from '../api/client';
import { useAuth } from '../contexts/AuthContext';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const { user, status, setUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [walletSummary, setWalletSummary] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const toastIdRef = useRef(0);

  const addNotification = useCallback((message, type = 'success') => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((n) => n.id !== id)), 3000);
  }, []);

  const loadProducts = useCallback(async () => {
    const { products } = await productsApi.list();
    setProducts(products);
    setProductsLoaded(true);
    return products;
  }, []);

  const addProduct = useCallback(async (formData) => {
    const { product } = await productsApi.create(formData);
    setProducts((prev) => [product, ...prev]);
    return product;
  }, []);

  const updateProduct = useCallback(async (id, formData) => {
    const { product } = await productsApi.update(id, formData);
    setProducts((prev) => prev.map((p) => (p.id === id ? product : p)));
    return product;
  }, []);

  const deleteProduct = useCallback(async (id) => {
    await productsApi.remove(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      const { notifications } = await notificationsApi.list();
      setNotifications(notifications);
    } catch { /* ignore */ }
  }, []);

  const markNotificationsRead = useCallback(async (ids) => {
    await notificationsApi.markRead(ids);
    setNotifications((prev) => prev.map((n) => (!ids || ids.includes(n.id) ? { ...n, readAt: new Date().toISOString() } : n)));
  }, []);

  const loadWalletSummary = useCallback(async () => {
    const data = await walletApi.summary();
    setWalletSummary(data);
    return data;
  }, []);

  const loadDashboard = useCallback(async () => {
    const data = await analyticsApi.dashboard();
    setDashboard(data);
    return data;
  }, []);

  const updateProfile = useCallback(async (formData) => {
    const { user: updated } = await settingsApi.profile(formData);
    setUser(updated);
    return updated;
  }, [setUser]);

  // Bootstrap on login
  useEffect(() => {
    if (status === 'authed') {
      loadProducts().catch(() => {});
      loadNotifications().catch(() => {});
    } else if (status === 'anon') {
      setProducts([]);
      setNotifications([]);
      setWalletSummary(null);
      setDashboard(null);
      setProductsLoaded(false);
    }
  }, [status, loadProducts, loadNotifications]);

  const totalEarnings = walletSummary?.totalEarnings ?? 0;
  const totalSales = walletSummary?.totalSales ?? 0;

  return (
    <StoreContext.Provider
      value={{
        creator: user,
        products,
        productsLoaded,
        notifications,
        toasts,
        walletSummary,
        dashboard,
        totalEarnings,
        totalSales,
        addNotification,
        loadProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        loadNotifications,
        markNotificationsRead,
        loadWalletSummary,
        loadDashboard,
        updateProfile,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be inside StoreProvider');
  return ctx;
}
