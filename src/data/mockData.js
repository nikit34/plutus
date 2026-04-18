// Static presentation helpers. Business data comes from the API now.

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

export const PLATFORM_FEE = 0.05;
export const PLATFORM_BENCHMARK_CONVERSION = 2.5;
const PRICE_ELASTICITY = 0.65;

export function formatPrice(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export function formatNumber(num) {
  num = Number(num) || 0;
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export function generateTip(products) {
  const withConversion = (products || [])
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
