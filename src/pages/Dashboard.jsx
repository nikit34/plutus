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
import { formatPrice, formatNumber, ACTIVITY_FEED, TODAY_STATS, CREATOR, generateTip } from '../data/mockData';
import Tooltip from '../components/Tooltip';

export default function Dashboard() {
  const { creator, products } = useStore();
  const tip = generateTip(products);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Hey, <span className="gold-shimmer">{creator.name.split(' ')[0]}</span>
        </h1>
        <p className="text-text-secondary text-sm mt-1">Here is what happened today</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-4">
        <QuickStat icon={DollarSign} label="Earned today" value={formatPrice(TODAY_STATS.earnings)} change={TODAY_STATS.earningsChange} delay={0.05} />
        <QuickStat icon={ShoppingCart} label="Sales today" value={TODAY_STATS.sales} change={TODAY_STATS.salesChange} delay={0.1} />
        <QuickStat icon={Eye} label="Views today" value={formatNumber(TODAY_STATS.views)} change={TODAY_STATS.viewsChange} delay={0.15} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="col-span-2 rounded-2xl bg-bg-card border border-border">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-base font-semibold">Feed</h2>
            <span className="text-xs text-text-tertiary">Today</span>
          </div>
          <div className="divide-y divide-border">
            {ACTIVITY_FEED.map((event, i) => (
              <FeedItem key={event.id} event={event} index={i} />
            ))}
          </div>
        </motion.div>

        <div className="space-y-4">
          {tip && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="p-5 rounded-2xl bg-bg-card border border-border relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-gold-dim border border-gold/10 flex items-center justify-center">
                    <Sparkles size={12} className="text-gold" />
                  </div>
                  <span className="text-sm font-semibold">Tip of the day</span>
                  <Tooltip>
                    <div className="space-y-1.5">
                      <div><span className="text-text-primary font-medium">{tip.product.title}</span></div>
                      <div>Current conversion: <span className="text-text-primary font-medium">{tip.currentConversion.toFixed(1)}%</span> (platform avg: {tip.benchmark}%)</div>
                      <div>Current rev/view: <span className="text-text-primary font-medium">${tip.currentRpv}</span></div>
                      <div>After +{tip.priceIncreasePct}% price: conversion drops to ~{tip.newConversion}%, but rev/view rises to <span className="text-gold font-medium">${tip.newRpv}</span></div>
                      <div className="pt-1 border-t border-border text-text-tertiary">Higher revenue per view = more money from the same traffic</div>
                    </div>
                  </Tooltip>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Raise price on <span className="text-text-primary font-medium">{tip.product.title}</span> by {tip.priceIncreasePct}% ({formatPrice(tip.product.price)} → {formatPrice(tip.newPrice)}) — {tip.currentConversion.toFixed(1)}% conversion supports it.
                </p>
                <div className="mt-3 text-xs font-semibold text-gold">Forecast: +{formatPrice(tip.monthlyGain)}/mo</div>
              </div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} className="p-5 rounded-2xl bg-bg-card border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-dim border border-purple/10 flex items-center justify-center">
                  <Users size={12} className="text-purple" />
                </div>
                <span className="text-sm font-semibold">Audience</span>
              </div>
              <span className="text-xs font-medium text-green bg-green-dim px-2 py-0.5 rounded-full">+{CREATOR.subscribersGrowth}%</span>
            </div>
            <div className="text-2xl font-bold">{CREATOR.subscribers.toLocaleString('en-US')}</div>
            <div className="text-xs text-text-tertiary mt-1">followers{CREATOR.socialLabel ? ` · ${CREATOR.socialLabel}` : ''}</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-5 rounded-2xl bg-bg-card border border-border space-y-2.5">
            <h3 className="text-sm font-semibold mb-3">Quick actions</h3>
            <Link to="/create" className="flex items-center gap-3 p-3 rounded-xl bg-gold-dim border border-gold/10 text-sm font-medium text-gold hover:bg-gold/15 transition-colors no-underline">
              <Zap size={14} />Create new product<ArrowUpRight size={12} className="ml-auto" />
            </Link>
            <Link to="/analytics" className="flex items-center gap-3 p-3 rounded-xl bg-bg-elevated text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors no-underline">
              <TrendingUp size={14} />View analytics<ArrowUpRight size={12} className="ml-auto" />
            </Link>
            <Link to="/wallet" className="flex items-center gap-3 p-3 rounded-xl bg-bg-elevated text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors no-underline">
              <DollarSign size={14} />Withdraw funds<ArrowUpRight size={12} className="ml-auto" />
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
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }} className="p-4 rounded-2xl bg-bg-card border border-border">
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-xl bg-bg-elevated flex items-center justify-center">
          <Icon size={16} className="text-text-secondary" />
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${positive ? 'bg-green-dim text-green' : 'bg-red-dim text-red'}`}>
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
      <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + index * 0.03 }} className="flex items-center gap-4 px-5 py-3.5 hover:bg-bg-elevated/50 transition-colors">
        <div className="w-8 h-8 rounded-full bg-green-dim flex items-center justify-center flex-shrink-0"><ShoppingCart size={13} className="text-green" /></div>
        <div className="flex-1 min-w-0"><div className="text-sm"><span className="font-medium">{event.productTitle}</span></div></div>
        <div className="text-sm font-semibold text-green flex-shrink-0">+{formatPrice(event.amount)}</div>
        <div className="text-xs text-text-tertiary flex-shrink-0 w-20 text-right">{event.time}</div>
      </motion.div>
    );
  }
  if (event.type === 'milestone') {
    return (
      <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + index * 0.03 }} className="flex items-center gap-4 px-5 py-3.5 hover:bg-bg-elevated/50 transition-colors">
        <div className="w-8 h-8 rounded-full bg-gold-dim flex items-center justify-center flex-shrink-0"><Trophy size={13} className="text-gold" /></div>
        <div className="flex-1 min-w-0"><div className="text-sm font-medium">{event.text}</div></div>
        <div className="text-xs text-text-tertiary flex-shrink-0 w-20 text-right">{event.time}</div>
      </motion.div>
    );
  }
  if (event.type === 'review') {
    return (
      <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + index * 0.03 }} className="flex items-center gap-4 px-5 py-3.5 hover:bg-bg-elevated/50 transition-colors">
        <div className="w-8 h-8 rounded-full bg-purple-dim flex items-center justify-center flex-shrink-0"><Star size={13} className="text-purple" /></div>
        <div className="flex-1 min-w-0">
          <div className="text-sm"><span className="text-text-secondary">New review on </span><span className="font-medium">{event.productTitle}</span></div>
          <div className="text-xs text-text-tertiary mt-0.5 italic">{event.text}</div>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">{[...Array(event.stars)].map((_, i) => <Star key={i} size={10} fill="#E2B94B" stroke="#E2B94B" />)}</div>
        <div className="text-xs text-text-tertiary flex-shrink-0 w-20 text-right">{event.time}</div>
      </motion.div>
    );
  }
  if (event.type === 'tip') {
    return (
      <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + index * 0.03 }} className="flex items-center gap-4 px-5 py-3.5 bg-gold-dim/30 hover:bg-gold-dim/50 transition-colors">
        <div className="w-8 h-8 rounded-full bg-gold-dim flex items-center justify-center flex-shrink-0"><Sparkles size={13} className="text-gold" /></div>
        <div className="flex-1 min-w-0"><div className="text-sm text-text-secondary">{event.text}</div></div>
        <div className="text-xs text-text-tertiary flex-shrink-0 w-20 text-right">{event.time}</div>
      </motion.div>
    );
  }
  return null;
}
