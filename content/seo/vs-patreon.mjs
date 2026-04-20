export default {
  slug: 'patreon',
  dir: 'vs',
  lang: 'en',
  title: 'Plutus vs Patreon — one-time vs membership creator economics',
  metaTitle: 'Plutus vs Patreon: when each wins for creators (2026)',
  description:
    'Plutus vs Patreon compared: fees, product types, crypto, payouts. Honest breakdown of when to pick subscription (Patreon) vs one-time digital products (Plutus).',
  keywords: [
    'plutus vs patreon',
    'patreon alternative',
    'patreon fees',
    'patreon competitor',
    'one-time vs subscription creator',
    'patreon without membership',
  ],
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Compare', url: '/vs' },
    { name: 'vs Patreon', url: '/vs/patreon' },
  ],
  hero: {
    eyebrow: 'Comparison · 2026',
    h1: 'Plutus vs Patreon',
    lede:
      'Patreon is built for recurring patronage. Plutus is built for one-time digital product sales. Different models, different economics — here is when each wins for you.',
    ctas: [
      { label: 'Start free on Plutus', href: '/signup', primary: true },
      { label: 'Full comparison', href: '#compare' },
    ],
    proof: ['One-time products', 'Crypto checkout', '5% flat fee'],
  },
  sections: [
    {
      type: 'text',
      eyebrow: 'Different tools',
      h2: 'These do not compete head-on',
      paragraphs: [
        'Patreon is a patronage platform. Supporters pay monthly, you post behind paywalls, they get tiers of access. Great for building steady recurring income if you post consistently.',
        'Plutus is a one-time product platform. Buyers purchase a specific thing (PDF, course, template, guide) at a specific price. Great for packaging your expertise into discrete products that sell independently of your posting schedule.',
        'Many creators run both: Patreon for their superfan monthly tier, Plutus for courses and templates that sell to a wider audience.',
      ],
    },
    {
      type: 'compare',
      eyebrow: 'Side by side',
      h2: 'Feature comparison',
      leftName: 'Plutus',
      rightName: 'Patreon',
      rows: [
        { label: 'Platform fee', left: '5% per sale', right: '8–12% of pledges' },
        { label: 'Model', left: 'One-time purchase', right: 'Monthly subscription' },
        { label: 'Payment processing', left: '2.9% + $0.30 (Stripe)', right: '+2.9% + $0.30 (Patreon)' },
        { label: 'Crypto checkout', left: 'USDT, BTC, ETH, USDC', right: 'Not supported' },
        { label: 'Crypto payouts', left: 'On-chain', right: 'Not supported' },
        { label: 'Payout delay', left: '1–2 days (bank), minutes (crypto)', right: 'Net-15+ typically' },
        { label: 'Signed delivery', left: 'Per-buyer time-limited', right: 'Tier-gated access' },
        { label: 'Cohort / community', left: 'Via delivery link (Circle, Telegram)', right: 'Native feed + DMs' },
        { label: 'Custom branded page', left: 'Per-product theme', right: 'Single creator page' },
        { label: 'Discovery', left: 'Driven by your traffic', right: 'Some internal discovery' },
      ],
    },
    {
      type: 'text',
      eyebrow: 'Revenue model',
      h2: 'Subscription vs one-time math',
      paragraphs: [
        'Patreon: $5/month × 200 patrons = $1,000/month recurring. Net of Patreon + processing fees: ~$820/month. Steady and predictable. Easier to forecast.',
        'Plutus: $29 course × 50 buyers/month = $1,450/month. Net: ~$1,335. Higher gross but lumpier — depends on audience size and launch cadence.',
        'The best creators do both: steady subscription base smoothing the income curve, product launches spiking revenue during campaign weeks. Patreon + Plutus covers both halves.',
      ],
    },
    {
      type: 'text',
      eyebrow: 'Fees in detail',
      h2: 'The total take on Patreon',
      paragraphs: [
        'Patreon\'s platform cut depends on plan: Lite (8%), Pro (10%), Premium (12%). On top, you pay payment processing (~2.9% + $0.30) and currency conversion fees for international patrons.',
        'Effective take on a $5 pledge after all fees: typically 15–20%, landing ~$4 in your account before your own taxes.',
        'Plutus\' flat 5% + Stripe standard means a $29 product nets ~$26 reliably, regardless of plan tier or country. Simpler, cheaper above $2,000/month in revenue.',
      ],
    },
    {
      type: 'howto',
      eyebrow: 'Playbook',
      h2: 'How creators combine both',
      steps: [
        {
          title: 'Build your audience one place',
          body: 'Your newsletter, YouTube, or Twitter is where discovery happens. Neither Plutus nor Patreon will do this for you.',
        },
        {
          title: 'Patreon for the monthly tier',
          body: 'Exclusive posts, behind-the-scenes, community. $5/month supporters who want to be close.',
        },
        {
          title: 'Plutus for products',
          body: 'Every 2–3 months, launch a one-time product. Course, book, template. Sell to the whole audience, not just Patrons.',
        },
        {
          title: 'Cross-promote',
          body: 'Patreon posts promote your Plutus launches. Plutus buyers get a "join my Patreon" card in the delivery. Funnel flows both ways.',
        },
      ],
    },
  ],
  faq: [
    {
      q: 'Can I migrate my Patreon to Plutus?',
      a: 'Not directly — they are different product models. What you can do: turn your Patreon content archives into a one-time "Greatest Hits" product on Plutus, sell to your broader audience (not just patrons), and keep Patreon for the ongoing monthly tier.',
    },
    {
      q: 'Does Plutus support recurring subscriptions?',
      a: 'Not as a first-class feature today. For recurring memberships, Patreon or Circle remain stronger. Plutus focuses on the one-time-purchase side of creator economics.',
    },
    {
      q: 'Can Patreon patrons get a Plutus product discount?',
      a: 'Yes — generate a discount code in Plutus and share it as a patron-only post on Patreon. Many creators use this to reward patrons with 30–50% off launches.',
    },
    {
      q: 'Is Plutus cheaper than Patreon for the creator?',
      a: 'Per-transaction, yes (5% vs 8–12%). But the comparison is apples-to-oranges because the product types differ. For the same dollar of revenue, Plutus keeps more — but the revenue patterns are different.',
    },
    {
      q: 'Which has better payout speed?',
      a: 'Plutus: 1–2 business days (bank) or 5–30 minutes (crypto). Patreon: monthly cycle with net-15+ typical. Plutus wins meaningfully on time-to-cash.',
    },
  ],
  finalCta: {
    h2: 'Patreon for monthly. Plutus for products.',
    lede: 'Launch your next one-time product on Plutus. 5% fee, instant payouts, free to start.',
    label: 'Start selling free',
    href: '/signup',
  },
};
