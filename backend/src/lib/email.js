import { Resend } from 'resend';
import { config } from '../config.js';

let client = null;

function getClient() {
  if (!config.resendApiKey) return null;
  if (!client) client = new Resend(config.resendApiKey);
  return client;
}

async function send({ to, subject, html }) {
  const c = getClient();
  if (!c) {
    console.log(`[email:stub] to=${to} subject="${subject}"`);
    return { id: 'stub' };
  }
  try {
    const { data, error } = await c.emails.send({ from: config.emailFrom, to, subject, html });
    if (error) {
      console.warn('Resend error:', error);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Resend threw:', err.message);
    return null;
  }
}

const layout = (inner) => `<!doctype html>
<html><body style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;background:#0a0a0f;color:#fafafa;padding:32px">
<div style="max-width:520px;margin:0 auto;background:#121221;border:1px solid #23233a;border-radius:16px;padding:32px">
<div style="font-size:20px;font-weight:600;color:#E2B94B;margin-bottom:24px">Plutus</div>
${inner}
<div style="font-size:11px;color:#666;margin-top:32px;border-top:1px solid #23233a;padding-top:16px">Plutus · Creator commerce</div>
</div></body></html>`;

export function sendWelcome({ to, name }) {
  return send({
    to,
    subject: 'Welcome to Plutus',
    html: layout(`<h2 style="margin:0 0 12px">Hey ${escapeHtml(name || 'creator')},</h2>
<p>Your Plutus account is ready. Create your first digital product, share the link and start selling.</p>`),
  });
}

export function sendPurchaseReceipt({ to, productTitle, amount, currency, downloadUrl }) {
  const priceStr = new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount);
  return send({
    to,
    subject: `Your purchase: ${productTitle}`,
    html: layout(`<h2 style="margin:0 0 12px">Thanks for your purchase!</h2>
<p><strong>${escapeHtml(productTitle)}</strong> — ${priceStr}</p>
<p><a href="${downloadUrl}" style="display:inline-block;padding:12px 24px;background:#E2B94B;color:#0a0a0f;text-decoration:none;border-radius:10px;font-weight:600">Access your content</a></p>
<p style="font-size:12px;color:#999">This link gives you lifetime access. Bookmark it.</p>`),
  });
}

export function sendSaleNotification({ to, productTitle, amount, currency }) {
  const priceStr = new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount);
  return send({
    to,
    subject: `New sale: ${productTitle} (+${priceStr})`,
    html: layout(`<h2 style="margin:0 0 12px">You just made a sale 🎉</h2>
<p><strong>${escapeHtml(productTitle)}</strong></p>
<p style="font-size:28px;color:#E2B94B;font-weight:700;margin:16px 0">${priceStr}</p>`),
  });
}

export function sendPayoutConfirmation({ to, amount, currency }) {
  const priceStr = new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount);
  return send({
    to,
    subject: `Payout sent: ${priceStr}`,
    html: layout(`<h2 style="margin:0 0 12px">Your payout is on its way</h2>
<p>${priceStr} will arrive in your bank account within 1–2 business days.</p>`),
  });
}

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
