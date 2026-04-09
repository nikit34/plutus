import { motion } from 'framer-motion';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import ProductCardDashboard from '../components/ProductCardDashboard';
import { useStore } from '../data/store';

export default function Products() {
  const { products } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = products
    .filter((p) => {
      if (filter === 'active') return p.status === 'active';
      if (filter === 'draft') return p.status === 'draft';
      return true;
    })
    .filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between"
      >
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Продукты</h1>
          <p className="text-text-secondary mt-1 text-sm">{products.length} продуктов создано</p>
        </div>
        <Link
          to="/create"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-bg-primary font-semibold text-sm hover:brightness-110 transition-all no-underline"
        >
          <Plus size={16} />
          Новый продукт
        </Link>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3"
      >
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            placeholder="Поиск продуктов..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-card border border-border text-sm text-text-primary placeholder:text-text-tertiary focus:border-gold/30 transition-colors"
          />
        </div>
        <div className="flex items-center gap-1 bg-bg-card border border-border rounded-xl p-1">
          {[
            { key: 'all', label: 'Все' },
            { key: 'active', label: 'Активные' },
            { key: 'draft', label: 'Черновики' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f.key
                  ? 'bg-gold-dim text-gold'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Products grid */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((product, i) => (
          <ProductCardDashboard key={product.id} product={product} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="text-text-tertiary text-sm">Продукты не найдены</div>
        </div>
      )}
    </div>
  );
}
