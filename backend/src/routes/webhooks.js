import { Router } from 'express';
import crypto from 'node:crypto';
import { query, tx } from '../db.js';
import { getStripe } from '../lib/stripe.js';
import { verifyIpnSignature } from '../lib/nowpayments.js';
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

// --- NOWPayments IPN ---
webhookRouter.post('/nowpayments', async (req, res) => {
  if (!config.nowpaymentsIpnSecret) {
    console.warn('NOWPAYMENTS_IPN_SECRET not set — rejecting IPN');
    return res.status(500).end();
  }
  const signature = req.headers['x-nowpayments-sig'];
  if (!verifyIpnSignature(req.body, signature)) {
    console.warn('NOWPayments signature verification failed');
    return res.status(400).send('bad signature');
  }
  let event;
  try {
    event = JSON.parse(Buffer.from(req.body).toString('utf8'));
  } catch {
    return res.status(400).send('bad json');
  }

  try {
    await handleNowpaymentsIpn(event);
    res.json({ received: true });
  } catch (err) {
    console.error('NOWPayments handler error:', err);
    res.status(500).json({ error: 'handler_failed' });
  }
});

async function handleNowpaymentsIpn(event) {
  // Payout IPN has a `status` + `withdrawal_id`/`batch_withdrawal_id` but no `payment_status`.
  if (!event.payment_status && (event.withdrawal_id || event.batch_withdrawal_id || event.hash)) {
    await handleNowpaymentsPayoutIpn(event);
    return;
  }

  const status = event.payment_status;
  const invoiceId = event.invoice_id ? String(event.invoice_id) : null;
  const paymentId = event.payment_id ? String(event.payment_id) : null;
  const orderId = event.order_id || '';

  // Locate purchase: prefer invoice_id, fallback to order_id `plutus-<id>`
  let purchaseRow;
  if (invoiceId) {
    const { rows } = await query(
      `SELECT pu.*, p.title AS product_title, p.slug AS product_slug
       FROM purchases pu JOIN products p ON p.id = pu.product_id
       WHERE pu.nowpayments_invoice_id = $1`,
      [invoiceId]
    );
    purchaseRow = rows[0];
  }
  if (!purchaseRow && orderId.startsWith('plutus-')) {
    const pid = Number(orderId.slice(7));
    if (Number.isFinite(pid)) {
      const { rows } = await query(
        `SELECT pu.*, p.title AS product_title, p.slug AS product_slug
         FROM purchases pu JOIN products p ON p.id = pu.product_id
         WHERE pu.id = $1`,
        [pid]
      );
      purchaseRow = rows[0];
    }
  }
  if (!purchaseRow) {
    console.warn('NOWPayments IPN: purchase not found', { invoiceId, orderId });
    return;
  }

  // Terminal states
  if (status === 'finished' || status === 'confirmed') {
    await markNowpaymentsPaid(purchaseRow, paymentId);
  } else if (status === 'failed' || status === 'expired' || status === 'refunded') {
    const next = status === 'refunded' ? 'refunded' : 'failed';
    await query(
      `UPDATE purchases SET status=$1, nowpayments_payment_id=COALESCE(nowpayments_payment_id,$2) WHERE id=$3 AND status<>'paid'`,
      [next, paymentId, purchaseRow.id]
    );
  } else {
    // partially_paid / waiting / sending / confirming — just update payment_id
    await query(
      `UPDATE purchases SET nowpayments_payment_id=COALESCE(nowpayments_payment_id,$1) WHERE id=$2`,
      [paymentId, purchaseRow.id]
    );
  }
}

async function handleNowpaymentsPayoutIpn(event) {
  const withdrawalId = event.withdrawal_id ? String(event.withdrawal_id) : (event.id ? String(event.id) : null);
  const batchId = event.batch_withdrawal_id ? String(event.batch_withdrawal_id) : null;
  const rawStatus = String(event.status || '').toUpperCase();

  // NOWPayments withdrawal statuses: WAITING, PROCESSING, SENDING, FINISHED, FAILED, REJECTED, EXPIRED
  let next;
  if (rawStatus === 'FINISHED') next = 'paid';
  else if (['FAILED', 'REJECTED', 'EXPIRED'].includes(rawStatus)) next = 'failed';
  else next = 'processing';

  let where = '';
  const params = [];
  if (withdrawalId) {
    params.push(withdrawalId);
    where = `nowpayments_withdrawal_id = $${params.length}`;
  } else if (batchId) {
    params.push(batchId);
    where = `nowpayments_batch_id = $${params.length}`;
  } else {
    console.warn('NOWPayments payout IPN: no withdrawal id');
    return;
  }

  const { rows } = await query(`SELECT * FROM payouts WHERE ${where}`, params);
  const row = rows[0];
  if (!row) {
    console.warn('NOWPayments payout IPN: payout not found', { withdrawalId, batchId });
    return;
  }
  if (row.status === 'paid') return;

  await query(
    `UPDATE payouts SET status=$1, paid_at = CASE WHEN $1='paid' THEN now() ELSE paid_at END,
            failure_reason = CASE WHEN $1='failed' THEN $2 ELSE failure_reason END
     WHERE id=$3`,
    [next, event.reject_reason || event.error || null, row.id]
  );

  if (next === 'paid') {
    await query(
      `INSERT INTO notifications (user_id, type, title, body, meta)
       VALUES ($1,'payout','Crypto payout completed',$2,$3)`,
      [row.user_id, `${row.amount_cents / 100} ${row.currency} → ${(row.crypto_currency || '').toUpperCase()}`, JSON.stringify({ payoutId: row.id, provider: 'nowpayments' })]
    );
  } else if (next === 'failed') {
    await query(
      `INSERT INTO notifications (user_id, type, title, body, meta)
       VALUES ($1,'payout','Crypto payout failed',$2,$3)`,
      [row.user_id, event.reject_reason || event.error || 'Payout rejected', JSON.stringify({ payoutId: row.id, provider: 'nowpayments' })]
    );
  }
}

async function markNowpaymentsPaid(row, paymentId) {
  if (row.status === 'paid') return;
  const downloadToken = row.download_token || crypto.randomBytes(24).toString('hex');

  await tx(async (client) => {
    await client.query(
      `UPDATE purchases SET status='paid', nowpayments_payment_id=COALESCE(nowpayments_payment_id,$1),
              download_token=COALESCE(download_token,$2), paid_at=COALESCE(paid_at, now())
       WHERE id=$3`,
      [paymentId, downloadToken, row.id]
    );
    await client.query(
      `INSERT INTO notifications (user_id, type, title, body, meta)
       VALUES ($1,'sale',$2,$3,$4)`,
      [
        row.seller_id,
        `New sale: ${row.product_title}`,
        `+${(row.amount_cents - row.platform_fee_cents) / 100} ${row.currency} (crypto)`,
        JSON.stringify({ purchaseId: row.id, productTitle: row.product_title, provider: 'nowpayments' }),
      ]
    );
  });

  const { rows: freshRows } = await query(
    `SELECT pu.*, p.title AS product_title, p.slug AS product_slug, u.email AS seller_email,
            u.email_notif_sales, u.name AS seller_name
     FROM purchases pu JOIN products p ON p.id = pu.product_id JOIN users u ON u.id = pu.seller_id
     WHERE pu.id = $1`,
    [row.id]
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
