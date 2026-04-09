import { motion } from 'framer-motion';
import { DollarSign, CreditCard, Clock, CheckCircle, Sparkles, ExternalLink, AlertCircle } from 'lucide-react';
import { useStore } from '../data/store';
import { formatPrice } from '../data/mockData';
import { useState } from 'react';

const PAYOUT_HISTORY = [
  { id: 'pay_01', amount: 8500, date: 'Mar 28, 2026', status: 'completed', method: 'Bank ****4242' },
  { id: 'pay_02', amount: 7240, date: 'Feb 28, 2026', status: 'completed', method: 'Bank ****4242' },
  { id: 'pay_03', amount: 6320, date: 'Jan 28, 2026', status: 'completed', method: 'Bank ****4242' },
  { id: 'pay_04', amount: 4890, date: 'Dec 28, 2025', status: 'completed', method: 'Bank ****4242' },
  { id: 'pay_05', amount: 3150, date: 'Nov 28, 2025', status: 'completed', method: 'Bank ****4242' },
];

export default function Wallet() {
  const { totalEarnings, addNotification } = useStore();
  const [stripeConnected, setStripeConnected] = useState(true);
  const pendingPayout = 4268;
  const totalPaidOut = PAYOUT_HISTORY.reduce((sum, p) => sum + p.amount, 0);
  const platformFee = totalEarnings * 0.05;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Wallet</h1>
        <p className="text-text-secondary text-sm mt-1">Manage your earnings and payouts</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="p-6 rounded-2xl bg-bg-card border border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="text-sm text-text-secondary mb-1">Available to withdraw</div>
            <div className="text-3xl font-bold text-gold mb-4">{formatPrice(pendingPayout)}</div>
            {stripeConnected ? (
              <button onClick={() => addNotification('Withdrawal request sent!')} className="w-full py-2.5 rounded-xl bg-gold text-bg-primary font-semibold text-sm hover:brightness-110 transition-all">Withdraw funds</button>
            ) : (
              <div className="text-xs text-text-tertiary">Connect Stripe to withdraw</div>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-2xl bg-bg-card border border-border">
          <div className="text-sm text-text-secondary mb-1">Total earned</div>
          <div className="text-3xl font-bold mb-2">{formatPrice(totalEarnings)}</div>
          <div className="text-xs text-text-tertiary">Platform fee: <span className="text-gold">{formatPrice(platformFee)}</span> (5%)</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="p-6 rounded-2xl bg-bg-card border border-border">
          <div className="text-sm text-text-secondary mb-1">Paid out</div>
          <div className="text-3xl font-bold mb-2">{formatPrice(totalPaidOut)}</div>
          <div className="text-xs text-text-tertiary">{PAYOUT_HISTORY.length} payouts to bank account</div>
        </motion.div>
      </div>

      {/* Stripe Connect */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="col-span-2 p-6 rounded-2xl bg-bg-card border border-border">
          <div className="flex items-center gap-2 mb-5">
            <CreditCard size={16} className="text-text-secondary" />
            <h3 className="text-base font-semibold">Payout method</h3>
          </div>

          {stripeConnected ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-bg-elevated">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 rounded-lg bg-[#635BFF] flex items-center justify-center text-xs font-bold text-white">Stripe</div>
                  <div>
                    <div className="text-sm font-medium">Stripe Connect</div>
                    <div className="text-xs text-text-tertiary">Bank account ****4242 · Instant payouts enabled</div>
                  </div>
                </div>
                <span className="text-xs text-green bg-green-dim px-2.5 py-1 rounded-full font-medium">Connected</span>
              </div>
              <div className="text-xs text-text-tertiary">
                Payouts are processed via Stripe. Funds arrive in 1-2 business days.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-gold-dim/30 border border-gold/10">
                <AlertCircle size={16} className="text-gold flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium">Connect Stripe to get paid</div>
                  <div className="text-xs text-text-tertiary mt-0.5">Set up your bank account to receive payouts from sales</div>
                </div>
              </div>
              <button
                onClick={() => setStripeConnected(true)}
                className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#635BFF] text-white font-semibold text-sm hover:brightness-110 transition-all"
              >
                <ExternalLink size={14} />
                Connect with Stripe
              </button>
              <div className="text-xs text-text-tertiary">
                You will be redirected to Stripe to securely connect your bank account. Numi never sees your banking details.
              </div>
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="p-6 rounded-2xl bg-bg-card border border-border">
          <div className="flex items-center gap-2 mb-4"><Clock size={16} className="text-text-secondary" /><h3 className="text-base font-semibold">Next payout</h3></div>
          <div className="text-2xl font-bold mb-1">{formatPrice(pendingPayout)}</div>
          <div className="text-xs text-text-tertiary mb-3">Apr 28, 2026</div>
          <div className="flex items-center gap-2 text-xs text-gold"><Sparkles size={12} /><span>Auto-payout every 28th</span></div>
        </motion.div>
      </div>

      {/* Payout history */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl bg-bg-card border border-border overflow-hidden">
        <div className="p-5 border-b border-border"><h3 className="text-base font-semibold">Payout history</h3></div>
        <div className="divide-y divide-border">
          {PAYOUT_HISTORY.map((payout, i) => (
            <motion.div key={payout.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.04 }} className="flex items-center gap-4 px-5 py-4 hover:bg-bg-elevated/50 transition-colors">
              <div className="w-9 h-9 rounded-full bg-green-dim flex items-center justify-center flex-shrink-0"><CheckCircle size={14} className="text-green" /></div>
              <div className="flex-1 min-w-0"><div className="text-sm font-medium">Payout to {payout.method}</div><div className="text-xs text-text-tertiary">{payout.date}</div></div>
              <div className="text-sm font-semibold">{formatPrice(payout.amount)}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
