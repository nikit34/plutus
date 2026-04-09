import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Sparkles, DollarSign, ShoppingCart, Eye, TrendingUp, Zap, Target } from 'lucide-react';
import { useStore } from '../data/store';
import { formatPrice, formatNumber, EARNINGS_HISTORY, generateTip } from '../data/mockData';
import Tooltip from '../components/Tooltip';

export default function Analytics() {
  const { products, totalEarnings, totalSales, totalPotential } = useStore();
  const totalViews = products.reduce((sum, p) => sum + p.views, 0);
  const avgConversion = products.length ? (products.filter(p => p.views > 0).reduce((sum, p) => sum + (p.sales / p.views) * 100, 0) / products.filter(p => p.views > 0).length).toFixed(1) : 0;
  const tip = generateTip(products);
  const sortedByRevenue = [...products].sort((a, b) => b.revenue - a.revenue);
  const sortedByConversion = [...products].sort((a, b) => b.conversionRate - a.conversionRate);
  const maxEarning = Math.max(...EARNINGS_HISTORY.map((e) => e.amount));
  const unrealizedRevenue = totalPotential - totalEarnings;
  const revenuePercent = Math.min((totalEarnings / totalPotential) * 100, 100);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-text-secondary text-sm mt-1">Detailed stats for your products</p>
      </motion.div>

      <div className="grid grid-cols-4 gap-4">
        <MiniStat icon={DollarSign} label="Total Revenue" value={formatPrice(totalEarnings)} change={12.3} color="gold" delay={0.05} />
        <MiniStat icon={ShoppingCart} label="Sales" value={formatNumber(totalSales)} change={8.1} color="green" delay={0.1} />
        <MiniStat icon={Eye} label="Views" value={formatNumber(totalViews)} change={15.7} color="blue" delay={0.15} />
        <MiniStat icon={TrendingUp} label="Conversion" value={avgConversion + '%'} change={2.3} color="purple" delay={0.2} />
      </div>

      <div className="grid grid-cols-5 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="col-span-3 p-6 rounded-2xl bg-bg-card border border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold">Earnings Trend</h3>
              <p className="text-sm text-text-secondary mt-0.5">Last 7 months</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-text-tertiary">This month</div>
              <div className="text-lg font-semibold text-gold">{formatPrice(EARNINGS_HISTORY[EARNINGS_HISTORY.length - 1].amount)}</div>
            </div>
          </div>
          <div className="flex items-end gap-3 h-40">
            {EARNINGS_HISTORY.map((entry, i) => {
              const height = (entry.amount / maxEarning) * 100;
              const isLast = i === EARNINGS_HISTORY.length - 1;
              return (
                <div key={entry.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full relative flex items-end justify-center" style={{ height: '128px' }}>
                    <motion.div initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ duration: 0.8, delay: i * 0.08 }} className={`w-full max-w-[40px] rounded-lg ${isLast ? 'bg-gradient-to-t from-gold/60 to-gold' : 'bg-bg-elevated hover:bg-bg-hover'}`} />
                  </div>
                  <span className={`text-[11px] ${isLast ? 'text-gold font-medium' : 'text-text-tertiary'}`}>{entry.month}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="col-span-2 p-6 rounded-2xl bg-bg-card border border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gold-dim border border-gold/10 flex items-center justify-center"><Sparkles size={14} className="text-gold" /></div>
              <h3 className="text-base font-semibold">AI Forecast</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm text-text-secondary">Total potential</span>
                  <span className="text-gold font-semibold">{formatPrice(totalPotential)}</span>
                </div>
                <div className="h-2 rounded-full bg-bg-elevated overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${revenuePercent}%` }} transition={{ duration: 1.5, delay: 0.5 }} className="h-full rounded-full bg-gradient-to-r from-gold/60 to-gold" />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-xs text-text-tertiary">Earned: {formatPrice(totalEarnings)}</span>
                  <span className="text-xs text-gold/70">{revenuePercent.toFixed(0)}%</span>
                </div>
              </div>
              <div className="space-y-2.5 pt-2">
                <InsightRow icon={Zap} text="Unrealized revenue" value={formatPrice(unrealizedRevenue)} color="gold" />
                {tip && (
                  <div className="flex items-center gap-1">
                    <div className="flex-1"><InsightRow icon={Target} text={`Tip: raise ${tip.product.title.slice(0, 20)} price`} value={`+${tip.priceIncreasePct}%`} color="purple" /></div>
                    <Tooltip>
                      <div className="space-y-1.5">
                        <div>Conversion: <span className="text-text-primary font-medium">{tip.currentConversion.toFixed(1)}%</span> vs {tip.benchmark}% avg</div>
                        <div>Rev/view: ${tip.currentRpv} → <span className="text-gold font-medium">${tip.newRpv}</span></div>
                        <div>Est. gain: <span className="text-gold font-medium">+{formatPrice(tip.monthlyGain)}/mo</span></div>
                      </div>
                    </Tooltip>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="col-span-2 p-6 rounded-2xl bg-bg-card border border-border">
          <h3 className="text-sm font-medium text-text-secondary mb-4">Revenue by product</h3>
          <div className="space-y-3">
            {sortedByRevenue.map((product, i) => {
              const maxRevenue = sortedByRevenue[0].revenue;
              const width = (product.revenue / maxRevenue) * 100;
              return (
                <div key={product.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm truncate max-w-[60%]">{product.title}</span>
                    <span className="text-sm font-semibold">{formatPrice(product.revenue)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-bg-elevated overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${width}%` }} transition={{ duration: 0.8, delay: i * 0.1 }} className="h-full rounded-full bg-gradient-to-r from-gold/50 to-gold" />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-6 rounded-2xl bg-bg-card border border-border">
          <h3 className="text-sm font-medium text-text-secondary mb-4">Best conversion</h3>
          <div className="space-y-3">
            {sortedByConversion.slice(0, 5).map((product, i) => (
              <div key={product.id} className="flex items-center gap-3">
                <span className="text-xs text-text-tertiary w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{product.title}</div>
                  <div className="text-xs text-text-tertiary">{formatNumber(product.views)} views</div>
                </div>
                <span className="text-sm font-semibold text-green">{product.conversionRate}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="rounded-2xl bg-bg-card border border-border overflow-hidden">
        <div className="p-5 border-b border-border"><h3 className="text-base font-semibold">Product breakdown</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">Product</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">Price</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">Sales</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">Views</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">Conversion</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">Revenue</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-border last:border-0 hover:bg-bg-elevated/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <div className="text-sm font-medium truncate max-w-[200px]">{product.title}</div>
                        <div className="text-xs text-text-tertiary">{product.status === 'active' ? 'Active' : 'Draft'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-right px-5 py-4 text-sm">{formatPrice(product.price)}</td>
                  <td className="text-right px-5 py-4 text-sm font-medium">{product.sales}</td>
                  <td className="text-right px-5 py-4 text-sm text-text-secondary">{formatNumber(product.views)}</td>
                  <td className="text-right px-5 py-4"><span className={`text-sm font-medium ${(product.views > 0 ? (product.sales / product.views * 100) : 0) >= 3 ? 'text-green' : 'text-text-secondary'}`}>{product.views > 0 ? (product.sales / product.views * 100).toFixed(1) : 0}%</span></td>
                  <td className="text-right px-5 py-4 text-sm font-semibold">{formatPrice(product.revenue)}</td>
                  <td className="text-right px-5 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${product.trend >= 0 ? 'bg-green-dim text-green' : 'bg-red-dim text-red'}`}>
                      {product.trend >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}{Math.abs(product.trend)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value, change, color = 'gold', delay = 0 }) {
  const colorMap = {
    gold: 'bg-gold-dim border-gold/10 text-gold',
    green: 'bg-green-dim border-green/10 text-green',
    blue: 'bg-blue-dim border-blue/10 text-blue',
    purple: 'bg-purple-dim border-purple/10 text-purple',
  };
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }} className="p-5 rounded-2xl bg-bg-card border border-border">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colorMap[color]}`}><Icon size={18} /></div>
        {change !== undefined && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${change >= 0 ? 'bg-green-dim text-green' : 'bg-red-dim text-red'}`}>{change >= 0 ? '+' : ''}{change}%</span>
        )}
      </div>
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      <div className="text-sm text-text-secondary mt-1">{label}</div>
    </motion.div>
  );
}

function InsightRow({ icon: Icon, text, value, color }) {
  const colorClass = { gold: 'text-gold bg-gold-dim', green: 'text-green bg-green-dim', purple: 'text-purple bg-purple-dim' }[color];
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-bg-elevated/50">
      <div className={`w-7 h-7 rounded-lg ${colorClass} flex items-center justify-center flex-shrink-0`}><Icon size={13} /></div>
      <span className="text-xs text-text-secondary flex-1 min-w-0 truncate">{text}</span>
      <span className={`text-xs font-semibold text-${color} flex-shrink-0`}>{value}</span>
    </div>
  );
}
