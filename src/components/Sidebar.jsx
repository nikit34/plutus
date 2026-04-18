import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  BarChart3,
  Wallet,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../data/store';
import { formatPrice } from '../data/mockData';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/wallet', icon: Wallet, label: 'Wallet' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { creator, totalEarnings } = useStore();
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 bottom-0 z-40 flex flex-col border-r border-border bg-bg-card"
    >
      <div className="flex items-center gap-3 px-5 h-16 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center flex-shrink-0">
          <Sparkles size={16} className="text-bg-primary" />
        </div>
        {!collapsed && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display text-2xl font-semibold tracking-tight">
            Plutus
          </motion.span>
        )}
      </div>

      {!collapsed && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-4 mt-5 p-3 rounded-xl bg-gold-dim border border-gold/10">
          <div className="text-[11px] uppercase tracking-widest text-gold/70 mb-1">Earnings</div>
          <div className="text-lg font-semibold text-gold">{formatPrice(totalEarnings)}</div>
        </motion.div>
      )}

      <nav className="flex-1 mt-6 px-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
          return (
            <NavLink
              key={to}
              to={to}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive ? 'text-gold bg-gold-dim' : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
              }`}
            >
              {isActive && (
                <motion.div layoutId="sidebar-active" className="absolute inset-0 rounded-xl bg-gold-dim border border-gold/10" transition={{ type: 'spring', stiffness: 350, damping: 30 }} />
              )}
              <Icon size={18} className="relative z-10 flex-shrink-0" />
              {!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10">{label}</motion.span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-3 mb-2">
        <NavLink
          to="/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            location.pathname === '/settings' ? 'text-gold bg-gold-dim' : 'text-text-tertiary hover:text-text-secondary hover:bg-bg-elevated'
          }`}
        >
          <Settings size={18} className="flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </NavLink>
      </div>

      {!collapsed && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-3 mb-3 p-3 rounded-xl bg-bg-elevated border border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center text-sm font-semibold text-gold">
              {creator.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{creator.name}</div>
              <div className="text-xs text-text-tertiary">{creator.plan} plan</div>
            </div>
          </div>
        </motion.div>
      )}

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mx-3 mb-4 flex items-center justify-center gap-2 py-2 rounded-lg text-text-tertiary hover:text-text-secondary hover:bg-bg-elevated transition-colors text-xs"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        {!collapsed && <span>Collapse</span>}
      </button>
    </motion.aside>
  );
}

export function useSidebarWidth() {
  return 260;
}
