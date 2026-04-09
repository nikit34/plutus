import { motion } from 'framer-motion';
import {
  DollarSign,
  ShoppingCart,
  Eye,
  TrendingUp,
  TrendingDown,
  Trophy,
  Star,
  Sparkles,
  Zap,
  ArrowUpRight,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../data/store';
import { formatPrice, formatNumber, ACTIVITY_FEED, TODAY_STATS, CREATOR } from '../data/mockData';

export default function Dashboard() {
  const { creator } = useStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Привет, <span className="gold-shimmer">{creator.name.split(' ')[0]}</span>
        </h1>
        <p className="text-text-secondary text-sm mt-1">Вот что произошло за сегодня</p>
      </motion.div>

      {/* Today's quick metrics */}
      <div className="grid grid-cols-3 gap-4">
        <QuickStat
          icon={DollarSign}
          label="Заработано сегодня"
          value={formatPrice(TODAY_STATS.earnings)}
          change={TODAY_STATS.earningsChange}
          delay={0.05}
        />
        <QuickStat
          icon={ShoppingCart}
          label="Продажи сегодня"
          value={TODAY_STATS.sales}
          change={TODAY_STATS.salesChange}
          delay={0.1}
        />
        <QuickStat
          icon={Eye}
          label="Просмотры сегодня"
          value={formatNumber(TODAY_STATS.views)}
          change={TODAY_STATS.viewsChange}
          delay={0.15}
        />
      </div>

      {/* Feed + AI tip */}
      <div className="grid grid-cols-3 gap-4">
        {/* Activity feed */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-2 rounded-2xl bg-bg-card border border-border"
        >
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-base font-semibold">Лента</h2>
            <span className="text-xs text-text-tertiary">Сегодня</span>
          </div>
          <div className="divide-y divide-border">
            {ACTIVITY_FEED.map((event, i) => (
              <FeedItem key={event.id} event={event} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Right column */}
        <div className="space-y-4">
          {/* AI tip of the day */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="p-5 rounded-2xl bg-bg-card border border-border relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gold-dim border border-gold/10 flex items-center justify-center">
                  <Sparkles size={12} className="text-gold" />
                </div>
                <span className="text-sm font-semibold">Совет дня</span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                Повысьте цену на пресеты Lightroom на 23% — конверсия 3.6% позволяет это.
              </p>
              <div className="mt-3 text-xs font-semibold text-gold">Прогноз: +₽56K/мес</div>
            </div>
          </motion.div>

          {/* Audience widget */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="p-5 rounded-2xl bg-bg-card border border-border"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-dim border border-purple/10 flex items-center justify-center">
                  <Users size={12} className="text-purple" />
                </div>
                <span className="text-sm font-semibold">Аудитория</span>
              </div>
              <span className="text-xs font-medium text-green bg-green-dim px-2 py-0.5 rounded-full">
                +{CREATOR.subscribersGrowth}%
              </span>
            </div>
            <div className="text-2xl font-bold">{CREATOR.subscribers.toLocaleString('ru-RU')}</div>
            <div className="text-xs text-text-tertiary mt-1">подписчиков{CREATOR.socialLabel ? ` · ${CREATOR.socialLabel}` : ''}</div>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-5 rounded-2xl bg-bg-card border border-border space-y-2.5"
          >
            <h3 className="text-sm font-semibold mb-3">Быстрые действия</h3>
            <Link
              to="/create"
              className="flex items-center gap-3 p-3 rounded-xl bg-gold-dim border border-gold/10 text-sm font-medium text-gold hover:bg-gold/15 transition-colors no-underline"
            >
              <Zap size={14} />
              Создать новый продукт
              <ArrowUpRight size={12} className="ml-auto" />
            </Link>
            <Link
              to="/analytics"
              className="flex items-center gap-3 p-3 rounded-xl bg-bg-elevated text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors no-underline"
            >
              <TrendingUp size={14} />
              Посмотреть аналитику
              <ArrowUpRight size={12} className="ml-auto" />
            </Link>
            <Link
              to="/wallet"
              className="flex items-center gap-3 p-3 rounded-xl bg-bg-elevated text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors no-underline"
            >
              <DollarSign size={14} />
              Вывести средства
              <ArrowUpRight size={12} className="ml-auto" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function QuickStat({ icon: Icon, label, value, change, delay = 0 }) {
  const positive = change >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="p-4 rounded-2xl bg-bg-card border border-border"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-xl bg-bg-elevated flex items-center justify-center">
          <Icon size={16} className="text-text-secondary" />
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          positive ? 'bg-green-dim text-green' : 'bg-red-dim text-red'
        }`}>
          {positive ? '+' : ''}{change}%
        </span>
      </div>
      <div className="text-xl font-semibold">{value}</div>
      <div className="text-xs text-text-tertiary mt-0.5">{label}</div>
    </motion.div>
  );
}

function FeedItem({ event, index }) {
  if (event.type === 'sale') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 + index * 0.03 }}
        className="flex items-center gap-4 px-5 py-3.5 hover:bg-bg-elevated/50 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-green-dim flex items-center justify-center flex-shrink-0">
          <ShoppingCart size={13} className="text-green" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm">
            <span className="font-medium">{event.productTitle}</span>
          </div>
        </div>
        <div className="text-sm font-semibold text-green flex-shrink-0">+{formatPrice(event.amount)}</div>
        <div className="text-xs text-text-tertiary flex-shrink-0 w-20 text-right">{event.time}</div>
      </motion.div>
    );
  }

  if (event.type === 'milestone') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 + index * 0.03 }}
        className="flex items-center gap-4 px-5 py-3.5 hover:bg-bg-elevated/50 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gold-dim flex items-center justify-center flex-shrink-0">
          <Trophy size={13} className="text-gold" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium">{event.text}</div>
        </div>
        <div className="text-xs text-text-tertiary flex-shrink-0 w-20 text-right">{event.time}</div>
      </motion.div>
    );
  }

  if (event.type === 'review') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 + index * 0.03 }}
        className="flex items-center gap-4 px-5 py-3.5 hover:bg-bg-elevated/50 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-purple-dim flex items-center justify-center flex-shrink-0">
          <Star size={13} className="text-purple" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm">
            <span className="text-text-secondary">Новый отзыв на </span>
            <span className="font-medium">{event.productTitle}</span>
          </div>
          <div className="text-xs text-text-tertiary mt-0.5 italic">{event.text}</div>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {[...Array(event.stars)].map((_, i) => (
            <Star key={i} size={10} fill="#E2B94B" stroke="#E2B94B" />
          ))}
        </div>
        <div className="text-xs text-text-tertiary flex-shrink-0 w-20 text-right">{event.time}</div>
      </motion.div>
    );
  }

  if (event.type === 'tip') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 + index * 0.03 }}
        className="flex items-center gap-4 px-5 py-3.5 bg-gold-dim/30 hover:bg-gold-dim/50 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gold-dim flex items-center justify-center flex-shrink-0">
          <Sparkles size={13} className="text-gold" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm text-text-secondary">{event.text}</div>
        </div>
        <div className="text-xs text-text-tertiary flex-shrink-0 w-20 text-right">{event.time}</div>
      </motion.div>
    );
  }

  return null;
}
