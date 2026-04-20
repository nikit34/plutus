export default {
  slug: 'etsy-digital',
  dir: 'vs',
  lang: 'en',
  title: 'Plutus vs Etsy for digital products — the real cost (2026)',
  metaTitle: 'Plutus vs Etsy Digital: fees, discovery, payouts compared',
  description:
    'Selling digital products on Etsy vs Plutus: real effective fees including listing + ad bids, discovery trade-offs, payout speed, and when to leave Etsy.',
  keywords: [
    'etsy digital products',
    'etsy alternative digital',
    'etsy vs plutus',
    'sell digital products etsy',
    'etsy fees digital',
    'leaving etsy',
  ],
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Compare', url: '/vs' },
    { name: 'vs Etsy digital', url: '/vs/etsy-digital' },
  ],
  hero: {
    eyebrow: 'Comparison · 2026',
    h1: 'Plutus vs Etsy (for digital products)',
    lede:
      'Etsy is a great discovery channel if you are new. It is an expensive sales channel if you have traffic. The breakeven point — when leaving Etsy for Plutus starts paying off — is more specific than it looks.',
    ctas: [
      { label: 'Start free on Plutus', href: '/signup', primary: true },
      { label: 'Full comparison', href: '#compare' },
    ],
    proof: ['No listing fees', 'No ad-bid pressure', '5% flat fee'],
  },
  sections: [
    {
      type: 'text',
      eyebrow: 'The real Etsy cost',
      h2: 'Etsy\'s 6.5% is closer to 15–20%',
      paragraphs: [
        'Etsy\'s headline transaction fee is 6.5%. Easy to quote. But the effective cost to sellers is materially higher once you add: $0.20 per listing (every 4 months), payment processing (~3% + $0.25), the near-mandatory offsite-ads bid (which takes 12–15% if a sale comes from an Etsy ad), and the currency conversion fees on international sales.',
        'Most Etsy sellers doing $1,000+/month calculate their effective take rate at 15–20%. That is 3–4x Plutus\' 5% flat fee.',
      ],
    },
    {
      type: 'text',
      eyebrow: 'The catch',
      h2: 'But Etsy sends you traffic',
      paragraphs: [
        'Etsy\'s trump card is discovery. Their SEO pulls buyers searching for "printable wedding invitations" or "Notion wedding planner" directly onto your shop. That traffic is real and, for new sellers, probably worth the fee premium.',
        'The question is: <strong>how much of your revenue actually comes from Etsy Discover vs your own traffic?</strong> If >70% is Etsy-driven, staying makes sense. If <30% is Etsy-driven (most of your sales come from Instagram, Pinterest, Twitter, or your own email list) — Etsy is taxing you for traffic you brought yourself.',
      ],
    },
    {
      type: 'compare',
      eyebrow: 'Side by side',
      h2: 'Feature comparison',
      leftName: 'Plutus',
      rightName: 'Etsy (digital)',
      rows: [
        { label: 'Platform fee', left: '5% per sale', right: '6.5% + listing + ads bid' },
        { label: 'Effective take', left: '~8% after Stripe', right: '~15–20% typical' },
        { label: 'Listing fees', left: '$0', right: '$0.20 per listing × renewal' },
        { label: 'Offsite Ads bid', left: 'N/A', right: '12–15% if ad-attributed' },
        { label: 'Crypto checkout', left: 'USDT, BTC, ETH, USDC', right: 'Not supported' },
        { label: 'Crypto payouts', left: 'On-chain', right: 'Not supported' },
        { label: 'Discovery traffic', left: 'You drive it', right: 'Etsy SEO sends some' },
        { label: 'Custom branded page', left: 'Per-product theme', right: 'Shop template only' },
        { label: 'Payout speed', left: '1–2 days / instant crypto', right: 'Up to 7-day hold' },
        { label: 'Buyer data access', left: 'Email captured', right: 'Etsy restricts email' },
      ],
    },
    {
      type: 'text',
      eyebrow: 'Migration',
      h2: 'When to leave Etsy for Plutus',
      paragraphs: [
        'Rule of thumb: when Etsy\'s discovery contribution drops below your total fees. Check your sales sources in Etsy Stats: what percentage came from Etsy search vs direct / social / external?',
        'If 40%+ comes from your own traffic sources, you are paying Etsy 15–20% to handle checkout for sales you drove yourself. Moving that portion to Plutus saves ~10% of revenue immediately — usually thousands of dollars per year for established sellers.',
        'You do not have to fully leave. Run Plutus as your primary store for your owned audience, keep Etsy listings for the discovery upside. The choice becomes "which link do I share in my bio?" — and once that link is your Plutus page, the math takes care of itself.',
      ],
    },
    {
      type: 'howto',
      eyebrow: 'Migration',
      h2: 'Three-step migration from Etsy',
      steps: [
        {
          title: 'Clone your best-sellers to Plutus',
          body: 'Top five products by revenue. Same title, same description, same cover image. 15 minutes per product.',
        },
        {
          title: 'Redirect your bio links',
          body: 'Instagram, Twitter, Pinterest bio — point to your Plutus page. Etsy keeps handling its own discovery traffic.',
        },
        {
          title: 'Email your buyer list',
          body: 'Etsy restricts buyer email access; use what you have (past buyers you communicated with, newsletter subscribers) to announce the new storefront.',
        },
      ],
    },
  ],
  faq: [
    {
      q: 'Will I lose Etsy discovery completely if I leave?',
      a: 'Only if you delete your listings. Most creators keep Etsy listings active as a lower-conversion discovery channel while making Plutus the primary sales URL in all owned channels.',
    },
    {
      q: 'How do I handle Etsy\'s buyer reviews?',
      a: 'Reviews stay on Etsy. For Plutus, request testimonials from past Etsy buyers directly — most creators find that 1 in 5 past buyers will send a quote when asked.',
    },
    {
      q: 'What if my customer base is mostly non-tech?',
      a: 'Plutus checkout is simpler than Etsy\'s (fewer screens, no marketplace signup). Non-tech buyers generally convert *better* on Plutus than on Etsy because there is less friction.',
    },
    {
      q: 'Does Plutus collect sales tax?',
      a: 'Stripe handles tax where applicable. For US sellers crossing state nexus thresholds, review your obligations. Most small digital-product sellers are covered by Stripe defaults.',
    },
    {
      q: 'Can I continue Etsy Offsite Ads while on Plutus?',
      a: 'Yes — your Etsy listings are independent of Plutus. Run Offsite Ads for Etsy-discovered customers; drive your social traffic to Plutus.',
    },
  ],
  finalCta: {
    h2: 'Keep the traffic you bring. Pay Etsy only for the traffic Etsy brings.',
    lede: 'Launch your Plutus store today. 5% fee, no listing cost, instant payouts.',
    label: 'Create my store',
    href: '/signup',
  },
};
