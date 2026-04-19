import crypto from 'node:crypto';
import { config } from '../config.js';

const PROD_BASE = 'https://api.nowpayments.io/v1';
const SANDBOX_BASE = 'https://api-sandbox.nowpayments.io/v1';

export const SUPPORTED_PAYOUT_CURRENCIES = [
  { code: 'usdttrc20', label: 'USDT (Tron / TRC20)', network: 'TRC20' },
  { code: 'usdterc20', label: 'USDT (Ethereum / ERC20)', network: 'ERC20' },
  { code: 'usdtbsc',   label: 'USDT (BNB Smart Chain / BEP20)', network: 'BEP20' },
  { code: 'usdctrc20', label: 'USDC (Tron / TRC20)', network: 'TRC20' },
  { code: 'btc',       label: 'Bitcoin (BTC)', network: 'Bitcoin' },
  { code: 'eth',       label: 'Ethereum (ETH)', network: 'Ethereum' },
];

const PAYOUT_CODE_SET = new Set(SUPPORTED_PAYOUT_CURRENCIES.map((c) => c.code));
export const isSupportedPayoutCurrency = (code) => PAYOUT_CODE_SET.has(code);

export function hasNowpayments() {
  return !!config.nowpaymentsApiKey;
}

export function hasNowpaymentsPayouts() {
  return !!(config.nowpaymentsApiKey && config.nowpaymentsEmail && config.nowpaymentsPassword);
}

function baseUrl() {
  return config.nowpaymentsSandbox ? SANDBOX_BASE : PROD_BASE;
}

async function call(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${baseUrl()}${path}`, {
    method,
    headers: {
      'x-api-key': config.nowpaymentsApiKey,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  if (!res.ok) {
    const msg = data?.message || data?.error || `HTTP ${res.status}`;
    const err = new Error(`NOWPayments ${path}: ${msg}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export async function createInvoice({
  priceAmount,
  priceCurrency,
  orderId,
  orderDescription,
  ipnCallbackUrl,
  successUrl,
  cancelUrl,
  payCurrency,
}) {
  return call('/invoice', {
    method: 'POST',
    body: {
      price_amount: priceAmount,
      price_currency: priceCurrency,
      order_id: orderId,
      order_description: orderDescription,
      ipn_callback_url: ipnCallbackUrl,
      success_url: successUrl,
      cancel_url: cancelUrl,
      pay_currency: payCurrency,
      is_fixed_rate: true,
      is_fee_paid_by_user: false,
    },
  });
}

// NOWPayments IPN signature = HMAC-SHA512(sorted-JSON-body, IPN_SECRET).
// The body must be stringified with keys sorted alphabetically at every level.
function sortDeep(value) {
  if (Array.isArray(value)) return value.map(sortDeep);
  if (value && typeof value === 'object') {
    const out = {};
    for (const k of Object.keys(value).sort()) out[k] = sortDeep(value[k]);
    return out;
  }
  return value;
}

// --- Payouts (Mass Payouts API) ---
// Payouts require an extra JWT obtained with email+password. The token is valid ~5 minutes,
// so we cache it in-memory.
let jwtCache = { token: null, expiresAt: 0 };

async function getPayoutJwt() {
  const now = Date.now();
  if (jwtCache.token && jwtCache.expiresAt > now + 10_000) return jwtCache.token;
  if (!config.nowpaymentsEmail || !config.nowpaymentsPassword) {
    throw new Error('NOWPAYMENTS_EMAIL / NOWPAYMENTS_PASSWORD not configured');
  }
  const res = await fetch(`${baseUrl()}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: config.nowpaymentsEmail, password: config.nowpaymentsPassword }),
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  if (!res.ok || !data?.token) {
    throw new Error(`NOWPayments /auth failed: ${data?.message || data?.error || res.status}`);
  }
  jwtCache = { token: data.token, expiresAt: now + 4 * 60 * 1000 };
  return data.token;
}

async function authedCall(path, { method = 'GET', body } = {}) {
  const token = await getPayoutJwt();
  const res = await fetch(`${baseUrl()}${path}`, {
    method,
    headers: {
      'x-api-key': config.nowpaymentsApiKey,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  if (!res.ok) {
    const msg = data?.message || data?.error || `HTTP ${res.status}`;
    const err = new Error(`NOWPayments ${path}: ${msg}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export async function createPayout({ address, currency, amount, ipnCallbackUrl }) {
  return authedCall('/payout', {
    method: 'POST',
    body: {
      ipn_callback_url: ipnCallbackUrl,
      withdrawals: [
        {
          address,
          currency,
          amount: Number(amount),
        },
      ],
    },
  });
}

export function verifyIpnSignature(rawBody, signatureHex) {
  if (!config.nowpaymentsIpnSecret) return false;
  if (!signatureHex) return false;
  let parsed;
  try {
    parsed = typeof rawBody === 'string' ? JSON.parse(rawBody) : JSON.parse(Buffer.from(rawBody).toString('utf8'));
  } catch {
    return false;
  }
  const sorted = JSON.stringify(sortDeep(parsed));
  const hmac = crypto.createHmac('sha512', config.nowpaymentsIpnSecret).update(sorted).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(hmac, 'hex'), Buffer.from(signatureHex, 'hex'));
  } catch {
    return false;
  }
}
