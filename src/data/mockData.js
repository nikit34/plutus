export const CREATOR = {
  id: 'cr_01',
  name: 'Alex Carter',
  avatar: null,
  email: 'alex@creator.com',
  plan: 'Pro',
  joinedAt: '2025-11-15',
  totalEarnings: 84752,
  totalSales: 1243,
  conversionRate: 4.7,
  activeProducts: 8,
  socialLink: 'https://youtube.com/@alexcarter',
  socialLabel: 'YouTube',
  subscribers: 12400,
  subscribersGrowth: 12.4,
};

export const PRODUCTS = [
  {
    id: 'prod_01',
    title: 'Notion System for Freelancers',
    description: 'Complete project, client and finance management system in Notion. Includes 15+ templates, video walkthrough and checklists.',
    price: 29,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop',
    sales: 412,
    revenue: 11948,
    views: 8740,
    conversionRate: 4.7,
    potentialRevenue: 18000,
    trend: +12.3,
    theme: 'midnight',
    status: 'active',
    createdAt: '2025-12-01',
    link: 'nikit34.github.io/plutus/product/prod_01',
    content: { type: 'link', url: 'https://notion.so/template/freelancer-system', label: 'Open Notion Template' },
  },
  {
    id: 'prod_02',
    title: 'YouTube from Zero to Monetization',
    description: 'Step-by-step guide to launching a YouTube channel. From idea to first $1,000. PDF + video lessons + thumbnail templates.',
    price: 49,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&h=400&fit=crop',
    sales: 287,
    revenue: 14063,
    views: 12450,
    conversionRate: 2.3,
    potentialRevenue: 25000,
    trend: +8.1,
    theme: 'aurora',
    status: 'active',
    createdAt: '2026-01-15',
    link: 'nikit34.github.io/plutus/product/prod_02',
    content: { type: 'link', url: 'https://youtube.com/playlist?list=example', label: 'Go to Course' },
  },
  {
    id: 'prod_03',
    title: 'Lightroom Presets — Moody Cinema',
    description: '24 professional Lightroom presets in cinematic style. Desktop + Mobile versions included.',
    price: 19,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1493863641943-9b68992a8d07?w=600&h=400&fit=crop',
    sales: 189,
    revenue: 3591,
    views: 5230,
    conversionRate: 3.6,
    potentialRevenue: 6500,
    trend: -2.4,
    theme: 'ember',
    status: 'active',
    createdAt: '2026-02-20',
    link: 'nikit34.github.io/plutus/product/prod_03',
    content: { type: 'file', fileName: 'Moody_Cinema_Presets.zip', fileSize: '24 MB' },
  },
  {
    id: 'prod_04',
    title: 'Figma UI Kit — SaaS Dashboard',
    description: '200+ components for dashboards. Auto Layout, Variables, Dark & Light themes.',
    price: 59,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop',
    sales: 156,
    revenue: 9204,
    views: 6890,
    conversionRate: 2.3,
    potentialRevenue: 22000,
    trend: +22.5,
    theme: 'midnight',
    status: 'active',
    createdAt: '2026-03-01',
    link: 'nikit34.github.io/plutus/product/prod_04',
    content: { type: 'file', fileName: 'SaaS_Dashboard_UIKit.fig', fileSize: '18 MB' },
  },
  {
    id: 'prod_05',
    title: 'TypeScript Fundamentals Course',
    description: '12 modules, 40+ lessons, hands-on exercises. From basic types to advanced patterns.',
    price: 79,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop',
    sales: 94,
    revenue: 7426,
    views: 4120,
    conversionRate: 2.3,
    potentialRevenue: 12000,
    trend: +5.6,
    theme: 'aurora',
    status: 'active',
    createdAt: '2026-03-10',
    link: 'nikit34.github.io/plutus/product/prod_05',
    content: { type: 'link', url: 'https://academy.example.com/typescript', label: 'Go to Lessons' },
  },
  {
    id: 'prod_06',
    title: 'Instagram Stories Templates — Minimal',
    description: '50 minimal Instagram Stories templates. Canva + Figma formats included.',
    price: 9,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=600&h=400&fit=crop',
    sales: 105,
    revenue: 945,
    views: 3890,
    conversionRate: 2.7,
    potentialRevenue: 2200,
    trend: +1.2,
    theme: 'ember',
    status: 'draft',
    createdAt: '2026-03-25',
    link: 'nikit34.github.io/plutus/product/prod_06',
    content: { type: 'file', fileName: 'IG_Minimal_Templates.zip', fileSize: '56 MB' },
  },
];

export const THEMES = {
  midnight: {
    name: 'Midnight',
    bg: 'linear-gradient(135deg, #0c0c1d 0%, #1a1a2e 50%, #16213e 100%)',
    accent: '#E2B94B',
    text: '#FAFAFA',
  },
  aurora: {
    name: 'Aurora',
    bg: 'linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 50%, #0a1a2e 100%)',
    accent: '#A78BFA',
    text: '#FAFAFA',
  },
  ember: {
    name: 'Ember',
    bg: 'linear-gradient(135deg, #1a0a0a 0%, #2e1a1a 50%, #1a1010 100%)',
    accent: '#F87171',
    text: '#FAFAFA',
  },
  forest: {
    name: 'Forest',
    bg: 'linear-gradient(135deg, #0a1a0a 0%, #1a2e1a 50%, #101a10 100%)',
    accent: '#34D399',
    text: '#FAFAFA',
  },
  ocean: {
    name: 'Ocean',
    bg: 'linear-gradient(135deg, #0a0f1a 0%, #1a2e3e 50%, #0c1926 100%)',
    accent: '#60A5FA',
    text: '#FAFAFA',
  },
  snow: {
    name: 'Snow',
    bg: 'linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 50%, #f0f0f0 100%)',
    accent: '#18181B',
    text: '#18181B',
  },
};

export const EARNINGS_HISTORY = [
  { month: 'Oct', amount: 4230 },
  { month: 'Nov', amount: 7890 },
  { month: 'Dec', amount: 12540 },
  { month: 'Jan', amount: 15620 },
  { month: 'Feb', amount: 18970 },
  { month: 'Mar', amount: 23450 },
  { month: 'Apr', amount: 19840 },
];

export const ACTIVITY_FEED = [
  { id: 'ev_01', type: 'sale', productId: 'prod_01', productTitle: 'Notion System for Freelancers', amount: 29, time: '12m ago' },
  { id: 'ev_02', type: 'sale', productId: 'prod_04', productTitle: 'Figma UI Kit — SaaS Dashboard', amount: 59, time: '47m ago' },
  { id: 'ev_03', type: 'sale', productId: 'prod_02', productTitle: 'YouTube from Zero to Monetization', amount: 49, time: '1h ago' },
  { id: 'ev_04', type: 'milestone', text: '"Notion System" hit 400 sales!', time: '2h ago' },
  { id: 'ev_05', type: 'sale', productId: 'prod_01', productTitle: 'Notion System for Freelancers', amount: 29, time: '3h ago' },
  { id: 'ev_06', type: 'sale', productId: 'prod_03', productTitle: 'Lightroom Presets — Moody Cinema', amount: 19, time: '4h ago' },
  { id: 'ev_07', type: 'review', productTitle: 'Figma UI Kit — SaaS Dashboard', stars: 5, text: '"Best UI Kit I\'ve ever used. Worth every penny"', time: '5h ago' },
  { id: 'ev_08', type: 'sale', productId: 'prod_05', productTitle: 'TypeScript Fundamentals Course', amount: 79, time: '6h ago' },
  { id: 'ev_09', type: 'sale', productId: 'prod_02', productTitle: 'YouTube from Zero to Monetization', amount: 49, time: '8h ago' },
  { id: 'ev_10', type: 'tip', text: 'Raise price on Lightroom presets by 25% — 3.6% conversion supports it. Forecast: +$560/mo.', time: 'Today' },
];

export const TODAY_STATS = {
  earnings: 284,
  sales: 7,
  views: 342,
  earningsChange: +18.5,
  salesChange: +40,
  viewsChange: +12.3,
};

export const PLATFORM_FEE = 0.05; // 5%

export function formatPrice(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export const PLATFORM_BENCHMARK_CONVERSION = 2.5; // average conversion across platform
const PRICE_ELASTICITY = 0.65; // 1% price increase → 0.65% conversion drop

export function generateTip(products) {
  const withConversion = products
    .filter((p) => p.status === 'active' && p.views > 0)
    .map((p) => {
      const conversion = (p.sales / p.views) * 100;
      const revenuePerView = (p.revenue / p.views);
      const headroom = conversion - PLATFORM_BENCHMARK_CONVERSION;
      return { ...p, conversion, revenuePerView, headroom };
    })
    .filter((p) => p.headroom > 0.5)
    .sort((a, b) => b.headroom - a.headroom);

  if (!withConversion.length) return null;

  const best = withConversion[0];
  const priceIncreasePct = Math.round(best.headroom / PRICE_ELASTICITY);
  const newPrice = Math.round(best.price * (1 + priceIncreasePct / 100));
  const newConversion = best.conversion * (1 - (priceIncreasePct * PRICE_ELASTICITY) / 100);
  const currentRpv = best.revenuePerView;
  const newRpv = (newPrice * newConversion) / 100;
  const monthlyGain = Math.round((newRpv - currentRpv) * best.views / 7 * 30);

  return {
    product: best,
    priceIncreasePct,
    newPrice,
    currentConversion: best.conversion,
    newConversion: Math.round(newConversion * 10) / 10,
    currentRpv: Math.round(currentRpv * 100) / 100,
    newRpv: Math.round(newRpv * 100) / 100,
    monthlyGain,
    benchmark: PLATFORM_BENCHMARK_CONVERSION,
  };
}

export function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
