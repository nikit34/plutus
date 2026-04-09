export const CREATOR = {
  id: 'cr_01',
  name: 'Алексей Петров',
  avatar: null,
  email: 'alex@creator.com',
  plan: 'Pro',
  joinedAt: '2025-11-15',
  totalEarnings: 847520,
  totalSales: 1243,
  conversionRate: 4.7,
  activeProducts: 8,
};

export const PRODUCTS = [
  {
    id: 'prod_01',
    title: 'Notion-система для фрилансера',
    description: 'Полная система управления проектами, клиентами и финансами в Notion. Включает 15+ шаблонов, видео-инструкцию и чек-листы.',
    price: 2490,
    currency: 'RUB',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop',
    sales: 412,
    revenue: 847080,
    views: 8740,
    conversionRate: 4.7,
    potentialRevenue: 1250000,
    trend: +12.3,
    theme: 'midnight',
    status: 'active',
    createdAt: '2025-12-01',
    link: 'numi.store/p/notion-freelancer',
  },
  {
    id: 'prod_02',
    title: 'Гайд: YouTube с нуля до монетизации',
    description: 'Пошаговый гайд по запуску YouTube-канала. От идеи до первых $1000. PDF + видео-уроки + шаблоны для превью.',
    price: 3990,
    currency: 'RUB',
    image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&h=400&fit=crop',
    sales: 287,
    revenue: 1145130,
    views: 12450,
    conversionRate: 2.3,
    potentialRevenue: 2100000,
    trend: +8.1,
    theme: 'aurora',
    status: 'active',
    createdAt: '2026-01-15',
    link: 'numi.store/p/youtube-guide',
  },
  {
    id: 'prod_03',
    title: 'Пресеты для Lightroom — Moody Cinema',
    description: '24 профессиональных пресета для Lightroom в стиле кинематографа. Desktop + Mobile версии.',
    price: 1290,
    currency: 'RUB',
    image: 'https://images.unsplash.com/photo-1493863641943-9b68992a8d07?w=600&h=400&fit=crop',
    sales: 189,
    revenue: 243810,
    views: 5230,
    conversionRate: 3.6,
    potentialRevenue: 450000,
    trend: -2.4,
    theme: 'ember',
    status: 'active',
    createdAt: '2026-02-20',
    link: 'numi.store/p/moody-presets',
  },
  {
    id: 'prod_04',
    title: 'Figma UI Kit — SaaS Dashboard',
    description: 'Более 200 компонентов для дашбордов. Auto Layout, Variables, Dark & Light themes.',
    price: 4990,
    currency: 'RUB',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop',
    sales: 156,
    revenue: 778440,
    views: 6890,
    conversionRate: 2.3,
    potentialRevenue: 1800000,
    trend: +22.5,
    theme: 'midnight',
    status: 'active',
    createdAt: '2026-03-01',
    link: 'numi.store/p/saas-uikit',
  },
  {
    id: 'prod_05',
    title: 'Курс: Основы TypeScript',
    description: '12 модулей, 40+ уроков, практические задания. От базовых типов до продвинутых паттернов.',
    price: 6990,
    currency: 'RUB',
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop',
    sales: 94,
    revenue: 657060,
    views: 4120,
    conversionRate: 2.3,
    potentialRevenue: 980000,
    trend: +5.6,
    theme: 'aurora',
    status: 'active',
    createdAt: '2026-03-10',
    link: 'numi.store/p/typescript-course',
  },
  {
    id: 'prod_06',
    title: 'Шаблоны Instagram Stories — Minimal',
    description: '50 шаблонов для Instagram Stories в минималистичном стиле. Canva + Figma форматы.',
    price: 790,
    currency: 'RUB',
    image: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=600&h=400&fit=crop',
    sales: 105,
    revenue: 82950,
    views: 3890,
    conversionRate: 2.7,
    potentialRevenue: 180000,
    trend: +1.2,
    theme: 'ember',
    status: 'draft',
    createdAt: '2026-03-25',
    link: 'numi.store/p/ig-minimal',
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
  { month: 'Окт', amount: 42300 },
  { month: 'Ноя', amount: 78900 },
  { month: 'Дек', amount: 125400 },
  { month: 'Янв', amount: 156200 },
  { month: 'Фев', amount: 189700 },
  { month: 'Мар', amount: 234500 },
  { month: 'Апр', amount: 198400 },
];

export const ACTIVITY_FEED = [
  { id: 'ev_01', type: 'sale', productId: 'prod_01', productTitle: 'Notion-система для фрилансера', amount: 2490, time: '12 мин назад' },
  { id: 'ev_02', type: 'sale', productId: 'prod_04', productTitle: 'Figma UI Kit — SaaS Dashboard', amount: 4990, time: '47 мин назад' },
  { id: 'ev_03', type: 'sale', productId: 'prod_02', productTitle: 'Гайд: YouTube с нуля до монетизации', amount: 3990, time: '1 ч назад' },
  { id: 'ev_04', type: 'milestone', text: 'Продукт «Notion-система» преодолел 400 продаж!', time: '2 ч назад' },
  { id: 'ev_05', type: 'sale', productId: 'prod_01', productTitle: 'Notion-система для фрилансера', amount: 2490, time: '3 ч назад' },
  { id: 'ev_06', type: 'sale', productId: 'prod_03', productTitle: 'Пресеты для Lightroom — Moody Cinema', amount: 1290, time: '4 ч назад' },
  { id: 'ev_07', type: 'review', productTitle: 'Figma UI Kit — SaaS Dashboard', stars: 5, text: '«Лучший UI Kit, что я видел. Стоит каждого рубля»', time: '5 ч назад' },
  { id: 'ev_08', type: 'sale', productId: 'prod_05', productTitle: 'Курс: Основы TypeScript', amount: 6990, time: '6 ч назад' },
  { id: 'ev_09', type: 'sale', productId: 'prod_02', productTitle: 'Гайд: YouTube с нуля до монетизации', amount: 3990, time: '8 ч назад' },
  { id: 'ev_10', type: 'tip', text: 'Повысьте цену на пресеты Lightroom на 23% — конверсия 3.6% позволяет. Прогноз: +₽56K/мес.', time: 'Сегодня' },
];

export const TODAY_STATS = {
  earnings: 22240,
  sales: 7,
  views: 342,
  earningsChange: +18.5,
  salesChange: +40,
  viewsChange: +12.3,
};

export const PLATFORM_FEE = 0.05; // 5%

export function formatPrice(amount, currency = 'RUB') {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
