export default {
  slug: 'for-course-creators',
  dir: '',
  lang: 'en',
  title: 'Sell Online Courses: Lean Platform for Indie Creators — Plutus',
  metaTitle: 'Sell Online Courses Without the Bloat — Plutus',
  description:
    'A lightweight alternative to Teachable, Thinkific, and Podia. Sell your online course with a clean page, card + crypto checkout, and signed video delivery. 5% fee, no monthly.',
  keywords: [
    'sell online courses',
    'teachable alternative',
    'thinkific alternative',
    'course creator platform',
    'indie course platform',
    'sell video courses',
  ],
  breadcrumbs: [
    { name: 'Home', url: '/' },
    { name: 'For course creators', url: '/for-course-creators' },
  ],
  hero: {
    eyebrow: 'For course creators',
    h1: 'Sell your course without the course platform.',
    lede:
      'Teachable, Thinkific, and Podia cost $40–$200/month and make you build inside their course builder. Plutus treats your course as a product: one page, one checkout, one delivery — for 5% per sale, no monthly.',
    ctas: [
      { label: 'Start selling free', href: '/signup', primary: true },
      { label: 'See how it works', href: '/#how' },
    ],
    proof: ['No monthly fee', 'Use any video host', 'Instant payouts'],
  },
  sections: [
    {
      type: 'text',
      eyebrow: 'The problem',
      h2: 'Course platforms sell hosting you do not need',
      paragraphs: [
        'You already have a YouTube channel, Vimeo account, or Notion page where your course lives. You have a PDF workbook. You have your audience. What you do not have is a reason to pay Teachable $149/month just to wrap all of that in their checkout.',
        'Plutus is the checkout layer. Your course stays wherever you built it. Plutus handles the sale, the receipt, the delivery of access, and the analytics.',
      ],
    },
    {
      type: 'features',
      eyebrow: 'How course creators use Plutus',
      h2: 'Three delivery patterns that work',
      items: [
        {
          title: 'Private Notion course',
          body: 'Build curriculum in Notion. Duplicate-link is the deliverable. Buyers get access after purchase. Low-cost, high-fidelity.',
        },
        {
          title: 'YouTube unlisted + PDF',
          body: 'Video lessons as unlisted YouTube. Deliver as a Notion page linking all videos + workbook PDF. Buyers see everything on one page.',
        },
        {
          title: 'Vimeo OTT / Circle link',
          body: 'Run the course on dedicated video hosting. Plutus sells access as a product; delivery is the Vimeo/Circle invite link.',
        },
        {
          title: 'Cohort-based courses',
          body: 'Sell the next cohort as a product. Delivery: private group invite + calendar. Pricing is one-time, no recurring needed.',
        },
        {
          title: 'Course + workbook bundles',
          body: 'One product containing the course link and a downloadable PDF. Buyers get both — conversion higher than course-only.',
        },
        {
          title: 'Course ladders',
          body: 'Free intro → $29 workbook → $199 course → $499 cohort. Plutus handles all four as products, with the same payment rail.',
        },
      ],
    },
    {
      type: 'text',
      eyebrow: 'Economics',
      h2: 'Why 5% per sale beats $149/month',
      paragraphs: [
        'Teachable Pro at $119/month is $1,428/year. At their take rates on processing, you need to do $3,000+/month just to break even on the platform itself. That is before you see a dime of profit from your course.',
        'Plutus has no monthly fee. At $1,000/month in sales, you pay $50. At $10,000/month, $500. The per-sale fee scales with your actual income — you are never paying for months when you are not selling.',
      ],
    },
    {
      type: 'howto',
      eyebrow: 'Launch',
      h2: 'Sell your course in under 10 minutes',
      steps: [
        {
          title: 'Host the content wherever makes sense',
          body: 'Notion, YouTube unlisted, Vimeo, Circle, a single Google Drive folder — any link that buyers can access permanently.',
        },
        {
          title: 'Create the product on Plutus',
          body: 'Title, description, cover (a screenshot of your Module 1 works). Set the price. Choose "Link" delivery and paste the access URL.',
        },
        {
          title: 'Share one URL',
          body: 'Put the Plutus link in your YouTube description, Twitter bio, Telegram channel, newsletter footer. Same URL, everywhere.',
        },
      ],
    },
  ],
  faq: [
    {
      q: 'What about drip content and module gating?',
      a: 'Plutus is not a course-builder with drip logic. Use Notion toggles, Circle stages, or unlisted-video sequencing for drip. Most indie creators find that lifetime access to all modules converts better anyway.',
    },
    {
      q: 'Can I sell certificates of completion?',
      a: 'Not natively. If needed, use a Google Forms quiz at the end of your course and email certificates manually. For most creator-sold courses this is not a requirement.',
    },
    {
      q: 'What about student communities?',
      a: 'Pair Plutus with Circle, Discord, or Telegram. Deliver the community invite as part of the product. Plutus sells access; the community tool hosts the conversation.',
    },
    {
      q: 'How do I protect my videos from being shared?',
      a: 'Unlisted YouTube and Vimeo basic are reasonable defaults. For serious protection, use Vimeo OTT with domain locking. Plutus signs the delivery link per buyer so the Plutus URL is not shareable even if the destination is.',
    },
    {
      q: 'Do I need to integrate with an email platform?',
      a: 'No integration required. Every sale generates a receipt email to the buyer. Export your buyer list any time and import into ConvertKit, Beehiiv, Mailchimp, etc.',
    },
    {
      q: 'Can I offer a refund policy?',
      a: 'Yes. Set your own refund policy and refund through the Wallet dashboard. Stripe/NOWPayments both support partial and full refunds.',
    },
  ],
  finalCta: {
    h2: 'Your course, your audience, your terms.',
    lede: 'Skip the $149/month course platform. Launch today for free. Pay 5% only when you actually sell.',
    label: 'Start selling free',
    href: '/signup',
  },
};
