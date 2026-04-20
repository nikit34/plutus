export default {
  slug: 'for-notion-creators',
  dir: '',
  lang: 'en',
  title: 'Sell Notion Templates on Plutus — Plutus',
  metaTitle: 'Sell Notion Templates Online — Plutus',
  description:
    'The creator platform for Notion template makers: card + crypto checkout, instant payouts, 5% flat fee, signed delivery links. Start selling in 5 minutes.',
  keywords: [
    'sell notion templates',
    'notion template marketplace',
    'notion creator platform',
    'notion template store',
    'monetize notion templates',
    'notion gumroad alternative',
  ],
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'For Notion creators', url: '/for-notion-creators' },
  ],
  hero: {
    eyebrow: 'For Notion creators',
    h1: 'Sell your Notion templates. <em>Keep 95%.</em>',
    lede:
      'Stop losing 10% to Gumroad and 6.5%+ listing fees to Etsy. Plutus gives Notion creators a beautiful product page, card + crypto checkout, and instant payouts — for one flat 5% fee.',
    ctas: [
      { label: 'Start selling free', href: '/signup', primary: true },
      { label: 'See how it works', href: '/#how' },
    ],
    proof: ['5 min to launch', 'No monthly fee', 'Bank + crypto payouts'],
  },
  sections: [
    {
      type: 'text',
      eyebrow: 'The problem with existing platforms',
      h2: 'Notion templates deserve better than Gumroad',
      paragraphs: [
        'You built a Notion template that solves a real problem. You spent weeks on structure, copy, and screenshots. Then you hand 10% of every sale to Gumroad — or 6.5% plus a listing fee to Etsy. And the product page? It looks like every other marketplace on the internet.',
        'Plutus is the creator-first alternative: a clean, brand-matching product page, a checkout that accepts both cards and crypto (USDT, BTC, ETH, USDC), and withdrawals that land in your bank or wallet within minutes.',
      ],
    },
    {
      type: 'features',
      eyebrow: 'Why Notion creators pick Plutus',
      h2: 'Everything you need, nothing in the way',
      items: [
        {
          title: 'Beautiful product pages',
          body:
            'Drop a cover, pick a theme. Your page looks like a designer built it — not like a marketplace listing.',
        },
        {
          title: '5% flat fee, no monthly',
          body:
            'Half of Gumroad. You keep 95%. No listing fees, no tier upgrades, no hidden add-ons.',
        },
        {
          title: 'Card + crypto checkout',
          body:
            'Accept Stripe cards and USDT-TRC20, ERC20, BTC, ETH via NOWPayments. Your buyer picks.',
        },
        {
          title: 'Instant payouts',
          body:
            'Bank payouts via Stripe Connect in 1–2 business days. Crypto to your wallet in 5–30 minutes on-chain.',
        },
        {
          title: 'Signed download links',
          body:
            'Every buyer gets a unique, time-limited link. Your Notion duplicate URL is not public. No leaks.',
        },
        {
          title: 'Analytics that help',
          body:
            'Conversion rate, revenue-per-view, and price-elasticity tips. Know which template to raise the price on.',
        },
      ],
    },
    {
      type: 'howto',
      eyebrow: 'Launch',
      h2: 'From zero to first sale in three steps',
      steps: [
        {
          title: 'Add your template',
          body:
            'Paste the Notion duplicate link (or upload a PDF guide that walks buyers through it). Set a price. Pick a theme.',
        },
        {
          title: 'Get a shareable link',
          body:
            'Your product lives at <code>plutus.firstmessage.ru/product/your-slug</code>. Drop it in your Twitter bio, Telegram channel, or YouTube description.',
        },
        {
          title: 'Get paid',
          body:
            'Buyer checks out by card or crypto. 95% lands in your bank or wallet. You never touch payment infrastructure.',
        },
      ],
    },
    {
      type: 'text',
      eyebrow: 'What to sell',
      h2: 'Notion products that sell on Plutus',
      paragraphs: [
        '<strong>Operating systems.</strong> 80-page "Notion OS" for freelancers, creators, or small teams. Price range: $29–$79.',
        '<strong>Niche trackers.</strong> Habit, reading, finance, content calendars. Simple and focused. Price range: $9–$19.',
        '<strong>Client portals.</strong> Templates that agencies resell to their own clients. Price range: $49–$149 with usage rights.',
        '<strong>Course companions.</strong> Pair a Notion workspace with a PDF curriculum — the workspace is the delivery mechanism, the PDF is the coursebook.',
      ],
    },
  ],
  faq: [
    {
      q: 'How do buyers receive the Notion template?',
      a: 'They get a secure download link that contains the Notion duplicate URL and any companion files. The link is tied to their purchase — buyers cannot share it publicly because it expires and is per-buyer.',
    },
    {
      q: 'Can I sell templates in multiple currencies?',
      a: 'Yes. Card checkout via Stripe supports 30+ currencies — Plutus converts on your behalf. Crypto checkout settles in USD-equivalent (USDT/USDC) so payouts are predictable.',
    },
    {
      q: 'What if my buyer is outside the US or EU?',
      a: 'Card checkout works globally where Stripe is available. For regions where cards fail or buyers prefer it, the crypto button accepts USDT, BTC, ETH, USDC — a huge chunk of international template buyers prefer it.',
    },
    {
      q: 'How is Plutus different from Gumroad for Notion creators?',
      a: 'Three things: (1) 5% vs 10% flat fee, (2) native crypto checkout and payouts, (3) product pages that actually look premium rather than generic-marketplace. Migration takes one afternoon — usually paid back by the first sale.',
    },
    {
      q: 'Do I need a website?',
      a: 'No. Every product gets its own hosted page. Share the link anywhere — social bio, email signature, Telegram post. It converts on any device.',
    },
    {
      q: 'What does launching cost?',
      a: 'Zero to start. You only pay 5% per sale, plus standard Stripe (2.9% + $0.30) or NOWPayments (~0.5%) network fees. No monthly subscription.',
    },
  ],
  finalCta: {
    h2: 'Your next Notion template is <em>one link away</em>.',
    lede: 'Skip the marketplace fees and launch with a page that looks like yours. Free to start.',
    label: 'Start selling free',
    href: '/signup',
  },
};
