import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Check, Circle, Sparkles, X, Send, Copy } from 'lucide-react';
import { useStore } from '../data/store';
import { useAuth } from '../contexts/AuthContext';

const LS_DISMISS = 'plutus_onboarding_dismissed_v1';
const LS_SHARED = 'plutus_onboarding_shared_v1';

function readFlag(key) {
  try { return localStorage.getItem(key) === '1'; } catch { return false; }
}
function writeFlag(key, v) {
  try { localStorage.setItem(key, v ? '1' : '0'); } catch { /* ignore */ }
}

export default function OnboardingChecklist() {
  const { products, productsLoaded, addNotification } = useStore();
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(readFlag(LS_DISMISS));
  const [shared, setShared] = useState(readFlag(LS_SHARED));
  const [sharePanelFor, setSharePanelFor] = useState(null);

  const firstProduct = products[0];

  const steps = useMemo(() => {
    const hasProduct = productsLoaded && products.length > 0;
    const hasPayout = !!user?.stripeConnected || !!user?.cryptoAddress;
    const didShare = shared && hasProduct;
    return [
      { key: 'product', done: hasProduct, title: 'Create your first product', desc: 'Upload a file, template, or drop a link', href: '/create', cta: 'Create product' },
      { key: 'payout',  done: hasPayout,  title: 'Set up payouts',          desc: 'Connect Stripe or add a crypto address', href: '/wallet', cta: 'Set up payouts' },
      { key: 'share',   done: didShare,   title: 'Share your link',         desc: 'Post it where your audience lives',     action: hasProduct ? 'share' : null, cta: 'Copy & share' },
    ];
  }, [productsLoaded, products.length, user?.stripeConnected, user?.cryptoAddress, shared]);

  const completed = steps.filter((s) => s.done).length;
  const total = steps.length;

  if (dismissed || !productsLoaded || completed === total) return null;

  const handleDismiss = () => {
    writeFlag(LS_DISMISS, true);
    setDismissed(true);
  };

  const handleShare = async () => {
    if (!firstProduct) return;
    const url = `${window.location.origin}/product/${firstProduct.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      addNotification('Link copied');
    } catch { /* ignore */ }
    setSharePanelFor(firstProduct);
  };

  const markShared = () => {
    writeFlag(LS_SHARED, true);
    setShared(true);
    setSharePanelFor(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl bg-bg-card border border-gold/15 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gold/8 via-transparent to-transparent pointer-events-none" />
      <div className="relative px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gold-dim border border-gold/10 flex items-center justify-center">
              <Sparkles size={12} className="text-gold" />
            </div>
            <div>
              <div className="text-sm font-semibold">Get to your first sale</div>
              <div className="text-[11px] text-text-tertiary">{completed} of {total} done</div>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-bg-elevated transition-colors"
            aria-label="Dismiss checklist"
          >
            <X size={14} />
          </button>
        </div>

        <div className="h-1 rounded-full bg-bg-elevated overflow-hidden mb-3">
          <motion.div
            className="h-full bg-gold"
            initial={{ width: 0 }}
            animate={{ width: `${(completed / total) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="space-y-1.5">
          {steps.map((s) => (
            <StepRow
              key={s.key}
              step={s}
              onShare={s.action === 'share' ? handleShare : null}
            />
          ))}
        </div>

        <AnimatePresence>
          {sharePanelFor && (
            <SharePanel
              product={sharePanelFor}
              onDone={markShared}
              onClose={() => setSharePanelFor(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function StepRow({ step, onShare }) {
  const base = 'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors';
  const content = (
    <>
      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? 'bg-gold text-bg-primary' : 'border border-border'}`}>
        {step.done ? <Check size={12} strokeWidth={3} /> : <Circle size={10} className="text-text-tertiary" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium ${step.done ? 'text-text-tertiary line-through' : 'text-text-primary'}`}>{step.title}</div>
        <div className="text-[11px] text-text-tertiary">{step.desc}</div>
      </div>
      {!step.done && <span className="text-xs text-gold font-medium">{step.cta}</span>}
    </>
  );

  if (step.done) return <div className={base}>{content}</div>;
  if (step.action === 'share' && onShare) {
    return (
      <button type="button" onClick={onShare} className={`${base} w-full text-left bg-bg-elevated/40 hover:bg-bg-elevated`}>
        {content}
      </button>
    );
  }
  return (
    <Link to={step.href} className={`${base} bg-bg-elevated/40 hover:bg-bg-elevated no-underline`}>
      {content}
    </Link>
  );
}

function SharePanel({ product, onDone, onClose }) {
  const url = `${window.location.origin}/product/${product.slug}`;
  const text = `Just shipped: ${product.title} — ${product.description?.slice(0, 120) || ''}`;
  const xHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  const tgHref = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;

  const copy = async () => {
    try { await navigator.clipboard.writeText(url); } catch { /* ignore */ }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-3 overflow-hidden"
    >
      <div className="p-3 rounded-xl bg-bg-elevated border border-border">
        <div className="flex items-center justify-between mb-2.5">
          <div className="text-xs font-semibold">Share this link</div>
          <button onClick={onClose} className="w-6 h-6 rounded-md flex items-center justify-center text-text-tertiary hover:text-text-primary">
            <X size={12} />
          </button>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <code className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg bg-bg-input text-[11px] font-mono truncate">{url}</code>
          <button onClick={copy} className="px-2.5 py-1.5 rounded-lg bg-bg-card border border-border text-xs hover:bg-bg-hover flex items-center gap-1.5">
            <Copy size={11} />Copy
          </button>
        </div>
        <div className="flex items-center gap-2">
          <a href={xHref} target="_blank" rel="noopener noreferrer" onClick={onDone} className="flex-1 px-3 py-2 rounded-lg bg-black text-white text-xs font-medium flex items-center justify-center gap-1.5 no-underline hover:brightness-125">
            <span className="font-bold text-sm leading-none">𝕏</span>Post on X
          </a>
          <a href={tgHref} target="_blank" rel="noopener noreferrer" onClick={onDone} className="flex-1 px-3 py-2 rounded-lg bg-[#26A5E4] text-white text-xs font-medium flex items-center justify-center gap-1.5 no-underline hover:brightness-110">
            <Send size={12} />Telegram
          </a>
          <button onClick={onDone} className="px-3 py-2 rounded-lg bg-bg-card border border-border text-xs hover:bg-bg-hover">
            Mark done
          </button>
        </div>
      </div>
    </motion.div>
  );
}
