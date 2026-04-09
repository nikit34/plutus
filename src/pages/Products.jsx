import { motion } from 'framer-motion';
import { Plus, Search, Copy, ExternalLink, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useStore } from '../data/store';
import { formatPrice, formatNumber } from '../data/mockData';

export default function Products() {
  const { products, deleteProduct, addNotification } = useStore();
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
      {/* Header with prominent Create */}
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

      {/* Products list — compact rows with quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl bg-bg-card border border-border overflow-hidden"
      >
        {filtered.map((product, i) => (
          <ProductRow
            key={product.id}
            product={product}
            index={i}
            isLast={i === filtered.length - 1}
            onCopyLink={() => {
              navigator.clipboard.writeText('https://' + product.link);
              addNotification('Ссылка скопирована!');
            }}
            onDelete={() => {
              deleteProduct(product.id);
              addNotification('Продукт удалён');
            }}
          />
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="text-text-tertiary text-sm mb-4">Продукты не найдены</div>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-bg-primary font-semibold text-sm hover:brightness-110 transition-all no-underline"
          >
            <Plus size={16} />
            Создать первый продукт
          </Link>
        </div>
      )}
    </div>
  );
}

function ProductRow({ product, index, isLast, onCopyLink, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15 + index * 0.03 }}
      className={`flex items-center gap-4 px-5 py-3.5 hover:bg-bg-elevated/50 transition-colors ${
        !isLast ? 'border-b border-border' : ''
      }`}
    >
      {/* Image */}
      <img
        src={product.image}
        alt=""
        className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{product.title}</div>
        <div className="text-xs text-text-tertiary mt-0.5">
          {product.sales} продаж · {formatNumber(product.views)} просмотров
        </div>
      </div>

      {/* Status */}
      <span className={`text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
        product.status === 'active'
          ? 'bg-green-dim text-green'
          : 'bg-bg-elevated text-text-secondary'
      }`}>
        {product.status === 'active' ? 'Активен' : 'Черновик'}
      </span>

      {/* Price */}
      <div className="text-sm font-semibold flex-shrink-0 w-24 text-right">
        {formatPrice(product.price)}
      </div>

      {/* Revenue */}
      <div className="text-sm text-text-secondary flex-shrink-0 w-28 text-right">
        {formatPrice(product.revenue)}
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-1 flex-shrink-0 relative">
        <button
          onClick={onCopyLink}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-elevated transition-colors"
          title="Копировать ссылку"
        >
          <Copy size={14} />
        </button>
        <Link
          to={`/product/${product.id}`}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-elevated transition-colors"
          title="Просмотр"
        >
          <ExternalLink size={14} />
        </Link>
        <Link
          to={`/edit/${product.id}`}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-elevated transition-colors"
          title="Редактировать"
        >
          <Pencil size={14} />
        </Link>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-elevated transition-colors"
          >
            <MoreHorizontal size={14} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-9 z-20 w-40 py-1 rounded-xl bg-bg-card border border-border shadow-xl">
                <button
                  onClick={() => { onDelete(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red hover:bg-red-dim/30 transition-colors"
                >
                  <Trash2 size={13} />
                  Удалить
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
