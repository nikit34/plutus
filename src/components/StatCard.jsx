import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, subValue, trend, color = 'gold', delay = 0 }) {
  const colorMap = {
    gold: { bg: 'bg-gold-dim', text: 'text-gold', border: 'border-gold/10' },
    green: { bg: 'bg-green-dim', text: 'text-green', border: 'border-green/10' },
    blue: { bg: 'bg-blue-dim', text: 'text-blue', border: 'border-blue/10' },
    purple: { bg: 'bg-purple-dim', text: 'text-purple', border: 'border-purple/10' },
  };
  const c = colorMap[color] || colorMap.gold;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
      className="p-5 rounded-2xl bg-bg-card border border-border hover:border-border-strong transition-colors group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
          <Icon size={18} className={c.text} />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            trend >= 0
              ? 'bg-green-dim text-green'
              : 'bg-red-dim text-red'
          }`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      <div className="text-sm text-text-secondary mt-1">{label}</div>
      {subValue && (
        <div className="text-xs text-text-tertiary mt-2">{subValue}</div>
      )}
    </motion.div>
  );
}
