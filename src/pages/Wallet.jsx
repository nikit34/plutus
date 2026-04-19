import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Clock, CheckCircle, Sparkles, ExternalLink, AlertCircle, X, Loader2, ArrowRight, Shield, Bitcoin } from 'lucide-react';
import { useStore } from '../data/store';
import { formatPrice } from '../data/mockData';
import { walletApi } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Wallet() {
  const { addNotification } = useStore();
  const { user, refreshUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [summary, setSummary] = useState(null);
  const [payouts, setPayouts] = useState([]);
  const [withdrawStep, setWithdrawStep] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('stripe');
  const [connecting, setConnecting] = useState(false);

  const load = async () => {
    const [s, p] = await Promise.all([walletApi.summary(), walletApi.payouts()]);
    setSummary(s);
    setPayouts(p.payouts);
  };

  useEffect(() => {
    load().catch((err) => addNotification(err.message || 'Failed to load wallet', 'error'));
  }, [addNotification]);

  // Refresh Stripe Connect status after returning from onboarding
  useEffect(() => {
    const connect = searchParams.get('connect');
    if (connect === 'done' || connect === 'refresh') {
      walletApi.connectRefresh().then(() => { refreshUser(); load(); }).catch(() => {});
      searchParams.delete('connect');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, refreshUser]);

  const balance = summary?.available || 0;
  const stripeConnected = summary?.stripeConnected;

  const connectStripe = async () => {
    setConnecting(true);
    try {
      const { url } = await walletApi.connectStart();
      window.location.href = url;
    } catch (err) {
      addNotification(err.message || 'Stripe Connect failed', 'error');
      setConnecting(false);
    }
  };

  const openWithdraw = () => {
    setWithdrawAmount(String(Math.floor(balance)));
    setWithdrawMethod(stripeConnected ? 'stripe' : (user?.cryptoAddress ? 'crypto' : 'stripe'));
    setWithdrawStep('confirm');
  };

  const confirmWithdraw = async () => {
    setWithdrawStep('processing');
    try {
      const { payout } = await walletApi.withdraw(Number(withdrawAmount), { method: withdrawMethod });
      setPayouts((prev) => [payout, ...prev]);
      const s = await walletApi.summary();
      setSummary(s);
      setWithdrawStep('done');
    } catch (err) {
      addNotification(err.message || 'Withdrawal failed', 'error');
      setWithdrawStep(null);
    }
  };

  if (!summary) return <div className="flex items-center justify-center py-24 text-text-tertiary gap-2"><Loader2 size={16} className="animate-spin" />Loading…</div>;

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
            <div className="text-3xl font-bold text-gold mb-4">{formatPrice(balance)}</div>
            <button
              onClick={openWithdraw}
              disabled={balance <= 0}
              className="w-full py-2.5 rounded-xl bg-gold text-bg-primary font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {balance > 0 ? 'Withdraw funds' : 'No funds available'}
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-2xl bg-bg-card border border-border">
          <div className="text-sm text-text-secondary mb-1">Total earned</div>
          <div className="text-3xl font-bold mb-2">{formatPrice(summary.totalEarnings)}</div>
          <div className="text-xs text-text-tertiary">Platform fee: <span className="text-gold">{formatPrice(summary.platformFee)}</span> (5%)</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="p-6 rounded-2xl bg-bg-card border border-border">
          <div className="text-sm text-text-secondary mb-1">Paid out</div>
          <div className="text-3xl font-bold mb-2">{formatPrice(summary.paidOut)}</div>
          <div className="text-xs text-text-tertiary">{summary.payoutsCount} payouts to bank account</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="col-span-2 p-6 rounded-2xl bg-bg-card border border-border">
          <div className="flex items-center gap-2 mb-5"><CreditCard size={16} className="text-text-secondary" /><h3 className="text-base font-semibold">Payout method</h3></div>
          {stripeConnected ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-bg-elevated">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 rounded-lg bg-[#635BFF] flex items-center justify-center text-xs font-bold text-white">Stripe</div>
                  <div>
                    <div className="text-sm font-medium">Stripe Connect</div>
                    <div className="text-xs text-text-tertiary">Linked account · Ready for payouts</div>
                  </div>
                </div>
                <span className="text-xs text-green bg-green-dim px-2.5 py-1 rounded-full font-medium">Connected</span>
              </div>
              <div className="text-xs text-text-tertiary">Payouts are processed via Stripe. Funds arrive in 1–2 business days.</div>
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
              <button onClick={connectStripe} disabled={connecting} className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#635BFF] text-white font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-60">
                {connecting ? <Loader2 size={14} className="animate-spin" /> : <ExternalLink size={14} />}
                Connect with Stripe
              </button>
              <div className="text-xs text-text-tertiary">You will be redirected to Stripe to securely connect your bank account.</div>
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="p-6 rounded-2xl bg-bg-card border border-border">
          <div className="flex items-center gap-2 mb-4"><Clock size={16} className="text-text-secondary" /><h3 className="text-base font-semibold">Available</h3></div>
          <div className="text-2xl font-bold mb-1">{formatPrice(balance)}</div>
          <div className="text-xs text-text-tertiary mb-3">Ready to withdraw</div>
          <div className="flex items-center gap-2 text-xs text-gold"><Sparkles size={12} /><span>Instant payout to Stripe</span></div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl bg-bg-card border border-border overflow-hidden">
        <div className="p-5 border-b border-border"><h3 className="text-base font-semibold">Payout history</h3></div>
        <div className="divide-y divide-border">
          {payouts.length === 0 && <div className="px-5 py-10 text-center text-sm text-text-tertiary">No payouts yet</div>}
          {payouts.map((payout, i) => (
            <motion.div key={payout.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i < 6 ? 0.3 + i * 0.04 : 0 }} className="flex items-center gap-4 px-5 py-4 hover:bg-bg-elevated/50 transition-colors">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${payout.status === 'paid' ? 'bg-green-dim' : payout.status === 'failed' ? 'bg-red-dim' : 'bg-bg-elevated'}`}>
                {payout.status === 'paid' ? <CheckCircle size={14} className="text-green" /> : payout.status === 'failed' ? <AlertCircle size={14} className="text-red" /> : <Clock size={14} className="text-text-tertiary" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">Payout via {payout.method}</div>
                <div className="text-xs text-text-tertiary">{new Date(payout.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {payout.status}</div>
              </div>
              <div className="text-sm font-semibold">{formatPrice(payout.amount)}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {withdrawStep && (
          <WithdrawModal
            step={withdrawStep}
            amount={withdrawAmount}
            balance={balance}
            method={withdrawMethod}
            onChangeMethod={setWithdrawMethod}
            user={user}
            onChangeAmount={setWithdrawAmount}
            onConfirm={confirmWithdraw}
            onClose={() => setWithdrawStep(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function WithdrawModal({ step, amount, balance, method, onChangeMethod, user, onChangeAmount, onConfirm, onClose }) {
  const processingLabel = method === 'crypto' ? 'Sending crypto via NOWPayments' : 'Sending to your bank via Stripe';
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={step !== 'processing' ? onClose : undefined} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 12 }} className="relative w-full max-w-md rounded-2xl bg-bg-card border border-border shadow-2xl overflow-hidden">
        {step === 'confirm' && <ConfirmStep amount={amount} balance={balance} method={method} onChangeMethod={onChangeMethod} user={user} onChangeAmount={onChangeAmount} onConfirm={onConfirm} onClose={onClose} />}
        {step === 'processing' && <div className="p-12 text-center"><Loader2 size={36} className="animate-spin mx-auto mb-5 text-gold" /><div className="text-lg font-semibold mb-2">Processing withdrawal…</div><div className="text-sm text-text-tertiary">{processingLabel}</div></div>}
        {step === 'done' && <DoneStep amount={amount} method={method} onClose={onClose} />}
      </motion.div>
    </motion.div>
  );
}

function ConfirmStep({ amount, balance, method, onChangeMethod, user, onChangeAmount, onConfirm, onClose }) {
  const numAmount = Number(amount);
  const cryptoReady = !!(user?.cryptoAddress && user?.cryptoCurrency);
  const valid = numAmount > 0 && numAmount <= balance && (method !== 'crypto' || cryptoReady);
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Withdraw funds</h3>
        <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-elevated transition-colors"><X size={16} /></button>
      </div>
      <div className="mb-5">
        <label className="block text-xs text-text-tertiary mb-2">Amount</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary text-lg">$</span>
          <input type="number" value={amount} onChange={(e) => onChangeAmount(e.target.value)} max={balance} min={1} className="w-full pl-9 pr-4 py-3.5 rounded-xl bg-bg-input border border-border text-text-primary text-2xl font-bold focus:border-gold/30 transition-colors" />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-text-tertiary">Available: {formatPrice(balance)}</span>
          <button onClick={() => onChangeAmount(String(Math.floor(balance)))} className="text-xs text-gold hover:underline">Withdraw all</button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs text-text-tertiary mb-2">Method</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChangeMethod('stripe')}
            className={`p-3 rounded-xl border text-left transition-colors ${method === 'stripe' ? 'border-gold bg-gold-dim/30' : 'border-border bg-bg-elevated hover:bg-bg-hover'}`}
          >
            <div className="flex items-center gap-2 mb-1"><div className="w-8 h-5 rounded bg-[#635BFF] flex items-center justify-center text-[9px] font-bold text-white">Stripe</div><span className="text-sm font-medium">Bank</span></div>
            <div className="text-[11px] text-text-tertiary">1–2 business days</div>
          </button>
          <button
            type="button"
            onClick={() => onChangeMethod('crypto')}
            className={`p-3 rounded-xl border text-left transition-colors ${method === 'crypto' ? 'border-gold bg-gold-dim/30' : 'border-border bg-bg-elevated hover:bg-bg-hover'}`}
          >
            <div className="flex items-center gap-2 mb-1"><Bitcoin size={14} className="text-gold" /><span className="text-sm font-medium">Crypto</span></div>
            <div className="text-[11px] text-text-tertiary">{cryptoReady ? `To ${user.cryptoCurrency.toUpperCase()}` : 'Set address in Settings'}</div>
          </button>
        </div>
      </div>

      {method === 'crypto' ? (
        cryptoReady ? (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-bg-elevated mb-5">
            <Bitcoin size={16} className="text-gold mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{user.cryptoCurrency.toUpperCase()}</div>
              <div className="text-[11px] text-text-tertiary font-mono truncate">{user.cryptoAddress}</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-red-dim/30 border border-red/20 mb-5 text-xs text-red">
            <AlertCircle size={14} /><span>Add a crypto address in Settings before withdrawing</span>
          </div>
        )
      ) : (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-elevated mb-5">
          <div className="w-10 h-7 rounded-lg bg-[#635BFF] flex items-center justify-center text-[10px] font-bold text-white">Stripe</div>
          <div className="flex-1">
            <div className="text-sm font-medium">Connected Stripe account</div>
            <div className="text-xs text-text-tertiary">Arrives in 1-2 business days</div>
          </div>
        </div>
      )}

      <button onClick={onConfirm} disabled={!valid} className="w-full py-3.5 rounded-xl bg-gold text-bg-primary font-semibold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
        Confirm withdrawal<ArrowRight size={14} />
      </button>
      <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-text-tertiary">
        <Shield size={10} /><span>Secured by {method === 'crypto' ? 'NOWPayments' : 'Stripe'}</span>
      </div>
    </div>
  );
}

function DoneStep({ amount, method, onClose }) {
  return (
    <div className="p-8 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }} className="w-16 h-16 rounded-full bg-green-dim mx-auto mb-5 flex items-center justify-center">
        <CheckCircle size={28} className="text-green" />
      </motion.div>
      <div className="text-xl font-semibold mb-2">Withdrawal sent!</div>
      <div className="text-3xl font-bold text-gold mb-2">{formatPrice(Number(amount))}</div>
      <div className="text-sm text-text-tertiary mb-6">{method === 'crypto' ? 'Crypto is on its way — usually 5–30 minutes on-chain' : 'Funds will arrive in 1–2 business days'}</div>
      <button onClick={onClose} className="px-8 py-3 rounded-xl bg-bg-elevated border border-border text-sm font-medium hover:bg-bg-hover transition-colors">Done</button>
    </div>
  );
}
