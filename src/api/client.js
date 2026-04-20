// Resolution order:
//   1. window.__PLUTUS_API_BASE__  — runtime injection (optional)
//   2. VITE_API_BASE_URL           — set at build time; empty string keeps the SPA on
//                                     same-origin (what we want behind a tunnel).
//   3. Default                     — localhost:4000 in dev, same-origin in prod.
const envBase = import.meta.env.VITE_API_BASE_URL;
const fallbackBase = import.meta.env.PROD ? '' : 'http://localhost:4000';
const DEFAULT_BASE = (typeof window !== 'undefined' && window.__PLUTUS_API_BASE__)
  ?? (envBase !== undefined ? envBase : fallbackBase);

export const API_BASE = DEFAULT_BASE.replace(/\/$/, '');

const TOKEN_KEY = 'plutus_token';

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch { return null; }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

export class ApiError extends Error {
  constructor(status, code, message, data) {
    super(message || code || `HTTP ${status}`);
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

async function request(path, { method = 'GET', body, headers = {}, formData, signal } = {}) {
  const token = getToken();
  const opts = { method, headers: { ...headers }, signal };
  if (token) opts.headers.Authorization = `Bearer ${token}`;
  if (formData) {
    opts.body = formData;
  } else if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const res = await fetch(url, opts);
  let data = null;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await res.json().catch(() => null);
  }
  if (!res.ok) {
    if (res.status === 401) {
      setToken(null);
      window.dispatchEvent(new Event('plutus:auth-expired'));
    }
    throw new ApiError(res.status, data?.error, data?.message || data?.error || `HTTP ${res.status}`, data);
  }
  return data;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  del: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
  postForm: (path, formData, opts) => request(path, { ...opts, method: 'POST', formData }),
  patchForm: (path, formData, opts) => request(path, { ...opts, method: 'PATCH', formData }),
};

// Typed endpoint helpers ---------------------------
export const authApi = {
  signup: (email, password, name) => api.post('/api/auth/signup', { email, password, name }),
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  me: () => api.get('/api/auth/me'),
  oauthProviders: () => api.get('/api/auth/oauth/providers'),
  oauthStartUrl: (provider) => `${API_BASE}/api/auth/oauth/${provider}/start`,
};

export const productsApi = {
  list: () => api.get('/api/products'),
  get: (id) => api.get(`/api/products/${id}`),
  create: (formData) => api.postForm('/api/products', formData),
  update: (id, formData) => api.patchForm(`/api/products/${id}`, formData),
  remove: (id) => api.del(`/api/products/${id}`),
};

export const publicApi = {
  product: (slug) => api.get(`/api/public/products/${slug}`),
  event: (slug, type, meta) => api.post(`/api/public/products/${slug}/events`, { type, meta }),
};

export const checkoutApi = {
  start: (slug, email) => api.post(`/api/checkout/${slug}`, { email }),
  session: (id) => api.get(`/api/checkout/session/${id}`),
  startCrypto: (slug, email, payCurrency) => api.post(`/api/checkout/${slug}/crypto`, { email, payCurrency }),
  cryptoStatus: (purchaseId) => api.get(`/api/checkout/crypto/${purchaseId}`),
};

export const accessApi = {
  get: (token) => api.get(`/api/access/${token}`),
  fileUrl: (token) => `${API_BASE}/api/access/${token}/file`,
};

export const walletApi = {
  summary: () => api.get('/api/wallet/summary'),
  payouts: () => api.get('/api/wallet/payouts'),
  purchases: () => api.get('/api/wallet/purchases'),
  withdraw: (amount, opts = {}) => api.post('/api/wallet/payouts', { amount, ...opts }),
  connectStart: () => api.post('/api/wallet/connect/start'),
  connectRefresh: () => api.post('/api/wallet/connect/refresh'),
};

export const analyticsApi = {
  dashboard: () => api.get('/api/analytics/dashboard'),
  products: () => api.get('/api/analytics/products'),
};

export const notificationsApi = {
  list: () => api.get('/api/notifications'),
  markRead: (ids) => api.post('/api/notifications/read', ids ? { ids } : {}),
};

export const settingsApi = {
  profile: (formData) => api.patchForm('/api/settings/profile', formData),
  password: (currentPassword, newPassword) => api.post('/api/settings/password', { currentPassword, newPassword }),
  cryptoCurrencies: () => api.get('/api/settings/crypto-currencies'),
};
