import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Copy,
  ExternalLink,
  Pencil,
  TrendingUp,
  TrendingDown,
  Eye,
  ShoppingCart,
  Sparkles,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useStore } from '../data/store';
import { formatPrice, formatNumber, THEMES } from '../data/mockData';

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
          <ProductCard
            key={product.id}
            product={product}
            index={i}
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
      </div>

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

function ProductCard({ product, index, onCopyLink, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const theme = THEMES[product.theme] || THEMES.midnight;
  const revenuePercent = Math.min((product.revenue / product.potentialRevenue) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.4, 0, 0.2, 1] }}
      className="group relative rounded-2xl bg-bg-card border border-border hover:border-border-strong transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full ${
            product.status === 'active'
              ? 'bg-green/20 text-green backdrop-blur-sm'
              : 'bg-bg-elevated/80 text-text-secondary backdrop-blur-sm'
          }`}>
            {product.status === 'active' ? 'Активен' : 'Черновик'}
          </span>
        </div>

        {/* Price tag */}
        <div className="absolute top-3 right-3">
          <span className="text-sm font-semibold px-3 py-1.5 rounded-full bg-bg-primary/80 backdrop-blur-sm border border-border">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Actions overlay */}
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={onCopyLink}
            className="w-8 h-8 rounded-lg bg-bg-primary/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-bg-elevated transition-colors"
            title="Копировать ссылку"
          >
            <Copy size={14} />
          </button>
          <Link
            to={`/edit/${product.id}`}
            className="w-8 h-8 rounded-lg bg-bg-primary/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-bg-elevated transition-colors"
            title="Редактировать"
          >
            <Pencil size={14} />
          </Link>
          <Link
            to={`/product/${product.id}`}
            className="w-8 h-8 rounded-lg bg-bg-primary/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-bg-elevated transition-colors"
            title="Просмотр"
          >
            <ExternalLink size={14} />
          </Link>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-8 h-8 rounded-lg bg-bg-primary/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-bg-elevated transition-colors"
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
      </div>

      {/* Content */}
      <div className="p-4">
        <Link to={`/edit/${product.id}`} className="block no-underline text-text-primary">
          <h3 className="font-semibold text-[15px] leading-snug mb-2 line-clamp-1 group-hover:text-gold transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Stats row */}
        <div className="flex items-center gap-4 text-xs text-text-secondary mb-4">
          <span className="flex items-center gap-1">
            <Eye size={12} /> {formatNumber(product.views)}
          </span>
          <span className="flex items-center gap-1">
            <ShoppingCart size={12} /> {product.sales}
          </span>
          <span className={`flex items-center gap-1 ${product.trend >= 0 ? 'text-green' : 'text-red'}`}>
            {product.trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {product.trend >= 0 ? '+' : ''}{product.trend}%
          </span>
        </div>

        {/* Revenue */}
        <div className="mb-2 flex items-end justify-between gap-2 min-w-0">
          <div className="min-w-0">
            <div className="text-xs text-text-tertiary mb-0.5">Заработано</div>
            <div className="text-base font-semibold truncate">{formatPrice(product.revenue)}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs text-text-tertiary mb-0.5 flex items-center gap-1 justify-end">
              <Sparkles size={10} className="text-gold" /> Потенциал
            </div>
            <div className="text-sm text-gold font-medium">{formatPrice(product.potentialRevenue)}</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-bg-elevated overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${revenuePercent}%` }}
            transition={{ duration: 1.2, delay: index * 0.06 + 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${theme.accent}88, ${theme.accent})`,
            }}
          />
        </div>
        <div className="text-[10px] text-text-tertiary mt-1 text-right">
          {revenuePercent.toFixed(0)}% от потенциала
        </div>
      </div>
    </motion.div>
  );
}
