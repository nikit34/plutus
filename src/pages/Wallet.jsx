import { motion } from 'framer-motion';
import {
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Clock,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../data/store';
import { formatPrice } from '../data/mockData';

const PAYOUT_HISTORY = [
  { id: 'pay_01', amount: 85000, date: '28 мар 2026', status: 'completed', method: '**** 4242' },
  { id: 'pay_02', amount: 72400, date: '28 фев 2026', status: 'completed', method: '**** 4242' },
  { id: 'pay_03', amount: 63200, date: '28 янв 2026', status: 'completed', method: '**** 4242' },
  { id: 'pay_04', amount: 48900, date: '28 дек 2025', status: 'completed', method: '**** 4242' },
  { id: 'pay_05', amount: 31500, date: '28 ноя 2025', status: 'completed', method: '**** 4242' },
];

export default function Wallet() {
  const { totalEarnings, addNotification } = useStore();
  const pendingPayout = 42680;
  const totalPaidOut = PAYOUT_HISTORY.reduce((sum, p) => sum + p.amount, 0);
  const platformFee = totalEarnings * 0.05;

  const handleWithdraw = () => {
    addNotification('Заявка на вывод отправлена!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Кошелёк</h1>
        <p className="text-text-secondary text-sm mt-1">Управление доходами и выплатами</p>
      </motion.div>

      {/* Balance cards */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-6 rounded-2xl bg-bg-card border border-border relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="text-sm text-text-secondary mb-1">Доступно к выводу</div>
            <div className="text-3xl font-bold text-gold mb-4">{formatPrice(pendingPayout)}</div>
            <button
              onClick={handleWithdraw}
              className="w-full py-2.5 rounded-xl bg-gold text-bg-primary font-semibold text-sm hover:brightness-110 transition-all"
            >
              Вывести средства
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-bg-card border border-border"
        >
          <div className="text-sm text-text-secondary mb-1">Всего заработано</div>
          <div className="text-3xl font-bold mb-2">{formatPrice(totalEarnings)}</div>
          <div className="text-xs text-text-tertiary">
            Комиссия платформы: <span className="text-gold">{formatPrice(platformFee)}</span> (5%)
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-6 rounded-2xl bg-bg-card border border-border"
        >
          <div className="text-sm text-text-secondary mb-1">Выведено</div>
          <div className="text-3xl font-bold mb-2">{formatPrice(totalPaidOut)}</div>
          <div className="text-xs text-text-tertiary">
            {PAYOUT_HISTORY.length} выплат на карту **** 4242
          </div>
        </motion.div>
      </div>

      {/* Payment method + Next payout */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-2 p-6 rounded-2xl bg-bg-card border border-border"
        >
          <div className="flex items-center gap-2 mb-5">
            <CreditCard size={16} className="text-text-secondary" />
            <h3 className="text-base font-semibold">Способ получения</h3>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-bg-elevated">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 rounded-lg bg-bg-primary border border-border flex items-center justify-center text-xs font-bold text-text-secondary">
                VISA
              </div>
              <div>
                <div className="text-sm font-medium">**** **** **** 4242</div>
                <div className="text-xs text-text-tertiary">Срок: 12/28</div>
              </div>
            </div>
            <span className="text-xs text-green bg-green-dim px-2.5 py-1 rounded-full font-medium">
              Активна
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-6 rounded-2xl bg-bg-card border border-border"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="text-text-secondary" />
            <h3 className="text-base font-semibold">Следующая выплата</h3>
          </div>
          <div className="text-2xl font-bold mb-1">{formatPrice(pendingPayout)}</div>
          <div className="text-xs text-text-tertiary mb-3">28 апр 2026</div>
          <div className="flex items-center gap-2 text-xs text-gold">
            <Sparkles size={12} />
            <span>Автоматическая выплата каждый 28-й день</span>
          </div>
        </motion.div>
      </div>

      {/* Payout history */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-bg-card border border-border overflow-hidden"
      >
        <div className="p-5 border-b border-border">
          <h3 className="text-base font-semibold">История выплат</h3>
        </div>
        <div className="divide-y divide-border">
          {PAYOUT_HISTORY.map((payout, i) => (
            <motion.div
              key={payout.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.04 }}
              className="flex items-center gap-4 px-5 py-4 hover:bg-bg-elevated/50 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-green-dim flex items-center justify-center flex-shrink-0">
                <CheckCircle size={14} className="text-green" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">Выплата на {payout.method}</div>
                <div className="text-xs text-text-tertiary">{payout.date}</div>
              </div>
              <div className="text-sm font-semibold">{formatPrice(payout.amount)}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
