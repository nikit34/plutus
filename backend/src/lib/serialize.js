import { config } from '../config.js';

const coverUrl = (p) => (p.cover_path ? `${config.apiBaseUrl}/files/${p.cover_path.replace(/\\/g, '/')}` : null);

export function serializeProduct(p, { includePrivate = false } = {}) {
  const priceDollars = p.price_cents / 100;
  const sales = Number(p.sales ?? 0);
  const views = Number(p.views ?? 0);
  const revenue = Number(p.revenue_cents ?? 0) / 100;
  // Rough forecast: 10x current revenue, or price*200 if no sales yet
  const potentialRevenue = revenue > 0 ? Math.round(revenue * 10) : Math.round(priceDollars * 200);
  const base = {
    id: String(p.id),
    slug: p.slug,
    title: p.title,
    description: p.description || '',
    price: priceDollars,
    priceCents: p.price_cents,
    currency: p.currency,
    image: coverUrl(p),
    theme: p.theme,
    status: p.status,
    createdAt: p.created_at,
    sales,
    revenue,
    views,
    conversionRate: views > 0 ? Math.round((sales / views) * 1000) / 10 : 0,
    potentialRevenue,
    trend: 0,
    content: contentPayload(p),
    stripePaymentLink: p.stripe_payment_link || null,
    link: `${config.frontendBaseUrl.replace(/^https?:\/\//, '')}/product/${p.slug}`,
  };
  if (includePrivate) {
    base.ownerEmail = p.owner_email;
  }
  return base;
}

function contentPayload(p) {
  if (p.content_type === 'file') {
    return {
      type: 'file',
      fileName: p.content_file_name || null,
      fileSize: p.content_file_size || null,
    };
  }
  if (p.content_type === 'link') {
    return { type: 'link', url: p.content_url || null, label: p.content_label || null };
  }
  if (p.content_type === 'text') {
    return { type: 'text', body: p.content_body || null };
  }
  return null;
}

export function serializeUser(u) {
  return {
    id: String(u.id),
    email: u.email,
    name: u.name || '',
    avatar: u.avatar_url || null,
    plan: u.plan,
    socialLink: u.social_link || null,
    socialLabel: u.social_label || null,
    subscribers: u.subscribers || 0,
    stripeConnected: !!u.stripe_onboarded,
    stripeAccountId: u.stripe_account_id || null,
    emailNotif: {
      sales: u.email_notif_sales,
      payouts: u.email_notif_payouts,
      tips: u.email_notif_tips,
    },
    createdAt: u.created_at,
  };
}

export function serializePayout(p) {
  return {
    id: String(p.id),
    amount: p.amount_cents / 100,
    currency: p.currency,
    status: p.status,
    method: p.method_label || 'Bank account',
    createdAt: p.created_at,
    paidAt: p.paid_at,
  };
}

export function serializePurchase(r) {
  return {
    id: String(r.id),
    productTitle: r.product_title,
    amount: r.amount_cents / 100,
    currency: r.currency,
    buyerEmail: r.buyer_email,
    status: r.status,
    createdAt: r.created_at,
    paidAt: r.paid_at,
  };
}

export function serializeNotification(n) {
  return {
    id: String(n.id),
    type: n.type,
    title: n.title,
    body: n.body,
    meta: n.meta,
    readAt: n.read_at,
    createdAt: n.created_at,
  };
}
