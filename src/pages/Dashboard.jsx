import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Eye, TrendingUp, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import ProductCardDashboard from '../components/ProductCardDashboard';
import EarningsChart from '../components/EarningsChart';
import RevenueInsight from '../components/RevenueInsight';
import { useStore } from '../data/store';
import { formatPrice, formatNumber } from '../data/mockData';

export default function Dashboard() {
  const { products, totalEarnings, totalSales, creator } = useStore();
  const totalViews = products.reduce((sum, p) => sum + p.views, 0);
  const avgConversion = products.length
    ? (products.reduce((sum, p) => sum + p.conversionRate, 0) / products.length).toFixed(1)
    : 0;
  const activeProducts = products.filter((p) => p.status === 'active');

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-end justify-between"
      >
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">
            Добро пожаловать,{' '}
            <span className="gold-shimmer">{creator.name.split(' ')[0]}</span>
          </h1>
          <p className="text-text-secondary mt-2 text-base">
            Вот что происходит с вашими цифровыми продуктами
          </p>
        </div>
        <Link
          to="/create"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-bg-primary font-semibold text-sm hover:brightness-110 transition-all no-underline"
        >
          <Plus size={16} />
          Новый продукт
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          label="Общий доход"
          value={formatPrice(totalEarnings)}
          trend={12.3}
          color="gold"
          delay={0.05}
        />
        <StatCard
          icon={ShoppingCart}
          label="Продажи"
          value={formatNumber(totalSales)}
          trend={8.1}
          color="green"
          delay={0.1}
        />
        <StatCard
          icon={Eye}
          label="Просмотры"
          value={formatNumber(totalViews)}
          trend={15.7}
          color="blue"
          delay={0.15}
        />
        <StatCard
          icon={TrendingUp}
          label="Конверсия"
          value={avgConversion + '%'}
          subValue="Средняя по всем продуктам"
          color="purple"
          delay={0.2}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3">
          <EarningsChart />
        </div>
        <div className="col-span-2">
          <RevenueInsight />
        </div>
      </div>

      {/* Products section */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold">Ваши продукты</h2>
          <Link
            to="/products"
            className="text-sm text-text-secondary hover:text-gold transition-colors no-underline"
          >
            Все продукты →
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {activeProducts.slice(0, 6).map((product, i) => (
            <ProductCardDashboard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
