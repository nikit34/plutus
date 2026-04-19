import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { HttpError } from '../middleware/error.js';
import { getStripe, hasStripe } from '../lib/stripe.js';
import { createPayout as createCryptoPayout, hasNowpaymentsPayouts, isSupportedPayoutCurrency } from '../lib/nowpayments.js';
import { serializePayout, serializePurchase } from '../lib/serialize.js';
import { config } from '../config.js';
import { sendPayoutConfirmation } from '../lib/email.js';

export const walletRouter = Router();

walletRouter.get('/summary', requireAuth, async (req, res, next) => {
  try {
    const [earnings, paidOut, pending] = await Promise.all([
      query(
        `SELECT COALESCE(SUM(amount_cents - platform_fee_cents), 0)::bigint AS net_cents,
                COALESCE(SUM(amount_cents), 0)::bigint AS gross_cents,
                COALESCE(SUM(platform_fee_cents), 0)::bigint AS fee_cents,
                COUNT(*)::int AS count
         FROM purchases WHERE seller_id=$1 AND status='paid'`,
        [req.user.id]
      ),
      query(
        `SELECT COALESCE(SUM(amount_cents),0)::bigint AS paid_cents, COUNT(*)::int AS count
         FROM payouts WHERE user_id=$1 AND status='paid'`,
        [req.user.id]
      ),
      query(
        `SELECT COALESCE(SUM(amount_cents),0)::bigint AS pending_cents FROM payouts WHERE user_id=$1 AND status IN ('pending','processing')`,
        [req.user.id]
      ),
    ]);
    const netEarned = Number(earnings.rows[0].net_cents);
    const grossEarned = Number(earnings.rows[0].gross_cents);
    const platformFee = Number(earnings.rows[0].fee_cents);
    const paidOutCents = Number(paidOut.rows[0].paid_cents);
    const pendingCents = Number(pending.rows[0].pending_cents);
    const availableCents = Math.max(0, netEarned - paidOutCents - pendingCents);
    res.json({
      currency: 'USD',
      totalEarnings: netEarned / 100,
      grossEarnings: grossEarned / 100,
      platformFee: platformFee / 100,
      totalSales: earnings.rows[0].count,
      paidOut: paidOutCents / 100,
      pending: pendingCents / 100,
      available: availableCents / 100,
      payoutsCount: paidOut.rows[0].count,
      stripeConnected: !!req.user.stripe_onboarded,
    });
  } catch (err) { next(err); }
});

walletRouter.get('/payouts', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT * FROM payouts WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50`,
      [req.user.id]
    );
    res.json({ payouts: rows.map(serializePayout) });
  } catch (err) { next(err); }
});

walletRouter.get('/purchases', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT pu.*, p.title AS product_title
       FROM purchases pu JOIN products p ON p.id = pu.product_id
       WHERE pu.seller_id=$1 AND pu.status='paid'
       ORDER BY pu.paid_at DESC LIMIT 100`,
      [req.user.id]
    );
    res.json({ purchases: rows.map(serializePurchase) });
  } catch (err) { next(err); }
});

// --- Stripe Connect onboarding ---
walletRouter.post('/connect/start', requireAuth, async (req, res, next) => {
  try {
    if (!hasStripe()) throw new HttpError(500, 'stripe_not_configured');
    const stripe = getStripe();
    let accountId = req.user.stripe_account_id;
    if (!accountId) {
      const acc = await stripe.accounts.create({
        type: 'express',
        email: req.user.email,
        capabilities: {
          transfers: { requested: true },
          card_payments: { requested: true },
        },
      });
      accountId = acc.id;
      await query('UPDATE users SET stripe_account_id=$1, updated_at=now() WHERE id=$2', [accountId, req.user.id]);
    }
    const link = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${config.frontendBaseUrl}/wallet?connect=refresh`,
      return_url: `${config.frontendBaseUrl}/wallet?connect=done`,
      type: 'account_onboarding',
    });
    res.json({ url: link.url, accountId });
  } catch (err) { next(err); }
});

walletRouter.post('/connect/refresh', requireAuth, async (req, res, next) => {
  try {
    if (!hasStripe() || !req.user.stripe_account_id) return res.json({ stripeConnected: !!req.user.stripe_onboarded });
    const stripe = getStripe();
    const acc = await stripe.accounts.retrieve(req.user.stripe_account_id);
    const onboarded = acc.details_submitted && acc.charges_enabled && acc.payouts_enabled;
    await query('UPDATE users SET stripe_onboarded=$1 WHERE id=$2', [!!onboarded, req.user.id]);
    res.json({ stripeConnected: !!onboarded });
  } catch (err) { next(err); }
});

// --- Payout ---
const payoutSchema = z.object({
  amount: z.union([z.number(), z.string()]).transform((v) => Number(v)).refine((v) => Number.isFinite(v) && v > 0, 'invalid amount'),
  method: z.enum(['stripe', 'crypto']).optional().default('stripe'),
  cryptoAddress: z.string().trim().max(200).optional(),
  cryptoCurrency: z.string().trim().toLowerCase().optional(),
});

walletRouter.post('/payouts', requireAuth, async (req, res, next) => {
  try {
    const body = payoutSchema.parse(req.body);
    const { amount, method } = body;
    const amountCents = Math.round(amount * 100);

    // Recalculate available
    const { rows: summary } = await query(
      `SELECT
         COALESCE((SELECT SUM(amount_cents - platform_fee_cents) FROM purchases WHERE seller_id=$1 AND status='paid'),0) AS net_cents,
         COALESCE((SELECT SUM(amount_cents) FROM payouts WHERE user_id=$1 AND status IN ('pending','processing','paid')),0) AS used_cents`,
      [req.user.id]
    );
    const available = Number(summary[0].net_cents) - Number(summary[0].used_cents);
    if (amountCents > available) throw new HttpError(400, 'insufficient_funds', 'Not enough available balance');

    let status = 'pending';
    let methodLabel = 'Bank account';
    let failureReason = null;
    let stripePayoutId = null;
    let cryptoAddress = null;
    let cryptoCurrency = null;
    let nowpaymentsWithdrawalId = null;
    let nowpaymentsBatchId = null;

    if (method === 'crypto') {
      cryptoAddress = body.cryptoAddress || req.user.crypto_address;
      cryptoCurrency = (body.cryptoCurrency || req.user.crypto_currency || '').toLowerCase();
      if (!cryptoAddress || !cryptoCurrency) {
        throw new HttpError(400, 'crypto_not_configured', 'Set a crypto address and currency in Settings first');
      }
      if (!isSupportedPayoutCurrency(cryptoCurrency)) {
        throw new HttpError(400, 'unsupported_currency', `${cryptoCurrency} is not supported`);
      }
      if (!hasNowpaymentsPayouts()) {
        throw new HttpError(500, 'crypto_payouts_not_configured', 'NOWPAYMENTS_EMAIL/PASSWORD not set on server');
      }
      try {
        const ipnCallbackUrl = `${config.apiBaseUrl}/api/webhooks/nowpayments`;
        // Amount sent is in the target crypto currency. For stablecoins (USDT/USDC) we can use the USD amount directly.
        const cryptoAmount = amount;
        const payout = await createCryptoPayout({
          address: cryptoAddress,
          currency: cryptoCurrency,
          amount: cryptoAmount,
          ipnCallbackUrl,
        });
        const wd = payout?.withdrawals?.[0] || {};
        nowpaymentsWithdrawalId = wd.id ? String(wd.id) : null;
        nowpaymentsBatchId = payout?.id ? String(payout.id) : null;
        status = 'processing';
        methodLabel = `Crypto (${cryptoCurrency.toUpperCase()})`;
      } catch (err) {
        console.warn('NOWPayments payout failed:', err.message);
        status = 'failed';
        failureReason = err.message;
        methodLabel = `Crypto (${cryptoCurrency.toUpperCase()})`;
      }
    } else {
      const useStripe = hasStripe() && req.user.stripe_onboarded && req.user.stripe_account_id;
      if (useStripe) {
        try {
          const stripe = getStripe();
          const payout = await stripe.payouts.create(
            { amount: amountCents, currency: 'usd' },
            { stripeAccount: req.user.stripe_account_id }
          );
          stripePayoutId = payout.id;
          status = payout.status === 'paid' ? 'paid' : 'processing';
        } catch (err) {
          console.warn('Stripe payout failed:', err.message);
          status = 'failed';
          failureReason = err.message;
        }
      } else {
        status = 'processing';
        methodLabel = 'Manual';
      }
    }

    const { rows } = await query(
      `INSERT INTO payouts (user_id, amount_cents, currency, status, stripe_payout_id, method, method_label, crypto_address, crypto_currency, nowpayments_withdrawal_id, nowpayments_batch_id, failure_reason, paid_at)
       VALUES ($1,$2,'USD',$3,$4,$5,$6,$7,$8,$9,$10,$11, CASE WHEN $3='paid' THEN now() ELSE NULL END)
       RETURNING *`,
      [req.user.id, amountCents, status, stripePayoutId, method, methodLabel, cryptoAddress, cryptoCurrency, nowpaymentsWithdrawalId, nowpaymentsBatchId, failureReason]
    );

    await query(
      `INSERT INTO notifications (user_id, type, title, body, meta)
       VALUES ($1,'payout',$2,$3,$4)`,
      [
        req.user.id,
        status === 'failed' ? 'Payout failed' : 'Payout initiated',
        status === 'failed' ? failureReason : `$${amount} is on its way`,
        JSON.stringify({ payoutId: rows[0].id, amount: amountCents, status }),
      ]
    );

    if (status !== 'failed' && req.user.email_notif_payouts) {
      sendPayoutConfirmation({ to: req.user.email, amount, currency: 'USD' }).catch(() => {});
    }

    res.status(201).json({ payout: serializePayout(rows[0]) });
  } catch (err) { next(err); }
});
