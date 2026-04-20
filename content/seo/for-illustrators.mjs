export default {
  slug: 'for-illustrators',
  dir: '',
  lang: 'en',
  title: 'Sell Art, Brush Packs, and Illustration Resources — Plutus',
  metaTitle: 'Sell Illustrations, Brush Packs, Art Prints — Plutus',
  description:
    'Sell digital illustrations, Procreate brushes, vector packs, and art prints. Card + crypto checkout, 5% flat fee, signed per-buyer downloads. Built for illustrators.',
  keywords: [
    'sell illustrations',
    'sell procreate brushes',
    'sell digital art',
    'illustrator creator platform',
    'sell brush packs',
    'digital art marketplace alternative',
  ],
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'For illustrators', url: '/for-illustrators' },
  ],
  hero: {
    eyebrow: 'For illustrators',
    h1: 'Sell your art directly. <em>Skip the marketplace.</em>',
    lede:
      'Procreate brushes, vector packs, digital prints, coloring pages — sell them from your own branded page. Card + crypto checkout, signed per-buyer downloads, 5% flat fee.',
    ctas: [
      { label: 'Start selling free', href: '/signup', primary: true },
      { label: 'See how it works', href: '/#how' },
    ],
    proof: ['Per-buyer download links', 'No listing fee', 'Global checkout'],
  },
  sections: [
    {
      type: 'text',
      eyebrow: 'The problem',
      h2: 'Etsy takes 6.5% plus listing fees plus ad bids',
      paragraphs: [
        'Etsy is the default for art creators, but the real take on a $10 sale is closer to 15–20% once you add the listing fee, transaction fee, payment processing, and the ad bids that have become near-mandatory for visibility.',
        'Plutus is 5% flat. Your page. Your pricing. Your buyer — you can follow up, upsell, and turn them into repeat customers instead of renting access from a marketplace algorithm.',
      ],
    },
    {
      type: 'features',
      eyebrow: 'What illustrators sell on Plutus',
      h2: 'Every format, one platform',
      items: [
        {
          title: 'Procreate brush packs',
          body: '.brush and .brushset files delivered as a ZIP. One-click install for iPad buyers. Popular price point: $19–$49.',
        },
        {
          title: 'Vector packs',
          body: 'SVG, AI, EPS bundles for Illustrator users. Logos, icons, spot illustrations. Ships as a ZIP.',
        },
        {
          title: 'Digital prints',
          body: 'High-res JPG/PNG/PDF for home printing or print-on-demand. Buyers get files instantly, print at home.',
        },
        {
          title: 'Coloring pages',
          body: 'Printable PDF coloring books. Kids, adults, holiday themes. Low-ticket ($5–$15), high-volume product.',
        },
        {
          title: 'Stock illustrations',
          body: 'Editorial, spot, and scene illustrations for use by writers, bloggers, and small publishers. License terms in description.',
        },
        {
          title: 'Tutorials',
          body: 'Video process recordings + brush file bundles. Pair instruction with assets — higher conversion than either alone.',
        },
      ],
    },
    {
      type: 'text',
      eyebrow: 'Per-buyer delivery',
      h2: 'Why per-buyer signed links matter for art files',
      paragraphs: [
        'Digital art files are one of the most-reshared product types online. A single leaked download URL ends up on five torrent sites within a week.',
        'Plutus issues a per-purchase signed token for every buyer. Each delivery URL is unique and time-limited. Copying it from one buyer\'s browser does not give access to future visits. No public URL means no "brush-pack-2025.zip — free download" pages.',
      ],
    },
    {
      type: 'howto',
      eyebrow: 'Launch',
      h2: 'First brush pack live in 10 minutes',
      steps: [
        {
          title: 'ZIP your files',
          body: 'Brush files + a short README.txt with install instructions. Keep under 100MB for direct upload; larger files can be hosted on your own Drive/Dropbox and delivered as a link.',
        },
        {
          title: 'Create the product',
          body: 'Upload the ZIP. Set the price. Add a hero image showing brush strokes. Pick a theme that matches your portfolio.',
        },
        {
          title: 'Share and track',
          body: 'Post in your Instagram, Procreate community, Twitter. Plutus analytics show exactly which traffic source converted best — double down on what works.',
        },
      ],
    },
  ],
  faq: [
    {
      q: 'Can I sell commercial licenses?',
      a: 'Yes — include your license terms in the product description or as a text-delivery add-on. For multi-tier licensing (personal vs commercial vs extended), create separate products at different price points.',
    },
    {
      q: 'What about print-on-demand integrations?',
      a: 'Plutus handles digital product sales. For physical POD, use Printful, Redbubble, or Society6 directly. Many illustrators sell digital versions on Plutus and physical on POD — same art, two revenue streams.',
    },
    {
      q: 'How do I handle copyright / art theft?',
      a: 'Plutus watermarks are not automatic, but per-buyer delivery links prevent trivial resharing. For your hero images, add a subtle visible watermark. For Procreate brushes, include a license note in the README.',
    },
    {
      q: 'Do I need to collect sales tax?',
      a: 'Stripe handles sales tax where applicable. For US sellers doing $20k+/year, review your state\'s digital goods tax rules. For most new artist sellers, default Stripe settings are sufficient.',
    },
    {
      q: 'Can I sell to international buyers?',
      a: 'Yes — Stripe card checkout supports 30+ currencies. Crypto (USDT, BTC, ETH) covers buyers in regions where cards are unreliable. Typical illustrator audiences see 10–15% international sales.',
    },
    {
      q: 'How does this compare to Gumroad for art?',
      a: 'Similar model, half the fee (5% vs 10%). Plutus pages look more like a designer portfolio and less like a generic marketplace listing, which matters for art buyers who care about presentation.',
    },
  ],
  finalCta: {
    h2: 'Your art, your page, your prices.',
    lede: 'Launch a brush pack or print shop in 10 minutes. 5% fee, no listing cost, free to start.',
    label: 'Start selling free',
    href: '/signup',
  },
};
