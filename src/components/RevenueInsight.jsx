import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Zap, Target } from 'lucide-react';
import { formatPrice } from '../data/mockData';
import { useStore } from '../data/store';

export default function RevenueInsight() {
  const { totalEarnings, totalPotential, products } = useStore();
  const topProduct = [...products].sort((a, b) => b.potentialRevenue - b.revenue - (a.potentialRevenue - a.revenue))[0];
  const unrealizedRevenue = totalPotential - totalEarnings;
  const revenuePercent = Math.min((totalEarnings / totalPotential) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="p-6 rounded-2xl bg-bg-card border border-border relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gold-dim border border-gold/10 flex items-center justify-center">
            <Sparkles size={14} className="text-gold" />
          </div>
          <h3 className="text-base font-semibold">AI-прогноз дохода</h3>
        </div>

        <div className="space-y-4">
          {/* Overall potential */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm text-text-secondary">Общий потенциал</span>
              <span className="text-gold font-semibold">{formatPrice(totalPotential)}</span>
            </div>
            <div className="h-2 rounded-full bg-bg-elevated overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${revenuePercent}%` }}
                transition={{ duration: 1.5, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-gold/60 to-gold"
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-xs text-text-tertiary">Заработано: {formatPrice(totalEarnings)}</span>
              <span className="text-xs text-gold/70">{revenuePercent.toFixed(0)}%</span>
            </div>
          </div>

          {/* Insights */}
          <div className="space-y-2.5 pt-2">
            <InsightRow
              icon={Zap}
              text="Нереализованный доход"
              value={formatPrice(unrealizedRevenue)}
              color="gold"
            />
            {topProduct && (
              <InsightRow
                icon={Target}
                text={`Растущий: ${topProduct.title.slice(0, 25)}...`}
                value={`+${formatPrice(topProduct.potentialRevenue - topProduct.revenue)}`}
                color="green"
              />
            )}
            <InsightRow
              icon={TrendingUp}
              text="Рекомендация: повысьте цену на пресеты"
              value="+18%"
              color="purple"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function InsightRow({ icon: Icon, text, value, color }) {
  const colorClass = {
    gold: 'text-gold bg-gold-dim',
    green: 'text-green bg-green-dim',
    purple: 'text-purple bg-purple-dim',
    blue: 'text-blue bg-blue-dim',
  }[color];

  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-bg-elevated/50">
      <div className={`w-7 h-7 rounded-lg ${colorClass} flex items-center justify-center flex-shrink-0`}>
        <Icon size={13} />
      </div>
      <span className="text-xs text-text-secondary flex-1 min-w-0 truncate">{text}</span>
      <span className={`text-xs font-semibold text-${color} flex-shrink-0`}>{value}</span>
    </div>
  );
}
