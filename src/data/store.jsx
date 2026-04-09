import { createContext, useContext, useState, useCallback } from 'react';
import { PRODUCTS as INITIAL_PRODUCTS, CREATOR } from './mockData';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [creator] = useState(CREATOR);
  const [notifications, setNotifications] = useState([]);

  const addProduct = useCallback((product) => {
    const id = 'prod_' + String(products.length + 1).padStart(2, '0');
    const newProduct = {
      ...product,
      id,
      sales: 0,
      revenue: 0,
      views: 0,
      conversionRate: 0,
      potentialRevenue: estimateRevenue(product.price),
      trend: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      link: 'nikit34.github.io/numi/product/' + id,
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  }, [products.length]);

  const updateProduct = useCallback((id, updates) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addNotification = useCallback((message, type = 'success') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }, []);

  const totalEarnings = products.reduce((sum, p) => sum + p.revenue, 0);
  const totalSales = products.reduce((sum, p) => sum + p.sales, 0);
  const totalPotential = products.reduce((sum, p) => sum + p.potentialRevenue, 0);

  return (
    <StoreContext.Provider
      value={{
        products,
        creator,
        notifications,
        addProduct,
        updateProduct,
        deleteProduct,
        addNotification,
        totalEarnings,
        totalSales,
        totalPotential,
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

function estimateRevenue(price) {
  const baseMultiplier = price < 1000 ? 350 : price < 3000 ? 220 : price < 5000 ? 150 : 80;
  return price * baseMultiplier * (0.8 + Math.random() * 0.4);
}
