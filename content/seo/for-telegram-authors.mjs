export default {
  slug: 'for-telegram-authors',
  dir: '',
  lang: 'en',
  title: 'Sell Digital Products to Your Telegram Audience — Plutus',
  metaTitle: 'Monetize a Telegram Channel with Paid Products — Plutus',
  description:
    'The creator platform for Telegram authors: sell PDFs, courses, templates and guides directly to your channel. Card + crypto checkout, 5% flat fee, one shareable link.',
  keywords: [
    'monetize telegram channel',
    'sell to telegram audience',
    'telegram author platform',
    'telegram creator monetization',
    'paid products for telegram',
    'telegram channel store',
  ],
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'For Telegram authors', url: '/for-telegram-authors' },
  ],
  hero: {
    eyebrow: 'For Telegram authors',
    h1: 'Turn your Telegram channel into <em>a storefront</em>',
    lede:
      'Paste one link in a pinned post. Sell PDFs, courses, templates, and mini-products to the audience you already have. Card + crypto checkout, 5% flat fee, instant payouts.',
    ctas: [
      { label: 'Start selling free', href: '/signup', primary: true },
      { label: 'See how it works', href: '/#how' },
    ],
    proof: ['One link in bio', 'Card + USDT checkout', 'No bot setup'],
  },
  sections: [
    {
      type: 'text',
      eyebrow: 'The problem',
      h2: 'Telegram gives you audience, not infrastructure',
      paragraphs: [
        'You built a 10k, 50k, 250k-subscriber Telegram channel. You have engagement. You have a real community. And yet when you want to charge for a PDF or course, the monetization path is ugly: custom bots, manual payment invoices, a Google Drive link, a tracking spreadsheet, disputes in DMs.',
        'Plutus collapses that into one link. You post it in your pinned message or channel bio — buyers tap, pay by card or crypto, get instant delivery. You get analytics, receipts, signed files. Zero bot setup.',
      ],
    },
    {
      type: 'features',
      eyebrow: 'Built for Telegram',
      h2: 'Everything a Telegram author needs',
      items: [
        {
          title: 'One pinned link',
          body: 'Share plutus.firstmessage.ru/product/your-slug in your channel. It converts on every device your subscribers use.',
        },
        {
          title: 'Crypto checkout',
          body: 'USDT-TRC20/ERC20, BTC, ETH, USDC. Essential for Telegram audiences where card rates vary by country.',
        },
        {
          title: 'Instant crypto payouts',
          body: 'Withdraw to your wallet in 5–30 minutes. No bank, no hold, no paperwork. Keep selling to a global audience from anywhere.',
        },
        {
          title: 'Signed download links',
          body: 'Every buyer gets a per-purchase token. Your PDF is not a public URL — no one re-shares it in other channels.',
        },
        {
          title: 'Sale notifications',
          body: 'Email on every sale. Daily/weekly digest. Pair with a Telegram bot webhook (custom) if you want real-time pings.',
        },
        {
          title: '5% flat fee',
          body: 'No monthly, no hidden costs. Your $29 PDF earns you $27.55. Lower than Gumroad, lower than Boosty.',
        },
      ],
    },
    {
      type: 'text',
      eyebrow: 'What works',
      h2: 'Product formats that sell through Telegram',
      paragraphs: [
        '<strong>PDF guides ($9–$29).</strong> Distilled posts, frameworks, or references from your channel as a single deliverable.',
        '<strong>Notion templates ($19–$49).</strong> Frameworks and trackers that your audience has been asking about in comments.',
        '<strong>Mini-courses ($49–$149).</strong> 3–5 video lessons + workbook. Hosted video link + PDF — Plutus handles delivery.',
        '<strong>Private cohorts / consultations ($199–$499).</strong> Sell access as a product — buyer gets a text delivery with a booking link or invite.',
        '<strong>Archive access ($5–$15/unlock).</strong> Sell access to your best historical content as a one-time purchase.',
      ],
    },
    {
      type: 'howto',
      eyebrow: 'Launch',
      h2: 'From post idea to first sale in one evening',
      steps: [
        {
          title: 'Upload the product',
          body: 'PDF, Notion link, video course URL — drop it in. Set a price. Pick a theme that matches your channel brand.',
        },
        {
          title: 'Pin the link',
          body: 'Paste your product URL in the channel bio and in a pinned post. Explain what it is and what the buyer gets.',
        },
        {
          title: 'Announce the launch',
          body: 'One post: what it is, who it is for, the price, and why you built it. Watch the first sales come in that evening.',
        },
      ],
    },
  ],
  faq: [
    {
      q: 'Do my subscribers need to leave Telegram to buy?',
      a: 'Yes — the checkout opens in their browser. After payment, they get the delivery page with their content. No new accounts to create, no app to install.',
    },
    {
      q: 'What if my audience is in a country where cards are hard?',
      a: 'Every product page shows both card and crypto checkout. Crypto (USDT-TRC20, BTC, ETH) works everywhere. Typical Telegram audiences see 15–25% of buyers take the crypto route.',
    },
    {
      q: 'Can I send buyers a Telegram invite as delivery?',
      a: 'Yes. Pick "Text" delivery type and paste the invite link in the content. Buyers see it after payment. Perfect for paid private channels or cohort spaces.',
    },
    {
      q: 'Will buyers get email receipts?',
      a: 'Yes, automatically. Plus, you get notified by email on every sale. Email is optional for buyers — they can still complete purchase without leaving their address.',
    },
    {
      q: 'How is this different from a Telegram payment bot?',
      a: 'Bots are powerful but slow to build and maintain. Plutus ships the infrastructure — product page, checkout, delivery, analytics — as one link. No code, no bot token, no payment provider integration.',
    },
    {
      q: 'Can I sell in rubles / euros / my currency?',
      a: 'Stripe card checkout supports 30+ currencies; Plutus converts automatically. Crypto settles in USD-equivalent (USDT). If your audience expects to pay in their local currency, card checkout handles it seamlessly.',
    },
  ],
  finalCta: {
    h2: 'One link, your whole audience',
    lede: 'Pin it. Post it. Watch the first sale land in your inbox before you close the app.',
    label: 'Start selling free',
    href: '/signup',
  },
};
