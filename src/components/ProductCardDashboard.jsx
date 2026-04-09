import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ExternalLink,
  Copy,
  TrendingUp,
  TrendingDown,
  Eye,
  ShoppingCart,
  Sparkles,
  MoreHorizontal,
} from 'lucide-react';
import { formatPrice, formatNumber, THEMES } from '../data/mockData';
import { useStore } from '../data/store';
import { useState } from 'react';

export default function ProductCardDashboard({ product, index = 0 }) {
  const { addNotification } = useStore();
  const [showMenu, setShowMenu] = useState(false);
  const theme = THEMES[product.theme] || THEMES.midnight;
  const revenuePercent = Math.min((product.revenue / product.potentialRevenue) * 100, 100);

  const copyLink = () => {
    navigator.clipboard.writeText('https://' + product.link);
    addNotification('Ссылка скопирована!');
  };

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
            onClick={copyLink}
            className="w-8 h-8 rounded-lg bg-bg-primary/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-bg-elevated transition-colors"
            title="Копировать ссылку"
          >
            <Copy size={14} />
          </button>
          <Link
            to={`/product/${product.id}`}
            className="w-8 h-8 rounded-lg bg-bg-primary/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-bg-elevated transition-colors"
            title="Просмотр"
          >
            <ExternalLink size={14} />
          </Link>
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
