import { Router } from 'express';
import crypto from 'node:crypto';
import { query, tx } from '../db.js';
import { getStripe } from '../lib/stripe.js';
import { config } from '../config.js';
import { sendPurchaseReceipt, sendSaleNotification } from '../lib/email.js';

export const webhookRouter = Router();

// NOTE: this router must be mounted BEFORE express.json() and use raw body parsing.
webhookRouter.post('/stripe', async (req, res) => {
  if (!config.stripeWebhookSecret) {
    console.warn('STRIPE_WEBHOOK_SECRET not set — rejecting webhook');
    return res.status(500).end();
  }
  const stripe = getStripe();
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, config.stripeWebhookSecret);
  } catch (err) {
    console.warn('Stripe signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      case 'checkout.session.async_payment_succeeded':
        await handleCheckoutCompleted(event.data.object);
        break;
      case 'checkout.session.async_payment_failed':
        await markPurchaseFailed(event.data.object.id);
        break;
      case 'account.updated':
        await handleAccountUpdated(event.data.object);
        break;
      case 'charge.refunded':
        await handleChargeRefunded(event.data.object);
        break;
      default:
        break;
    }
    res.json({ received: true });
  } catch (err) {
    console.error('webhook handler error:', err);
    res.status(500).json({ error: 'handler_failed' });
  }
});

async function handleCheckoutCompleted(session) {
  const sessionId = session.id;
  const paymentIntent = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;
  const buyerEmail = session.customer_details?.email || session.customer_email || null;

  const downloadToken = crypto.randomBytes(24).toString('hex');

  await tx(async (client) => {
    const { rows: existingRows } = await client.query(
      `SELECT pu.*, p.title AS product_title, p.user_id AS seller_id, p.currency
       FROM purchases pu JOIN products p ON p.id = pu.product_id
       WHERE pu.stripe_session_id = $1 FOR UPDATE`,
      [sessionId]
    );
    let row = existingRows[0];

    if (!row) {
      // Fallback: create a purchase from session metadata if we somehow missed the initial record
      const productId = session.metadata?.product_id;
      const sellerId = session.metadata?.seller_id;
      if (!productId) return;
      const { rows: prodRows } = await client.query('SELECT * FROM products WHERE id=$1', [productId]);
      const p = prodRows[0];
      if (!p) return;
      const platformFeeCents = Math.floor(p.price_cents * config.platformFeePct);
      const inserted = await client.query(
        `INSERT INTO purchases (product_id, seller_id, amount_cents, platform_fee_cents, currency, status, stripe_session_id, stripe_payment_intent, buyer_email, download_token, paid_at)
         VALUES ($1,$2,$3,$4,$5,'paid',$6,$7,$8,$9, now())
         ON CONFLICT (stripe_session_id) DO UPDATE SET status='paid', stripe_payment_intent=EXCLUDED.stripe_payment_intent, buyer_email=COALESCE(EXCLUDED.buyer_email, purchases.buyer_email), download_token=COALESCE(purchases.download_token, EXCLUDED.download_token), paid_at=COALESCE(purchases.paid_at, now())
         RETURNING *`,
        [p.id, sellerId || p.user_id, p.price_cents, platformFeeCents, p.currency, sessionId, paymentIntent, buyerEmail, downloadToken]
      );
      row = { ...inserted.rows[0], product_title: p.title, seller_id: p.user_id, currency: p.currency };
    } else if (row.status !== 'paid') {
      const updated = await client.query(
        `UPDATE purchases SET status='paid', stripe_payment_intent=$1, buyer_email=COALESCE(buyer_email, $2), download_token=COALESCE(download_token, $3), paid_at=now()
         WHERE id=$4 RETURNING *`,
        [paymentIntent, buyerEmail, downloadToken, row.id]
      );
      row = { ...updated.rows[0], product_title: row.product_title, seller_id: row.seller_id, currency: row.currency };
    }

    await client.query(
      `INSERT INTO notifications (user_id, type, title, body, meta)
       VALUES ($1, 'sale', $2, $3, $4)`,
      [
        row.seller_id,
        `New sale: ${row.product_title}`,
        `+${(row.amount_cents - row.platform_fee_cents) / 100} ${row.currency}`,
        JSON.stringify({ purchaseId: row.id, productTitle: row.product_title }),
      ]
    );
  });

  // Side-effects outside tx
  const { rows: freshRows } = await query(
    `SELECT pu.*, p.title AS product_title, p.slug AS product_slug, u.email AS seller_email, u.email_notif_sales, u.name AS seller_name
     FROM purchases pu JOIN products p ON p.id = pu.product_id JOIN users u ON u.id = pu.seller_id
     WHERE pu.stripe_session_id = $1`,
    [sessionId]
  );
  const fresh = freshRows[0];
  if (!fresh) return;

  if (fresh.buyer_email && fresh.download_token) {
    const url = `${config.frontendBaseUrl}/product/${fresh.product_slug}?access=${fresh.download_token}`;
    sendPurchaseReceipt({
      to: fresh.buyer_email,
      productTitle: fresh.product_title,
      amount: fresh.amount_cents / 100,
      currency: fresh.currency,
      downloadUrl: url,
    }).catch(() => {});
  }
  if (fresh.email_notif_sales && fresh.seller_email) {
    sendSaleNotification({
      to: fresh.seller_email,
      productTitle: fresh.product_title,
      amount: (fresh.amount_cents - fresh.platform_fee_cents) / 100,
      currency: fresh.currency,
    }).catch(() => {});
  }
}

async function markPurchaseFailed(sessionId) {
  await query("UPDATE purchases SET status='failed' WHERE stripe_session_id=$1 AND status<>'paid'", [sessionId]);
}

async function handleAccountUpdated(account) {
  const onboarded = account.details_submitted && account.charges_enabled && account.payouts_enabled;
  await query(
    'UPDATE users SET stripe_onboarded = $1 WHERE stripe_account_id = $2',
    [!!onboarded, account.id]
  );
}

async function handleChargeRefunded(charge) {
  const pi = charge.payment_intent;
  if (!pi) return;
  await query("UPDATE purchases SET status='refunded' WHERE stripe_payment_intent=$1", [pi]);
}
