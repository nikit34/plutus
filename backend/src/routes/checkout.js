import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db.js';
import { HttpError } from '../middleware/error.js';
import { getStripe, hasStripe } from '../lib/stripe.js';
import { config } from '../config.js';

export const checkoutRouter = Router();

const bodySchema = z.object({
  email: z.string().email().optional(),
});

checkoutRouter.post('/:slug', async (req, res, next) => {
  try {
    if (!hasStripe()) throw new HttpError(500, 'stripe_not_configured', 'Stripe keys not set on server');
    const body = bodySchema.parse(req.body || {});

    const { rows } = await query(
      `SELECT p.*, u.stripe_account_id, u.email AS seller_email, u.name AS seller_name
       FROM products p JOIN users u ON u.id = p.user_id
       WHERE p.slug = $1 AND p.status = 'active'`,
      [req.params.slug]
    );
    const product = rows[0];
    if (!product) throw new HttpError(404, 'not_found');

    // If seller supplied a Stripe Payment Link, just return it (frontend will redirect)
    if (product.stripe_payment_link) {
      return res.json({ paymentLinkUrl: product.stripe_payment_link });
    }

    const stripe = getStripe();
    const successUrl = `${config.frontendBaseUrl}/product/${product.slug}?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${config.frontendBaseUrl}/product/${product.slug}?canceled=1`;
    const platformFeeCents = Math.floor(product.price_cents * config.platformFeePct);

    const params = {
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: String(product.currency).toLowerCase(),
          product_data: { name: product.title, description: product.description?.slice(0, 200) || undefined },
          unit_amount: product.price_cents,
        },
        quantity: 1,
      }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: body.email || undefined,
      metadata: {
        product_id: String(product.id),
        seller_id: String(product.user_id),
      },
    };

    // If the seller has Connect onboarded, route the charge through their account
    if (product.stripe_account_id) {
      params.payment_intent_data = {
        application_fee_amount: platformFeeCents,
        transfer_data: { destination: product.stripe_account_id },
      };
    }

    const session = await stripe.checkout.sessions.create(params);

    // Record pending purchase
    await query(
      `INSERT INTO purchases (product_id, seller_id, amount_cents, platform_fee_cents, currency, status, stripe_session_id, buyer_email)
       VALUES ($1,$2,$3,$4,$5,'pending',$6,$7)
       ON CONFLICT (stripe_session_id) DO NOTHING`,
      [product.id, product.user_id, product.price_cents, platformFeeCents, product.currency, session.id, body.email || null]
    );

    res.json({ checkoutUrl: session.url, sessionId: session.id });
  } catch (err) { next(err); }
});

// Poll-based: after Stripe redirects buyer back with session_id, frontend asks us for purchase status.
checkoutRouter.get('/session/:id', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT pu.*, p.slug AS product_slug, p.title AS product_title
       FROM purchases pu JOIN products p ON p.id = pu.product_id
       WHERE pu.stripe_session_id = $1`,
      [req.params.id]
    );
    const row = rows[0];
    if (!row) return res.status(404).json({ error: 'not_found' });
    res.json({
      status: row.status,
      productSlug: row.product_slug,
      productTitle: row.product_title,
      downloadToken: row.download_token,
    });
  } catch (err) { next(err); }
});
