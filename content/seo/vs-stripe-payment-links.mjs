export default {
  slug: 'stripe-payment-links',
  dir: 'vs',
  lang: 'en',
  title: 'Plutus vs Stripe Payment Links — when you need a real platform',
  metaTitle: 'Plutus vs Stripe Payment Links for digital product sellers',
  description:
    'Stripe Payment Links are free but leave you to solve delivery, licensing, analytics, and crypto. Plutus adds exactly that layer for 5% per sale. When each is the right call.',
  keywords: [
    'stripe payment links',
    'stripe alternative',
    'stripe payment links vs',
    'digital product delivery',
    'stripe for digital products',
    'plutus vs stripe',
  ],
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Compare', url: '/vs' },
    { name: 'vs Stripe Payment Links', url: '/vs/stripe-payment-links' },
  ],
  hero: {
    eyebrow: 'Comparison · 2026',
    h1: 'Plutus vs Stripe Payment Links',
    lede:
      'Stripe Payment Links are free and excellent for collecting one-off payments. They are not a product platform. Here is exactly where the line is — and when it makes sense to pay 5% for everything above that line.',
    ctas: [
      { label: 'Start free on Plutus', href: '/signup', primary: true },
      { label: 'Full comparison', href: '#compare' },
    ],
    proof: ['Digital delivery built-in', 'Crypto checkout', 'Analytics'],
  },
  sections: [
    {
      type: 'text',
      eyebrow: 'What Stripe Payment Links give you',
      h2: 'A checkout URL — and that is it',
      paragraphs: [
        'Stripe Payment Links are an elegant primitive: create a link, share it, collect payment. No monthly fee, no platform cut (just Stripe\'s standard processing: 2.9% + $0.30).',
        'For a single-product freelancer, or for collecting deposits on invoices, that is all you need. The challenge begins when your product is a digital file, a course, or anything that requires delivery after payment.',
      ],
    },
    {
      type: 'text',
      eyebrow: 'Where Payment Links end',
      h2: 'What you build yourself when using Stripe alone',
      paragraphs: [
        '<strong>Delivery mechanism.</strong> After payment, you need to send the buyer the file, link, or access. With Payment Links alone, this is a manual email, a webhook + Zapier setup, or custom code.',
        '<strong>Per-buyer license protection.</strong> If you share a public download URL, it leaks within days. You need signed, time-limited URLs per buyer. This is a custom backend.',
        '<strong>Product page.</strong> Payment Links generate a Stripe-hosted page that is functional but bare. For an illustrator or course creator, the buying experience starts before the checkout — your product page matters.',
        '<strong>Analytics.</strong> Stripe shows transactions. It does not show conversion rate, revenue-per-view, or which traffic source converted. You need that to scale.',
        '<strong>Crypto checkout.</strong> Stripe does not accept crypto directly. If you want USDT/BTC buyers, you integrate NOWPayments/Coinbase Commerce yourself.',
        '<strong>Refunds dashboard, receipts, notifications.</strong> Stripe has them for payments; for digital-product-specific flows (re-send download link, extend expiration), you build or skip.',
      ],
    },
    {
      type: 'compare',
      eyebrow: 'Side by side',
      h2: 'What each gives you out of the box',
      leftName: 'Plutus',
      rightName: 'Stripe Payment Links',
      rows: [
        { label: 'Platform fee', left: '5% per sale', right: '$0' },
        { label: 'Processing', left: '2.9% + $0.30 (Stripe)', right: '2.9% + $0.30 (Stripe)' },
        { label: 'Product page', left: 'Branded, themed', right: 'Stripe-hosted, minimal' },
        { label: 'Delivery of digital goods', left: 'Automatic + signed', right: 'You build it' },
        { label: 'Signed download links', left: 'Per-buyer token', right: 'You build it' },
        { label: 'Crypto checkout', left: 'USDT, BTC, ETH', right: 'Not available' },
        { label: 'Analytics', left: 'Conversion, RPV, trends', right: 'Payments only' },
        { label: 'Discount codes', left: 'Native', right: 'Promotion codes (Stripe)' },
        { label: 'Multiple payout methods', left: 'Bank + crypto', right: 'Bank only (Stripe)' },
        { label: 'Best for', left: 'Digital product creators', right: 'Freelancers, deposits, one-offs' },
      ],
    },
    {
      type: 'text',
      eyebrow: 'The trade',
      h2: 'What 5% is actually buying',
      paragraphs: [
        'The 5% Plutus fee is the difference between "DIY Stripe + 5 tools + custom code" and "paste a link, ship product, get paid." For most indie creators, the cost of their time solving delivery, per-buyer licensing, analytics, and crypto checkout far exceeds 5% of revenue.',
        'Do the math: if your course costs $200 and you sell 10 copies, Plutus\' fee is $100. Solving signed delivery and a per-buyer license system in code costs many hours; solving analytics and a better product page, many more. At $10/hour value of your time, Plutus pays for itself on the first sale.',
      ],
    },
    {
      type: 'howto',
      eyebrow: 'Decision',
      h2: 'When each is the right call',
      steps: [
        {
          title: 'Use Stripe Payment Links when',
          body: 'You are a freelancer invoicing for services. You are collecting a one-off deposit. You already have a custom site handling delivery, analytics, and branding.',
        },
        {
          title: 'Use Plutus when',
          body: 'You are selling digital products (templates, courses, PDFs) to multiple buyers. You want per-buyer delivery, analytics, crypto, and a branded page without coding any of it.',
        },
        {
          title: 'Use both when',
          body: 'Offer products on Plutus; use Payment Links for bespoke quotes or service invoicing. Nothing stops you.',
        },
      ],
    },
  ],
  faq: [
    {
      q: 'Do I still use Stripe with Plutus?',
      a: 'Yes — Plutus uses Stripe Connect for card processing. Your Stripe account handles the money; Plutus adds the product-platform layer. Payouts land in the same Stripe-connected bank account.',
    },
    {
      q: 'Can I bring my own Stripe Payment Link into Plutus?',
      a: 'Yes — Plutus supports a "custom payment link" field on each product. If you want Stripe to host the checkout (maybe you have a specific setup), point Plutus at your existing Payment Link.',
    },
    {
      q: 'Is Plutus cheaper than building Stripe + custom code?',
      a: 'Depends on your hourly rate and how many products you sell. For a single product with <50 sales, building yourself is cheaper. For 5+ products with 100+ sales, Plutus usually wins on total cost.',
    },
    {
      q: 'Does Plutus replace Stripe?',
      a: 'No — Plutus runs on Stripe. Think of Plutus as "Stripe Payment Links plus everything you would otherwise build" for digital-product sellers.',
    },
    {
      q: 'What about refunds?',
      a: 'Plutus refunds go through Stripe (or NOWPayments for crypto). One-click from your Wallet dashboard. Full or partial refunds supported.',
    },
  ],
  finalCta: {
    h2: 'Stripe handles money. Plutus handles products.',
    lede: 'Skip building your own digital-product layer. Launch free, pay 5% only on sales.',
    label: 'Start selling free',
    href: '/signup',
  },
};
