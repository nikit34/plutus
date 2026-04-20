import crypto from 'node:crypto';
import { config } from '../config.js';

export const PROVIDERS = {
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userinfoUrl: 'https://openidconnect.googleapis.com/v1/userinfo',
    scope: 'openid email profile',
    hasEmail: true,
    clientId: () => config.oauthGoogleClientId,
    clientSecret: () => config.oauthGoogleClientSecret,
  },
  x: {
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    userinfoUrl: 'https://api.twitter.com/2/users/me',
    scope: 'tweet.read users.read offline.access',
    hasEmail: false,
    clientId: () => config.oauthXClientId,
    clientSecret: () => config.oauthXClientSecret,
  },
};

export function isProviderConfigured(name) {
  const p = PROVIDERS[name];
  return !!(p && p.clientId() && p.clientSecret());
}

export function redirectUri(providerName) {
  return `${config.apiBaseUrl}/api/auth/oauth/${providerName}/callback`;
}

// PKCE helpers
export function generatePkce() {
  const verifier = crypto.randomBytes(48).toString('base64url');
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
  return { verifier, challenge };
}

// Signed, short-lived state payload. No extra dep — HMAC-signed base64url JSON.
const STATE_TTL_MS = 10 * 60 * 1000;

export function signState(payload) {
  const full = { ...payload, exp: Date.now() + STATE_TTL_MS };
  const body = Buffer.from(JSON.stringify(full)).toString('base64url');
  const sig = crypto.createHmac('sha256', config.jwtSecret).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function verifyState(token) {
  if (!token || typeof token !== 'string') return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = crypto.createHmac('sha256', config.jwtSecret).update(body).digest('base64url');
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return null;
  let payload;
  try { payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')); } catch { return null; }
  if (!payload.exp || payload.exp < Date.now()) return null;
  return payload;
}

export async function exchangeCodeForToken(providerName, code, codeVerifier) {
  const p = PROVIDERS[providerName];
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri(providerName),
    code_verifier: codeVerifier,
    client_id: p.clientId(),
  });

  const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  // X requires Basic auth with client_id:client_secret (confidential client)
  if (providerName === 'x') {
    const basic = Buffer.from(`${p.clientId()}:${p.clientSecret()}`).toString('base64');
    headers.Authorization = `Basic ${basic}`;
  } else {
    body.append('client_secret', p.clientSecret());
  }

  const res = await fetch(p.tokenUrl, { method: 'POST', headers, body });
  const text = await res.text();
  let data; try { data = JSON.parse(text); } catch { data = { raw: text }; }
  if (!res.ok || !data.access_token) {
    throw new Error(`Token exchange failed (${providerName}): ${data.error_description || data.error || res.status}`);
  }
  return data;
}

export async function fetchUserInfo(providerName, accessToken) {
  const p = PROVIDERS[providerName];
  const url = providerName === 'x'
    ? `${p.userinfoUrl}?user.fields=id,name,username,profile_image_url`
    : p.userinfoUrl;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const text = await res.text();
  let data; try { data = JSON.parse(text); } catch { data = { raw: text }; }
  if (!res.ok) throw new Error(`Userinfo failed (${providerName}): ${data.error?.message || res.status}`);

  // Normalize
  if (providerName === 'google') {
    return {
      subject: String(data.sub),
      email: data.email || null,
      name: data.name || '',
      avatar: data.picture || null,
    };
  }
  if (providerName === 'x') {
    const d = data.data || {};
    return {
      subject: String(d.id),
      email: null, // X OAuth 2.0 doesn't return email
      name: d.name || d.username || '',
      username: d.username || '',
      avatar: d.profile_image_url || null,
    };
  }
  throw new Error(`Unknown provider: ${providerName}`);
}
