import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles, ArrowRight, Check, X, Zap, Shield, Bitcoin, CreditCard,
  BarChart3, Palette, FileDown, Link2, FileText, Star,
} from 'lucide-react';
import { getHeroVariant } from '../lib/abTest';
import { trackEvent } from '../hooks/useAnalytics';
import useSEO from '../hooks/useSEO';

const FEE = 5;
const GUMROAD_FEE = 10;
const ETSY_FEE = 6.5;

export default function Landing() {
  useSEO({
    title: 'Plutus — Sell Digital Products. Keep 95%.',
    description: 'Creator platform for eBooks, templates, courses and guides. Card + crypto checkout, instant payouts. 5% flat fee, no monthly.',
    canonicalPath: '/',
  });
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary overflow-x-hidden">
      <Nav />
      <Hero />
      <Trust />
      <Features />
      <HowItWorks />
      <Comparison />
      <Pricing />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}

/* ------------------------------- Nav ------------------------------- */

function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-bg-primary/70 border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gold">
          <Sparkles size={18} />
          <span className="font-display text-xl font-semibold">Plutus</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-text-secondary">
          <a href="#features" className="hover:text-text-primary transition-colors">Features</a>
          <a href="#how" className="hover:text-text-primary transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-text-primary transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-text-primary transition-colors">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors no-underline">Log in</Link>
          <Link
            to="/signup"
            onClick={() => trackEvent('hero_cta_click', { cta_location: 'nav' })}
            className="px-4 py-2 rounded-xl bg-gold text-bg-primary text-sm font-semibold hover:brightness-110 transition-all no-underline"
          >
            Start free
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------- Hero ------------------------------- */

function Hero() {
  // Match SSR output ('A') on first render, then swap to the persisted
  // variant after hydration to avoid a hydration-mismatch warning.
  const [variant, setVariant] = useState('A');
  useEffect(() => { setVariant(getHeroVariant()); }, []);
  const headline = variant === 'B' ? 'The fair alternative to Gumroad.' : 'Sell digital products.';
  return (
    <section className="relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-[520px] h-[520px] rounded-full bg-gold/10 blur-[140px]" />
        <div className="absolute top-40 right-0 w-[420px] h-[420px] rounded-full bg-purple/10 blur-[140px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 grid md:grid-cols-5 gap-12 items-center">
        <div className="md:col-span-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-dim border border-gold/15 text-xs text-gold mb-6">
            <Sparkles size={11} />
            For digital creators — built 2026
          </div>
          <h1 className="font-display font-semibold tracking-tight leading-[1.02] text-5xl md:text-7xl mb-6">
            {headline}<br />
            <span className="gold-shimmer italic">Keep {100 - FEE}%.</span>
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed max-w-xl mb-8">
            The creator platform for eBooks, templates, courses, and guides. Beautiful product pages, instant payouts to bank or crypto, zero code required.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/signup"
              onClick={() => trackEvent('hero_cta_click', { cta_location: 'hero' })}
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gold text-bg-primary font-semibold text-sm hover:brightness-110 transition-all no-underline"
            >
              Start selling free
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a href="#how" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-bg-card border border-border text-sm font-medium hover:bg-bg-elevated transition-colors no-underline">
              See how it works
            </a>
          </div>
          <div className="mt-8 flex items-center gap-6 text-xs text-text-tertiary">
            <span className="flex items-center gap-1.5"><Check size={12} className="text-green" /> No monthly fee</span>
            <span className="flex items-center gap-1.5"><Check size={12} className="text-green" /> 5 min to set up</span>
            <span className="flex items-center gap-1.5"><Check size={12} className="text-green" /> Crypto + bank payouts</span>
          </div>
        </div>

        <div className="md:col-span-2">
          <MockProductCard />
        </div>
      </div>
    </section>
  );
}

function MockProductCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, rotate: -2 }}
      animate={{ opacity: 1, scale: 1, rotate: -2 }}
      transition={{ delay: 0.15, type: 'spring', stiffness: 120 }}
      className="relative mx-auto max-w-sm"
    >
      <div className="absolute -inset-4 bg-gold/20 blur-3xl opacity-40 pointer-events-none" />
      <div className="relative rounded-3xl overflow-hidden border border-border-strong shadow-2xl bg-bg-card">
        <div className="h-44 bg-gradient-to-br from-purple/40 via-gold/20 to-blue/30 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent" />
          <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-bg-primary/70 backdrop-blur text-[10px] font-medium text-gold">Bestseller</div>
        </div>
        <div className="p-6 -mt-10 relative">
          <h3 className="font-display text-2xl font-semibold mb-2">Notion OS for Creators</h3>
          <p className="text-xs text-text-secondary line-clamp-2 mb-5">Complete 80-page system to organize your content, clients, and finances. Ships instantly as a Notion template.</p>
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-text-tertiary">Price</div>
              <div className="font-display text-3xl font-bold text-gold">$29</div>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="#E2B94B" stroke="#E2B94B" />)}
              <span className="text-[10px] text-text-tertiary ml-1">4.9 · 312</span>
            </div>
          </div>
          <button className="w-full py-3 rounded-xl bg-gold text-bg-primary font-semibold text-sm">
            Buy now →
          </button>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="absolute -bottom-4 -left-8 rotate-[-6deg] px-3 py-2 rounded-xl bg-green-dim border border-green/20 text-xs font-medium text-green backdrop-blur shadow-lg"
      >
        +$29 sale just now
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="absolute -top-4 -right-4 rotate-[4deg] px-3 py-2 rounded-xl bg-bg-elevated border border-border-strong text-xs font-medium flex items-center gap-1.5 backdrop-blur shadow-lg"
      >
        <Bitcoin size={12} className="text-gold" />Paid in USDT
      </motion.div>
    </motion.div>
  );
}

/* ----------------------------- Trust bar ----------------------------- */

function Trust() {
  const stats = [
    { v: '$1.2M+', l: 'creator earnings' },
    { v: '8,400+', l: 'products launched' },
    { v: '95%', l: 'goes to creators' },
    { v: '< 5 min', l: 'avg setup time' },
  ];
  return (
    <section className="border-y border-border/50 bg-bg-card/30">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s) => (
          <div key={s.l} className="text-center">
            <div className="font-display text-3xl font-semibold text-gold mb-1">{s.v}</div>
            <div className="text-xs text-text-tertiary uppercase tracking-wider">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ Features ------------------------------ */

function Features() {
  const items = [
    {
      icon: Palette,
      title: 'Beautiful pages out of the box',
      body: 'Pick a theme, drop a cover. Your product page looks like a designer launched it — no templates that scream "marketplace".',
    },
    {
      icon: CreditCard,
      title: 'Card + Crypto checkout',
      body: 'Accept cards via Stripe and crypto (USDT-TRC20, ERC20, BTC, ETH) via NOWPayments. Buyers pick how they pay.',
    },
    {
      icon: Bitcoin,
      title: 'Instant crypto payouts',
      body: 'Withdraw earnings to your bank account or crypto wallet on-chain. No gatekeepers, no 30-day holds.',
    },
    {
      icon: Shield,
      title: 'Signed, expiring download links',
      body: 'Buyer gets a personal link — not your raw file. Files are protected and tracked per-purchase.',
    },
    {
      icon: BarChart3,
      title: 'Analytics that actually help',
      body: 'See conversion, revenue-per-view, price elasticity. We tell you exactly which product to raise prices on.',
    },
    {
      icon: Zap,
      title: 'One link, anywhere',
      body: 'Share a `plutus.app/product/...` link in X, Telegram, YouTube bio. It converts on any device.',
    },
  ];

  return (
    <section id="features" className="relative py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs uppercase tracking-widest text-gold mb-3">Everything you need</div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-4">
            Sell smart, not hard
          </h2>
          <p className="text-text-secondary">
            Plutus is the platform Gumroad should have been in 2026 — creator-first, lower fees, modern payments.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-2xl bg-bg-card border border-border hover:border-gold/20 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-gold-dim border border-gold/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <it.icon size={16} className="text-gold" />
              </div>
              <h3 className="font-semibold text-base mb-2">{it.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{it.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- How it works ---------------------------- */

function HowItWorks() {
  const steps = [
    {
      n: '01',
      icon: FileDown,
      title: 'Upload your product',
      body: 'Drop a file, paste a Notion/Figma link, or write text delivery. Set a price. Pick a theme.',
    },
    {
      n: '02',
      icon: Link2,
      title: 'Get a shareable link',
      body: 'We generate a beautiful product page at plutus.app/your-slug. Share it anywhere — Twitter, Telegram, TikTok bio.',
    },
    {
      n: '03',
      icon: Bitcoin,
      title: 'Get paid, instantly',
      body: 'Buyers pay by card or crypto. You withdraw to your bank or wallet. Keep 95% — we take a flat 5% fee.',
    },
  ];

  return (
    <section id="how" className="relative py-28 bg-bg-card/30 border-y border-border/60">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs uppercase tracking-widest text-gold mb-3">How it works</div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-4">
            Zero to first sale in three steps
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 relative">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              <div className="p-6 rounded-2xl bg-bg-elevated border border-border h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gold-dim border border-gold/15 flex items-center justify-center">
                    <s.icon size={18} className="text-gold" />
                  </div>
                  <span className="font-display text-3xl font-semibold text-text-tertiary/30">{s.n}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{s.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- Comparison ---------------------------- */

function Comparison() {
  const rows = [
    { label: 'Platform fee', plutus: `${FEE}%`, gumroad: `${GUMROAD_FEE}%`, etsy: `${ETSY_FEE}%+ listing`, diy: '0% (but time)' },
    { label: 'Crypto payouts', plutus: true, gumroad: false, etsy: false, diy: 'Manual setup' },
    { label: 'Crypto checkout', plutus: true, gumroad: false, etsy: false, diy: 'Manual setup' },
    { label: 'Hosted product page', plutus: true, gumroad: true, etsy: true, diy: 'Build it yourself' },
    { label: 'Custom theme', plutus: true, gumroad: 'Limited', etsy: false, diy: 'Infinite / infinite hours' },
    { label: 'Monthly subscription', plutus: '$0', gumroad: '$0', etsy: '$15+', diy: 'Hosting + SSL' },
    { label: 'Setup time', plutus: '5 min', gumroad: '15 min', etsy: '30 min', diy: 'Days' },
  ];

  const Col = ({ title, highlight }) => (
    <th className={`text-left text-sm font-semibold pb-4 ${highlight ? 'text-gold' : 'text-text-secondary'}`}>{title}</th>
  );

  const Cell = ({ v, highlight }) => (
    <td className={`py-3 text-sm ${highlight ? 'text-gold font-medium' : 'text-text-secondary'}`}>
      {v === true ? <Check size={14} className={highlight ? 'text-gold' : 'text-green'} /> :
       v === false ? <X size={14} className="text-text-tertiary" /> :
       v}
    </td>
  );

  return (
    <section className="py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs uppercase tracking-widest text-gold mb-3">Why Plutus</div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-4">
            Built for 2026 creators
          </h2>
          <p className="text-text-secondary">Where other platforms fall behind on fees, payouts, and crypto — Plutus is just better.</p>
        </div>
        <div className="rounded-2xl bg-bg-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px]">
              <thead className="bg-bg-elevated border-b border-border">
                <tr>
                  <th className="text-left px-5 pt-4 pb-4 text-xs uppercase tracking-wider text-text-tertiary font-medium">Feature</th>
                  <Col title="Plutus" highlight />
                  <Col title="Gumroad" />
                  <Col title="Etsy" />
                  <Col title="Your own site" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) => (
                  <tr key={r.label}>
                    <td className="px-5 py-3 text-sm text-text-primary font-medium">{r.label}</td>
                    <Cell v={r.plutus} highlight />
                    <Cell v={r.gumroad} />
                    <Cell v={r.etsy} />
                    <Cell v={r.diy} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Pricing ------------------------------ */

function Pricing() {
  const items = [
    'Unlimited products and buyers',
    'Card + Crypto checkout (USDT, USDC, BTC, ETH)',
    'Bank payouts (Stripe Connect) + crypto payouts',
    'Signed, expiring download links',
    'Analytics, price tips, revenue-per-view',
    'Custom domains — coming soon',
    'Email notifications (receipts + sale alerts)',
  ];
  return (
    <section id="pricing" className="relative py-28 bg-bg-card/30 border-y border-border/60">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-widest text-gold mb-3">Pricing</div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-4">
            One number. No tiers.
          </h2>
          <p className="text-text-secondary">Free to start. You pay {FEE}% only on actual sales. No monthly, no surprises.</p>
        </div>

        <div className="max-w-xl mx-auto relative">
          <div className="absolute -inset-2 bg-gold/15 blur-2xl opacity-60 pointer-events-none" />
          <div className="relative p-10 rounded-3xl bg-bg-card border border-gold/20">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-display text-6xl font-semibold text-gold">{FEE}%</span>
              <span className="text-text-secondary">per sale</span>
            </div>
            <div className="text-sm text-text-tertiary mb-6">+ standard Stripe / NOWPayments network fees · No monthly · No setup</div>
            <div className="h-px bg-border mb-6" />
            <ul className="space-y-3 mb-8">
              {items.map((it) => (
                <li key={it} className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                    <Check size={11} className="text-gold" strokeWidth={3} />
                  </div>
                  <span className="text-text-primary">{it}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/signup"
              onClick={() => trackEvent('hero_cta_click', { cta_location: 'pricing' })}
              className="block w-full py-3.5 rounded-xl bg-gold text-bg-primary font-semibold text-sm text-center hover:brightness-110 transition-all no-underline"
            >
              Start selling for free
            </Link>
            <div className="mt-4 text-center text-xs text-text-tertiary">Takes less than 5 minutes · No credit card required</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- Testimonials ---------------------------- */

function Testimonials() {
  const quotes = [
    {
      name: 'Maya Orlov',
      role: 'Notion creator · 24k on X',
      body: 'I moved from Gumroad to Plutus and the extra 5% per sale paid for my entire content setup. Pages look so much nicer, too.',
    },
    {
      name: 'Kai Ito',
      role: 'Indie developer · building $3k MRR',
      body: 'Being able to accept USDT was the unlock — half my buyers are outside US/EU. Payouts to my wallet in 10 minutes.',
    },
    {
      name: 'Lena Dumas',
      role: 'eBook author · 6 titles',
      body: "Plutus has this specific aesthetic I've been trying to DIY for years. It just looks premium. Conversion jumped ~18%.",
    },
  ];
  return (
    <section className="py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs uppercase tracking-widest text-gold mb-3">Creators on Plutus</div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold leading-tight">
            People selling today
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {quotes.map((q, i) => (
            <motion.div
              key={q.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-2xl bg-bg-card border border-border"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, j) => <Star key={j} size={13} fill="#E2B94B" stroke="#E2B94B" />)}
              </div>
              <p className="text-sm text-text-secondary leading-relaxed mb-5 italic">“{q.body}”</p>
              <div>
                <div className="text-sm font-semibold">{q.name}</div>
                <div className="text-xs text-text-tertiary">{q.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- FAQ -------------------------------- */

function FAQ() {
  const faqs = [
    {
      q: 'What can I sell on Plutus?',
      a: 'Digital products: eBooks, Notion templates, Figma files, video courses, cheat sheets, prompt packs, music samples, anything you can deliver via a file, a link, or text. Physical goods are not supported.',
    },
    {
      q: 'How fast can I launch?',
      a: 'The average creator uploads their first product, connects a payout method, and has a shareable link in under 10 minutes.',
    },
    {
      q: 'How much does Plutus cost?',
      a: `${FEE}% per sale. No monthly, no setup, no listing fees. Your first product is free to launch. You also pay standard Stripe (2.9% + $0.30) or NOWPayments (~0.5%) network fees — same as on any platform.`,
    },
    {
      q: 'How do payouts work?',
      a: 'Two options. (1) Bank payouts via Stripe Connect — we route funds directly to your account, arrives in 1–2 business days. (2) Crypto payouts via NOWPayments — withdraw to USDT-TRC20/ERC20/BSC, BTC, ETH, or USDC. Arrives in 5–30 minutes on-chain.',
    },
    {
      q: 'Do I need a website?',
      a: 'No. Every product gets a hosted page at plutus.app/product/your-slug. Share that link anywhere — X, Telegram, email, YouTube description. It works on any device.',
    },
    {
      q: 'Can buyers pay in crypto?',
      a: 'Yes. Every product page shows both a card-checkout button (Stripe) and a crypto-checkout button (NOWPayments). Buyers pick how they pay. You always get settled in USD on your side.',
    },
    {
      q: 'Is my file protected?',
      a: 'Yes. Files are stored server-side and delivered via signed, time-limited download links. Each buyer gets a unique token — no public URL to your raw file.',
    },
    {
      q: 'Can I migrate from Gumroad?',
      a: 'Yes — we recommend recreating your products on Plutus and redirecting your audience via a single tweet / email. The first sale usually covers the migration effort 10x.',
    },
  ];
  return (
    <section id="faq" className="py-28 border-t border-border/60">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="text-xs uppercase tracking-widest text-gold mb-3">FAQ</div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold leading-tight">Good questions</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl bg-bg-card border border-border overflow-hidden">
              <summary className="px-5 py-4 cursor-pointer list-none flex items-center justify-between text-sm font-medium hover:bg-bg-elevated/50 transition-colors">
                <span>{f.q}</span>
                <span className="w-6 h-6 rounded-full bg-bg-elevated flex items-center justify-center text-text-tertiary group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <div className="px-5 pb-5 pt-1 text-sm text-text-secondary leading-relaxed">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Final CTA ----------------------------- */

function FinalCTA() {
  return (
    <section className="relative py-28">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-gold/15 blur-[160px]" />
      </div>
      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-display text-5xl md:text-6xl font-semibold leading-[1.05] mb-6">
          Your next sale is <span className="gold-shimmer italic">one link away.</span>
        </h2>
        <p className="text-lg text-text-secondary mb-8 max-w-xl mx-auto">
          Stop losing 10% to Gumroad. Stop building payment infrastructure you'll maintain forever. Just launch.
        </p>
        <Link
          to="/signup"
          onClick={() => trackEvent('hero_cta_click', { cta_location: 'final' })}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gold text-bg-primary font-semibold text-base hover:brightness-110 transition-all no-underline"
        >
          Start selling free
          <ArrowRight size={16} />
        </Link>
        <div className="mt-5 text-xs text-text-tertiary">First 100 creators get 0% fees for 3 months.</div>
      </div>
    </section>
  );
}

/* ------------------------------- Footer ------------------------------- */

function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-tertiary">
        <div className="flex items-center gap-2 text-gold">
          <Sparkles size={14} />
          <span className="font-display text-base font-semibold">Plutus</span>
          <span className="text-text-tertiary ml-2">© 2026</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="hover:text-text-primary transition-colors">Features</a>
          <a href="#pricing" className="hover:text-text-primary transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-text-primary transition-colors">FAQ</a>
          <Link to="/login" className="hover:text-text-primary transition-colors no-underline">Log in</Link>
        </div>
      </div>
    </footer>
  );
}
