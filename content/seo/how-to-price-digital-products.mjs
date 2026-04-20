export default {
  slug: 'how-to-price-digital-products',
  dir: 'blog',
  lang: 'en',
  title: 'How to price digital products — a pricing playbook for creators',
  metaTitle: 'How to Price Digital Products (2026 creator playbook)',
  description:
    'A practical, data-informed guide to pricing digital products: tiers, anchoring, revenue-per-view math, and when to raise. For indie creators selling templates, courses, PDFs.',
  keywords: [
    'how to price digital products',
    'digital product pricing',
    'pricing psychology',
    'creator pricing strategy',
    'price a pdf',
    'price a course',
  ],
  ogType: 'article',
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: 'How to price digital products', url: '/blog/how-to-price-digital-products' },
  ],
  schemas: [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'How to price digital products in 2026',
      author: { '@type': 'Organization', name: 'Plutus' },
      publisher: { '@type': 'Organization', name: 'Plutus', logo: { '@type': 'ImageObject', url: 'https://plutus.firstmessage.ru/favicon.svg' } },
      datePublished: '2026-04-20',
      dateModified: '2026-04-20',
      mainEntityOfPage: 'https://plutus.firstmessage.ru/blog/how-to-price-digital-products',
    },
  ],
  hero: {
    eyebrow: 'Guide · 2026',
    h1: 'How to price digital products (without guessing)',
    lede:
      'Most creators under-price by 30–50%. A working framework for setting prices, testing anchors, and knowing exactly when to raise. Based on conversion-rate math, not vibes.',
    ctas: [
      { label: 'Start selling free', href: '/signup', primary: true },
      { label: 'Jump to anchoring', href: '#anchor' },
    ],
  },
  sections: [
    {
      type: 'text',
      eyebrow: 'Mental model',
      h2: 'Price the outcome, not the asset',
      paragraphs: [
        'Creators tend to price based on effort ("I spent 40 hours on this") or size ("60 pages feels like $29"). Buyers price based on <strong>outcome</strong>: what saving or earning does this unlock?',
        'A 15-page PDF that helps someone land a $75k remote job is worth $99 easily. A 300-page PDF that rehashes general career advice is worth $9. Outcome > effort. Outcome > page count.',
        'First pricing question: what specific, concrete result does the buyer walk away with? Anchor your price against 1% of that result\'s dollar value.',
      ],
    },
    {
      type: 'text',
      eyebrow: 'The three-tier anchor',
      h2: 'Why you should always offer three tiers',
      paragraphs: [
        'A standalone $99 product looks expensive. A $99 product sitting between a $29 starter and a $299 premium looks like the obvious middle choice — and it sells 2–3x better than the same $99 product alone.',
        'This is the price-anchoring effect, and it is the single highest-leverage pricing trick available. Create three tiers even if the bottom tier barely sells:',
        '<strong>Tier 1 ($9–$29):</strong> cheat sheet, reference card, excerpt. Low commitment. Filters out tire-kickers. Builds trust.',
        '<strong>Tier 2 ($49–$149):</strong> the main product — full guide, full template, full course. Most revenue flows here.',
        '<strong>Tier 3 ($299–$799):</strong> bundle + personal touch — consultation, community access, extended license. Anchors tier 2. A few high-intent buyers take this.',
      ],
    },
    {
      type: 'text',
      eyebrow: 'The data-driven path',
      h2: 'Revenue-per-view math: the metric that matters',
      paragraphs: [
        'Conversion rate is a vanity metric. Revenue-per-view (RPV) is the one you actually optimize. RPV = total revenue ÷ total views of the product page.',
        'If 100 visitors buy your $29 product at 3% conversion, that is $87 revenue and $0.87 RPV. If 100 visitors buy your $49 product at 2% conversion, that is $98 revenue and $0.98 RPV — despite lower conversion. <strong>The higher-priced product actually performs better per unit of traffic.</strong>',
        'Raise prices when RPV is trending up with each increase. Stop raising when RPV flatlines or drops. This replaces the guessing game ("is $X too much?") with a number that tells you.',
      ],
    },
    {
      type: 'text',
      eyebrow: 'Benchmarks',
      h2: 'Price ranges by product type (2026)',
      paragraphs: [
        '<strong>Cheat sheets / checklists:</strong> $9–$19. High volume, low barrier.',
        '<strong>PDF guides (20–40 pages):</strong> $19–$49. The default for expert content.',
        '<strong>Notion / Figma templates:</strong> $19–$79. Depends on complexity and niche.',
        '<strong>Mini-courses (3–5 lessons):</strong> $49–$149. Video + workbook bundle.',
        '<strong>Full courses (10+ lessons):</strong> $149–$499. Anchor against comparable Udemy/Coursera but with higher production value.',
        '<strong>Consulting calls:</strong> $99–$499 per session. Niche and specificity drive price.',
        '<strong>Agency-level packages:</strong> $499–$2,499. Bundle of deliverables + support.',
        'These are floors and ceilings, not targets. Niche matters more than format: a $499 PDF for B2B SaaS execs is realistic; a $499 PDF for weekend hobbyists is not.',
      ],
    },
    {
      type: 'howto',
      eyebrow: 'Practical process',
      h2: 'How to set your first price',
      steps: [
        {
          title: 'Find three comparable products',
          body: 'Look for digital products in the same niche. What do they charge? Do not match — use their prices as the range, and position yours within it.',
        },
        {
          title: 'Start at the middle',
          body: 'If comparables are $19, $49, $99 — start at $49. Not the cheapest (signals low value), not the most expensive (no social proof yet to justify).',
        },
        {
          title: 'Watch RPV for 2–4 weeks',
          body: 'Track visitors, sales, revenue. Compute RPV. If RPV is consistent and conversion is >3%, your price is probably under-set. Test a 20–40% increase.',
        },
        {
          title: 'Iterate on three tiers within 2 months',
          body: 'Add a cheaper excerpt product. Add a premium bundle. Rerun the RPV analysis for each tier. Revenue often doubles just from the ladder.',
        },
      ],
    },
    {
      type: 'text',
      eyebrow: 'Common mistakes',
      h2: 'What creators get wrong',
      paragraphs: [
        '<strong>Round numbers.</strong> $49 converts slightly better than $50. $99 better than $100. Not enormously, but consistently. Use charm pricing where possible.',
        '<strong>Discounting too early.</strong> A 30% launch discount sets the baseline; afterwards buyers wait for discounts. Hold price for the first 60 days, then test targeted discounts (newsletter exclusive, Black Friday).',
        '<strong>Racing to the bottom.</strong> "I\'ll undercut the competition" is a strategy only for commodity markets. Digital creator products are not commodities — they are bets on your specific expertise.',
        '<strong>Stopping at one price.</strong> Not testing price is the single biggest money left on the table. Plutus\' price-elasticity tips flag exactly when to raise.',
      ],
    },
  ],
  faq: [
    {
      q: 'Should I price lower to build reviews/social proof?',
      a: 'For the first week of your first product, maybe — 30% off to early buyers in exchange for a testimonial works. After that, a low price becomes a perception ceiling that is hard to raise.',
    },
    {
      q: 'How often should I raise prices?',
      a: 'Every 3–6 months if RPV is stable or rising at each step. If you are running a ladder (three tiers), rebalance whenever the middle tier is selling too well — that signals it\'s now perceived as the cheap option.',
    },
    {
      q: 'What about regional pricing / purchasing-power parity?',
      a: 'For most digital products with global audiences, a single USD price works fine. If your niche is heavily concentrated in emerging markets, consider a regional discount code for those countries.',
    },
    {
      q: 'Should I offer a refund policy?',
      a: 'A 30-day no-questions refund policy typically doesn\'t hurt conversion and protects trust. Real refund rates on digital products usually stay under 3%.',
    },
    {
      q: 'What if my conversion drops after a price increase?',
      a: 'Check RPV, not conversion. If conversion drops 30% but RPV rises 20%, you made money from the increase. Only revert if RPV drops with the new price.',
    },
    {
      q: 'Does Plutus help with pricing decisions?',
      a: 'Yes — the analytics dashboard surfaces revenue-per-view and price-elasticity tips ("this product supports a 20% price increase based on current conversion"). The math runs in the background so you do not have to.',
    },
  ],
  finalCta: {
    h2: 'Stop under-pricing. Start with three tiers.',
    lede: 'Launch on Plutus, track RPV, raise when the data says to. 5% fee, free to start.',
    label: 'Start selling free',
    href: '/signup',
  },
};
