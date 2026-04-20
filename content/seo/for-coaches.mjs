export default {
  slug: 'for-coaches',
  dir: '',
  lang: 'en',
  title: 'Sell Coaching Programs, Workbooks and Consultations — Plutus',
  metaTitle: 'Platform for Coaches: Sell Programs + Sessions — Plutus',
  description:
    'The creator platform for coaches, therapists, and experts: sell programs, workbooks, session packages, and consultations. Card + crypto, 5% fee, secure delivery.',
  keywords: [
    'coaching platform',
    'sell coaching programs',
    'platform for coaches',
    'sell workbooks',
    'online coaching business',
    'consultation booking platform',
  ],
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'For coaches', url: '/for-coaches' },
  ],
  hero: {
    eyebrow: 'For coaches and experts',
    h1: 'Sell programs, workbooks, and sessions. <em>Keep 95%.</em>',
    lede:
      'Stop juggling Calendly, Stripe Payment Links, and Google Drive. Plutus is the one place to sell your coaching programs, workbooks, and session packages — with clean delivery and a page that looks as premium as your offer.',
    ctas: [
      { label: 'Start selling free', href: '/signup', primary: true },
      { label: 'See how it works', href: '/#how' },
    ],
    proof: ['One-time or package pricing', 'Secure delivery', 'Global checkout'],
  },
  sections: [
    {
      type: 'text',
      eyebrow: 'The problem',
      h2: 'Coaches stitch five tools together just to take a booking',
      paragraphs: [
        'You have a program. You have a workbook. You have a session package. And to actually sell any of them, you jump between Calendly, Stripe, Thinkific, MailerLite, a Google Doc, a ConvertKit form, and three Zapier connections. Every tool charges a monthly fee. Every integration breaks once a quarter.',
        'Plutus is one product page per offer. Card or crypto checkout. Instant delivery of workbooks or session-booking links. Analytics that show which offer is actually converting, so you can double down on what works.',
      ],
    },
    {
      type: 'features',
      eyebrow: 'What coaches ship on Plutus',
      h2: 'Every coaching product type in one place',
      items: [
        {
          title: 'Self-paced programs',
          body: 'Multi-module courses, frameworks, mindset decks. Upload as video link + workbook PDF. Buyers get lifetime access.',
        },
        {
          title: 'Workbook PDFs',
          body: 'Standalone exercises, assessments, journaling prompts. Low-ticket lead magnets that actually earn rather than just collect emails.',
        },
        {
          title: 'Session packages',
          body: 'Sell 3-session, 5-session, or full-program packages as products. After purchase, buyers see your Calendly / booking link.',
        },
        {
          title: 'Group cohort access',
          body: 'Sell entry to a private group (Circle, Discord, Telegram). Delivery page includes the invite link.',
        },
        {
          title: 'Paid assessments',
          body: '$9–$29 diagnostic products that funnel interested buyers into your bigger programs. High conversion from existing audience.',
        },
        {
          title: 'Upgrade ladders',
          body: 'Use tiered pricing to anchor — $29 workbook, $149 program, $499 package. Most revenue flows through the middle tier.',
        },
      ],
    },
    {
      type: 'howto',
      eyebrow: 'Launch',
      h2: 'Three steps to your first paid client',
      steps: [
        {
          title: 'Create the offer',
          body: 'Pick the format (PDF, program, session package). Upload the deliverable or paste the booking link. Set a price. Add cover + description.',
        },
        {
          title: 'Share one link',
          body: 'Put the product URL in your Instagram bio, Telegram channel, LinkedIn profile, or newsletter. Replace the "DM me for details" workflow.',
        },
        {
          title: 'Track what works',
          body: 'Plutus shows conversion, revenue-per-view, and price-elasticity tips. Know which offer to raise the price on before you would have noticed.',
        },
      ],
    },
    {
      type: 'text',
      eyebrow: 'Pricing psychology for coaching',
      h2: 'How to price coaching products without leaving money on the table',
      paragraphs: [
        '<strong>Anchor with three tiers.</strong> A standalone $149 program seems expensive; a $149 program next to a $499 package looks like a deal. Most buyers take the middle.',
        '<strong>Lead with a cheap diagnostic.</strong> A $19 "is this right for you?" workbook warms up buyers and filters out non-fits. Conversion on the $499 offer doubles when preceded by the $19 entry point.',
        '<strong>Increase prices quarterly.</strong> Your skill compounds. Your prices should too. Plutus shows when your conversion is high enough to raise prices without hurting volume — usually at 3%+ conversion and $100+ revenue-per-view.',
      ],
    },
  ],
  faq: [
    {
      q: 'Can I sell 1-on-1 sessions?',
      a: 'Yes, as a product. Use "Link" delivery and paste your Calendly or Cal.com URL. Buyer pays, receives the booking link, schedules. Your availability stays in one place.',
    },
    {
      q: 'How do I sell a multi-week program?',
      a: 'Upload the curriculum as a PDF or a Notion/Teachable link. For live cohorts, set the product as a "Text" delivery with cohort details (start date, group invite, calendar).',
    },
    {
      q: 'What about recurring subscriptions for membership programs?',
      a: 'Plutus is one-time-payment focused today. For recurring memberships, pair it with Circle/Mighty Networks using Plutus to sell the "annual pass" as a one-time product.',
    },
    {
      q: 'Is it compliant with therapy / HIPAA?',
      a: 'Plutus handles product sale and delivery only. Session content, client records, and PHI stay in your dedicated practice software. Use Plutus for product sales; keep clinical records separate.',
    },
    {
      q: 'Can international clients pay?',
      a: 'Yes — Stripe card supports 30+ currencies. Crypto (USDT, BTC, ETH) works globally. Clients in regions where cards are declined can switch to crypto at the checkout screen.',
    },
    {
      q: 'Do I need a website?',
      a: 'No. Your product page is the landing page. Most coaches run their business from a single bio link pointing to Plutus.',
    },
  ],
  finalCta: {
    h2: 'Stop stitching tools. Sell one offer cleanly.',
    lede: 'Your program, workbook, or session package — one link, everywhere. 5% fee, no monthly. Free to start.',
    label: 'Start selling free',
    href: '/signup',
  },
};
