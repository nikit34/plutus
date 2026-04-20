export default {
  slug: 'for-designers',
  dir: '',
  lang: 'en',
  title: 'Sell Figma Templates, UI Kits, and Design Resources — Plutus',
  metaTitle: 'Sell Design Templates: Figma, UI Kits, Presets — Plutus',
  description:
    'Sell Figma templates, UI kits, icon sets, Lightroom presets, and design resources. 5% flat fee, card + crypto checkout, signed delivery. Built for designers.',
  keywords: [
    'sell figma templates',
    'sell ui kits',
    'sell design resources',
    'figma template store',
    'sell lightroom presets',
    'designer creator platform',
  ],
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'For designers', url: '/for-designers' },
  ],
  hero: {
    eyebrow: 'For designers',
    h1: 'Your templates, your store. <em>Keep 95%.</em>',
    lede:
      'Sell Figma templates, UI kits, icon sets, Lightroom presets, and design resources without handing 10% to marketplaces. Your page, your brand, your payout.',
    ctas: [
      { label: 'Start selling free', href: '/signup', primary: true },
      { label: 'See how it works', href: '/#how' },
    ],
    proof: ['Designer-grade pages', 'No monthly fee', 'Global payouts'],
  },
  sections: [
    {
      type: 'text',
      eyebrow: 'The problem',
      h2: 'Design marketplaces pay you for your traffic',
      paragraphs: [
        'Every big design marketplace — UI8, Envato, Creative Market — charges 30–50% on sales. And they set the page layout, the pricing UX, the discount schedule. You are a tile in a grid, indistinguishable from 200 other designers.',
        'Plutus flips that: 5% flat, your own branded page per product, your pricing. If you drive any of your own traffic (Twitter, Dribbble, Instagram, newsletter), the economics tilt dramatically in your favor.',
      ],
    },
    {
      type: 'features',
      eyebrow: 'What designers sell on Plutus',
      h2: 'Every asset type supported',
      items: [
        {
          title: 'Figma templates',
          body: 'Paste the community/duplicate link. Buyers get the Figma URL after payment. Works with free + pro Figma accounts.',
        },
        {
          title: 'UI kits',
          body: 'Full design systems, component libraries, wireframe kits. Deliver as Figma link + ZIP of exports.',
        },
        {
          title: 'Icon sets',
          body: 'SVG/PNG bundles delivered as a single ZIP. Per-buyer signed download link prevents resharing.',
        },
        {
          title: 'Lightroom / Photoshop presets',
          body: 'XMP and ATN files in a ZIP. One click install for buyers. Instant delivery after card or crypto payment.',
        },
        {
          title: 'Brand guideline templates',
          body: 'Notion, Figma, or InDesign templates buyers customize for their brand. Middle-tier pricing ($49–$99) sells well.',
        },
        {
          title: 'Course materials',
          body: 'Sell design process courses with video links + workbook PDFs. Stack with a template bundle for higher AOV.',
        },
      ],
    },
    {
      type: 'text',
      eyebrow: 'Page design matters',
      h2: 'Your product page should look like your work',
      paragraphs: [
        'Design buyers read the page first. If your product page looks generic, the assumption is your template looks generic too. Plutus pages ship with a premium baseline: clean typography, theme colors, cover imagery. No more explaining "yes this is really what you get" over DMs.',
        'Pick a theme that matches your brand. Upload a high-quality hero image. The conversion lift from a designer-grade page vs a marketplace listing tile is real and measurable — typically 15–30%.',
      ],
    },
    {
      type: 'howto',
      eyebrow: 'Launch',
      h2: 'Ship your first template in 10 minutes',
      steps: [
        {
          title: 'Prepare the deliverable',
          body: 'Figma community link, Notion doc, or ZIP of files. If ZIP, keep it under 100MB or host on your own Dropbox/Drive and deliver as a link.',
        },
        {
          title: 'Upload and price',
          body: 'Add title, a 2-sentence description, cover image (3:2 works best for the page hero). Set a price — most design products sell in $19–$99 range.',
        },
        {
          title: 'Share the URL',
          body: 'Tweet, cross-post on Dribbble, pin in Instagram bio, add to newsletter. One link, your entire funnel.',
        },
      ],
    },
  ],
  faq: [
    {
      q: 'How do I prevent my Figma file from being shared publicly?',
      a: 'Keep your master file private. For each buyer, duplicate the file or generate a duplicate link that resolves to a fresh copy. Plutus signs the delivery link per buyer so the Plutus-side URL is per-purchase even if the Figma link itself is shareable.',
    },
    {
      q: 'Can I sell a bundle of multiple templates?',
      a: 'Yes. Create a single product with a ZIP deliverable containing all templates, or use a Notion/Google Drive folder as the delivery link. Bundles sell at 2–3x the price of single templates.',
    },
    {
      q: 'Do buyers need a Plutus account?',
      a: 'No. Buyers check out as guests — only their email is collected for the receipt. Fewer friction points vs marketplaces that require signups.',
    },
    {
      q: 'What about tax / VAT for EU buyers?',
      a: 'Stripe handles tax collection where applicable. For larger revenues ($10k+/year), consider upgrading to a proper merchant-of-record solution. For most design creators, Stripe-standard is enough.',
    },
    {
      q: 'How does this compare to UI8 / Envato?',
      a: 'UI8 and Envato charge 30–50% and set your pricing constraints. Plutus charges 5% and you set everything. UI8 drives some discovery traffic; on Plutus, traffic is your job. Most designers with any audience come out ahead on Plutus within 1–2 months.',
    },
    {
      q: 'Can I offer discount codes?',
      a: 'Yes — per-product discount codes are supported. Useful for newsletter promos, Black Friday sales, and creator cross-promotions.',
    },
  ],
  finalCta: {
    h2: 'Your templates deserve your page, not a marketplace tile.',
    lede: 'Launch today. Keep 95%. Instant payouts. Free to start.',
    label: 'Start selling free',
    href: '/signup',
  },
};
