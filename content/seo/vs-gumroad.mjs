export default {
  slug: 'gumroad',
  dir: 'vs',
  lang: 'en',
  title: 'Plutus vs Gumroad — fees, crypto, payouts compared (2026)',
  metaTitle: 'Plutus vs Gumroad: 5% fee, crypto checkout, instant payouts',
  description:
    'Plutus vs Gumroad compared: platform fees, crypto support, payout speed, page quality, migration. See which is the better digital product platform in 2026.',
  keywords: [
    'plutus vs gumroad',
    'gumroad alternative',
    'gumroad competitor',
    'gumroad fees',
    'sell digital products',
    'gumroad crypto',
  ],
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Compare', url: '/vs' },
    { name: 'vs Gumroad', url: '/vs/gumroad' },
  ],
  hero: {
    eyebrow: 'Comparison · 2026',
    h1: 'Plutus vs Gumroad',
    lede:
      'Gumroad pioneered creator commerce. Plutus is the 2026 answer: half the fees, native crypto, instant payouts, and pages that look premium out of the box.',
    ctas: [
      { label: 'Start free on Plutus', href: '/signup', primary: true },
      { label: 'See the full comparison', href: '#compare' },
    ],
    proof: ['5% vs 10% fee', 'Crypto in + crypto out', 'Instant payouts'],
  },
  sections: [
    {
      type: 'text',
      eyebrow: 'TL;DR',
      h2: 'The short version',
      paragraphs: [
        '<strong>Plutus wins on fees (5% vs 10%), crypto (native vs none), and payout speed (minutes vs up to 7 days).</strong> Gumroad still wins on brand recognition and on discovery inside Gumroad\'s own marketplace — which matters less the more you run your own marketing.',
        'If you drive your own traffic (Twitter, Telegram, YouTube, SEO), Plutus is strictly better. If you rely on Gumroad\'s internal discovery to find first buyers, the math shifts — but for most serious creators, self-traffic dominates within six months.',
      ],
    },
    {
      type: 'compare',
      eyebrow: 'Side by side',
      h2: 'Feature comparison',
      leftName: 'Plutus',
      rightName: 'Gumroad',
      rows: [
        { label: 'Platform fee', left: '5% per sale', right: '10% per sale' },
        { label: 'Monthly subscription', left: '$0', right: '$0 (10% fee is the cost)' },
        { label: 'Crypto checkout', left: 'USDT, BTC, ETH, USDC', right: 'Not supported' },
        { label: 'Crypto payouts', left: 'USDT / ETH / BTC on-chain', right: 'Not supported' },
        { label: 'Bank payouts', left: 'Stripe Connect, 1–2 days', right: 'Up to 7-day hold' },
        { label: 'Signed download links', left: 'Yes, per-buyer', right: 'Yes' },
        { label: 'Custom product pages', left: 'Theme + branding', right: 'Template-based' },
        { label: 'Price tips / analytics', left: 'Revenue-per-view, elasticity', right: 'Basic dashboard' },
        { label: 'Setup time', left: '~5 min', right: '~15 min' },
        { label: 'Marketplace discovery', left: 'Driven by your own traffic', right: 'Internal Gumroad Discover' },
      ],
    },
    {
      type: 'text',
      eyebrow: 'Fees',
      h2: 'The 5% that adds up',
      paragraphs: [
        'On Gumroad\'s flat 10%, a creator doing $5,000/mo pays $500 every month. On Plutus at 5%, the same creator pays $250 — saving $3,000/year.',
        'At $20,000/mo that gap is $12,000/year. This is the number that pushes creators to switch once their volume reaches a few thousand dollars per month — the platform fee becomes one of their largest line items.',
        'Both platforms also pass through standard Stripe processing (~2.9% + $0.30). Plutus\' crypto rail via NOWPayments settles at roughly 0.5% network fee, which is attractive for high-ticket products.',
      ],
    },
    {
      type: 'text',
      eyebrow: 'Payments',
      h2: 'The crypto question',
      paragraphs: [
        'Gumroad has no native crypto rail. If your audience is international — especially in Eastern Europe, Southeast Asia, LATAM, or MENA — a chunk of would-be buyers drop off at the card step. Not because they can\'t pay, but because their card gets declined by fraud filters, or the currency isn\'t supported, or they simply prefer USDT.',
        'Plutus shows two checkout buttons: Stripe card and NOWPayments crypto. Buyers self-select. Creators report conversion bumps anywhere from 8% to 20% after enabling the crypto option.',
        'On the payout side, Gumroad wires to your bank via Stripe and can hold up to 7 days on new accounts. Plutus offers crypto payouts that land in your wallet in 5–30 minutes — no hold, no weekend delay.',
      ],
    },
    {
      type: 'text',
      eyebrow: 'Product pages',
      h2: 'Page quality — what buyers see',
      paragraphs: [
        'Gumroad product pages are functional but visibly "marketplace-y" — they look the same across every seller. This is a conversion tax creators absorb without thinking.',
        'Plutus ships a designer-feeling page template with theming, cover images, and clean typography. The page looks like a premium product brand rather than a generic listing.',
        'For a $29 template this may not matter much. For a $149 client portal or a $499 course companion, it\'s the difference between "looks scammy" and "looks like the real thing".',
      ],
    },
    {
      type: 'howto',
      eyebrow: 'Migration',
      h2: 'How to move from Gumroad in one afternoon',
      steps: [
        {
          title: 'Recreate your products on Plutus',
          body:
            'Upload the same file or Notion link, set the same price, use the same cover. 5 minutes per product. If you have more than 10 products, do the top five by revenue first.',
        },
        {
          title: 'Redirect your audience',
          body:
            'One tweet: "Moved my store to Plutus — same products, lower fees, crypto checkout." Update your bio links. Email past buyers with the new URL if you want to offer them an upgrade or addon.',
        },
        {
          title: 'Keep Gumroad as a fallback (briefly)',
          body:
            'For the first month, keep Gumroad listings live and redirect their pages manually. After 30 days, archive them. Most creators see parity with Gumroad volume within the first week.',
        },
      ],
    },
  ],
  faq: [
    {
      q: 'Is Plutus\' 5% really lower than Gumroad\'s 10%?',
      a: 'Yes — flat 5% vs flat 10% per sale. Both charge standard Stripe processing on top. Plutus does not charge listing fees or monthly subscriptions.',
    },
    {
      q: 'Can I move my Gumroad discount codes and email list?',
      a: 'Plutus supports discount codes natively. Email list is yours — export from Gumroad, import into your email tool (ConvertKit, Beehiiv, etc.) and continue sending as before.',
    },
    {
      q: 'Does Plutus have a discovery marketplace like Gumroad?',
      a: 'Not yet — the focus is serving creators who drive their own traffic. For most serious sellers, Gumroad Discover drives a small fraction of overall revenue compared to self-traffic from Twitter, Telegram, YouTube, and email.',
    },
    {
      q: 'What about Gumroad Library — can buyers re-download?',
      a: 'Plutus sends buyers a dedicated delivery page with their unique link. Buyers bookmark it or save the email receipt. For subscription-style access, Plutus is not yet the right fit — Gumroad still has an edge on recurring memberships.',
    },
    {
      q: 'How long does migration take in practice?',
      a: 'One afternoon for 5–10 products. Count on 15 minutes per product for setup and copy-paste of screenshots. Set a price, test the checkout once, ship the tweet. Done.',
    },
  ],
  finalCta: {
    h2: 'Switch to Plutus in one afternoon',
    lede: 'Same products. Half the fees. Crypto checkout and instant payouts. Free to start.',
    label: 'Create my store',
    href: '/signup',
  },
};
