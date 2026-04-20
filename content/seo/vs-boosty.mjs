export default {
  slug: 'boosty',
  dir: 'vs',
  lang: 'en',
  title: 'Plutus vs Boosty — comparison, fees, crypto, payouts (2026)',
  metaTitle: 'Plutus vs Boosty: creator fees, crypto, global payouts',
  description:
    'Plutus vs Boosty compared: platform fees, crypto payments, global payouts, product types, and when to pick each. Honest breakdown for creators choosing in 2026.',
  keywords: [
    'plutus vs boosty',
    'boosty alternative',
    'boosty competitor',
    'boosty fees',
    'boosty english alternative',
    'international boosty',
  ],
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Compare', url: '/vs' },
    { name: 'vs Boosty', url: '/vs/boosty' },
  ],
  hero: {
    eyebrow: 'Comparison · 2026',
    h1: 'Plutus vs Boosty',
    lede:
      'Boosty is purpose-built for the RU-speaking creator economy, with strong native features for subscriptions and community. Plutus is a global, crypto-native one-time-purchase platform. Here is when to pick each.',
    ctas: [
      { label: 'Start free on Plutus', href: '/signup', primary: true },
      { label: 'Full comparison', href: '#compare' },
    ],
    proof: ['Global checkout', 'Crypto payouts', '5% flat fee'],
  },
  sections: [
    {
      type: 'text',
      eyebrow: 'Choose by audience',
      h2: 'When to pick Boosty vs Plutus',
      paragraphs: [
        '<strong>Pick Boosty if:</strong> your audience is RU-first, you sell recurring subscriptions or membership levels, and you need tight local payment integration (ruble cards, SBP, local wallets).',
        '<strong>Pick Plutus if:</strong> your audience is global or mixed, you sell one-time digital products (templates, courses, PDFs, guides), and you want crypto payment rails for reach or lower fees.',
        'Many creators use both — Boosty for their RU-audience subscription tier, Plutus for one-time international product sales. The tools complement rather than compete head-on.',
      ],
    },
    {
      type: 'compare',
      eyebrow: 'Side by side',
      h2: 'Feature comparison',
      leftName: 'Plutus',
      rightName: 'Boosty',
      rows: [
        { label: 'Platform fee', left: '5% per sale', right: '~8–20% (varies by plan)' },
        { label: 'Product model', left: 'One-time digital goods', right: 'Subscriptions + one-time' },
        { label: 'Crypto checkout', left: 'USDT, BTC, ETH, USDC', right: 'Not supported' },
        { label: 'Crypto payouts', left: 'On-chain, 5–30 min', right: 'Not supported' },
        { label: 'Global card checkout', left: 'Stripe 30+ currencies', right: 'Mostly RUB-first' },
        { label: 'Language', left: 'English', right: 'Russian-first' },
        { label: 'Subscriptions', left: 'Not yet', right: 'Strong: tier-based' },
        { label: 'Community / private posts', left: 'Not native', right: 'Native, core feature' },
        { label: 'Signed download links', left: 'Per-buyer, time-limited', right: 'Standard' },
        { label: 'Custom branded pages', left: 'Themed per product', right: 'Channel-wide branding' },
      ],
    },
    {
      type: 'text',
      eyebrow: 'Fees in practice',
      h2: 'The real fee on a $29 product',
      paragraphs: [
        'Boosty\'s headline percentage varies by plan and product type. Effective take on a RUB 2,500 / $29 product after platform + processing is commonly 12–18%.',
        'Plutus is 5% flat + standard Stripe (~2.9% + $0.30) or NOWPayments (~0.5%) processing. Effective take: ~8% on card, ~5.5% on crypto.',
        'At $10,000/month in sales, the fee gap between platforms is ~$400–$800/month. Worth considering if your volume is there.',
      ],
    },
    {
      type: 'text',
      eyebrow: 'Payouts',
      h2: 'Where the money lands',
      paragraphs: [
        'Boosty payouts arrive in Russian bank accounts via local rails. Reliable for RU creators, but adds friction for creators outside Russia or those who prefer USD/stablecoin settlement.',
        'Plutus payouts: Stripe Connect to any bank in 40+ countries (1–2 business days), or crypto to USDT/BTC/ETH wallets (5–30 minutes on-chain). No geo-restrictions, no weekend hold.',
      ],
    },
    {
      type: 'howto',
      eyebrow: 'Using both',
      h2: 'Running Plutus and Boosty side-by-side',
      steps: [
        {
          title: 'Keep Boosty for recurring tiers',
          body: 'Your $5/month, $15/month, $50/month subscription tiers with private posts and comments — Boosty is built for this.',
        },
        {
          title: 'Add Plutus for one-time products',
          body: 'PDFs, templates, courses, video guides — list them on Plutus and share the link with both your RU and international audience.',
        },
        {
          title: 'Cross-link in pinned posts',
          body: '"Monthly access → Boosty. One-off products → Plutus." Clear separation, two revenue streams, no overlap confusion.',
        },
      ],
    },
  ],
  faq: [
    {
      q: 'Can I migrate my Boosty products to Plutus?',
      a: 'For one-time products, yes — upload the same deliverable on Plutus, set the same price. For subscription posts, there is no direct migration (different product model). Export your buyer list from Boosty and email them a launch note for your new Plutus products.',
    },
    {
      q: 'Is Plutus available in Russia?',
      a: 'The platform itself is global. Creators in Russia can use crypto payouts (USDT/BTC) to receive funds without needing a foreign bank. Stripe Connect is available in 40+ countries for creators with qualifying entities.',
    },
    {
      q: 'Does Plutus support Russian-language product pages?',
      a: 'Yes — product titles, descriptions, and content are stored as-is in any language. The platform UI is English-first as of 2026. Buyers see your content in the language you wrote it.',
    },
    {
      q: 'What about paid Telegram channels?',
      a: 'Boosty has native private-posts. For Plutus, sell access as a one-time "Text" product with the Telegram invite link as the delivery. Works for one-off access sales but not recurring subscriptions.',
    },
    {
      q: 'Which has lower fees for free-tier users?',
      a: 'Plutus: always 5% + Stripe processing. Boosty: varies by plan; the free tier is typically the highest effective rate. At scale, Plutus is cheaper in most scenarios.',
    },
  ],
  finalCta: {
    h2: 'One-time digital products? Plutus is 5%, global, crypto-ready.',
    lede: 'For subscriptions, Boosty remains strong. For everything you sell once, try Plutus free.',
    label: 'Create my Plutus store',
    href: '/signup',
  },
};
