import { motion } from 'framer-motion';
import { EARNINGS_HISTORY, formatPrice } from '../data/mockData';

export default function EarningsChart() {
  const maxAmount = Math.max(...EARNINGS_HISTORY.map((e) => e.amount));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="p-6 rounded-2xl bg-bg-card border border-border"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold">Динамика заработка</h3>
          <p className="text-sm text-text-secondary mt-0.5">Последние 7 месяцев</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-text-tertiary">Этот месяц</div>
          <div className="text-lg font-semibold text-gold">
            {formatPrice(EARNINGS_HISTORY[EARNINGS_HISTORY.length - 1].amount)}
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-3 h-40">
        {EARNINGS_HISTORY.map((entry, i) => {
          const height = (entry.amount / maxAmount) * 100;
          const isLast = i === EARNINGS_HISTORY.length - 1;
          return (
            <div key={entry.month} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full relative flex items-end justify-center" style={{ height: '128px' }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.8, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] }}
                  className={`w-full max-w-[40px] rounded-lg transition-colors ${
                    isLast
                      ? 'bg-gradient-to-t from-gold/60 to-gold'
                      : 'bg-bg-elevated hover:bg-bg-hover'
                  }`}
                />
              </div>
              <span className={`text-[11px] ${isLast ? 'text-gold font-medium' : 'text-text-tertiary'}`}>
                {entry.month}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
