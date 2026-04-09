import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../data/store';
import { formatPrice, formatNumber, EARNINGS_HISTORY } from '../data/mockData';

export default function Analytics() {
  const { products } = useStore();

  const sortedByRevenue = [...products].sort((a, b) => b.revenue - a.revenue);
  const sortedByConversion = [...products].sort((a, b) => b.conversionRate - a.conversionRate);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Аналитика</h1>
        <p className="text-text-secondary text-sm mt-1">Подробная статистика ваших продуктов</p>
      </motion.div>

      {/* Revenue overview */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4"
      >
        <div className="col-span-2 p-6 rounded-2xl bg-bg-card border border-border">
          <h3 className="text-sm font-medium text-text-secondary mb-4">Доход по продуктам</h3>
          <div className="space-y-3">
            {sortedByRevenue.map((product, i) => {
              const maxRevenue = sortedByRevenue[0].revenue;
              const width = (product.revenue / maxRevenue) * 100;
              return (
                <div key={product.id} className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm truncate max-w-[60%]">{product.title}</span>
                    <span className="text-sm font-semibold">{formatPrice(product.revenue)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-bg-elevated overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="h-full rounded-full bg-gradient-to-r from-gold/50 to-gold"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-bg-card border border-border">
          <h3 className="text-sm font-medium text-text-secondary mb-4">Лучшая конверсия</h3>
          <div className="space-y-3">
            {sortedByConversion.slice(0, 5).map((product, i) => (
              <div key={product.id} className="flex items-center gap-3">
                <span className="text-xs text-text-tertiary w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{product.title}</div>
                  <div className="text-xs text-text-tertiary">
                    {formatNumber(product.views)} просмотров
                  </div>
                </div>
                <span className="text-sm font-semibold text-green">
                  {product.conversionRate}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Products table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-bg-card border border-border overflow-hidden"
      >
        <div className="p-5 border-b border-border">
          <h3 className="text-base font-semibold">Детализация по продуктам</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Продукт
                </th>
                <th className="text-right px-5 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Цена
                </th>
                <th className="text-right px-5 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Продажи
                </th>
                <th className="text-right px-5 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Просмотры
                </th>
                <th className="text-right px-5 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Конверсия
                </th>
                <th className="text-right px-5 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Доход
                </th>
                <th className="text-right px-5 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Тренд
                </th>
                <th className="text-right px-5 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  <Sparkles size={12} className="inline text-gold" /> Потенциал
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border last:border-0 hover:bg-bg-elevated/50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <div className="text-sm font-medium truncate max-w-[200px]">
                          {product.title}
                        </div>
                        <div className="text-xs text-text-tertiary">{product.status === 'active' ? 'Активен' : 'Черновик'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-right px-5 py-4 text-sm">{formatPrice(product.price)}</td>
                  <td className="text-right px-5 py-4 text-sm font-medium">{product.sales}</td>
                  <td className="text-right px-5 py-4 text-sm text-text-secondary">
                    {formatNumber(product.views)}
                  </td>
                  <td className="text-right px-5 py-4">
                    <span className={`text-sm font-medium ${product.conversionRate >= 3 ? 'text-green' : 'text-text-secondary'}`}>
                      {product.conversionRate}%
                    </span>
                  </td>
                  <td className="text-right px-5 py-4 text-sm font-semibold">
                    {formatPrice(product.revenue)}
                  </td>
                  <td className="text-right px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                        product.trend >= 0
                          ? 'bg-green-dim text-green'
                          : 'bg-red-dim text-red'
                      }`}
                    >
                      {product.trend >= 0 ? (
                        <ArrowUpRight size={10} />
                      ) : (
                        <ArrowDownRight size={10} />
                      )}
                      {Math.abs(product.trend)}%
                    </span>
                  </td>
                  <td className="text-right px-5 py-4 text-sm font-medium text-gold">
                    {formatPrice(product.potentialRevenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl bg-bg-card border border-border relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles size={16} className="text-gold" />
            <h3 className="text-base font-semibold">AI-рекомендации для роста</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                title: 'Повысьте цену на пресеты',
                desc: 'Ваши пресеты продаются с конверсией 3.6% — это выше среднего. Попробуйте ₽1 590 (+23%).',
                impact: '+₽56K/мес',
                color: 'gold',
              },
              {
                title: 'Создайте бандл',
                desc: 'Объедините Notion-систему и гайд по YouTube в пакет со скидкой 20%. Средний чек вырастет.',
                impact: '+₽120K/мес',
                color: 'green',
              },
              {
                title: 'Добавьте видео-превью',
                desc: 'Продукты с видео имеют на 47% выше конверсию. Добавьте 30-секундное превью к Figma UI Kit.',
                impact: '+34% конверсия',
                color: 'purple',
              },
            ].map((tip) => (
              <div
                key={tip.title}
                className={`p-4 rounded-xl bg-${tip.color}-dim/30 border border-${tip.color}/10`}
              >
                <div className={`text-sm font-semibold text-${tip.color} mb-2`}>{tip.title}</div>
                <p className="text-xs text-text-secondary leading-relaxed mb-3">{tip.desc}</p>
                <div className={`text-xs font-semibold text-${tip.color}`}>{tip.impact}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
