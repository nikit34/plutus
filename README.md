# Plutus

Creator commerce — sell digital products (files, links, text) with Stripe Checkout, Stripe Connect payouts, analytics, and email receipts.

## Quick start

```bash
# Backend (Node + Postgres + Stripe + Resend)
cd backend
docker compose up -d                 # Postgres on :5432
cp .env.example .env                 # fill JWT_SECRET, STRIPE_*, RESEND_API_KEY
npm install
npm run migrate
npm run dev                          # :4000

# Frontend (Vite + React) — separate terminal, from repo root
cp .env.example .env.local
npm install
npm run dev                          # :5173
```

Open http://localhost:5173, create an account, create a product, open its public link in an incognito window, and buy with the Stripe test card `4242 4242 4242 4242`.

For the Stripe webhook locally:
```bash
stripe listen --forward-to http://localhost:4000/api/webhooks/stripe
# copy the whsec_... into backend/.env → STRIPE_WEBHOOK_SECRET
```

## Structure

```
backend/    # Express API, Postgres migrations, Stripe + Resend
src/        # React SPA (Vite)
deploy/     # nginx.conf, systemd unit, production README
```

Production deployment for `plutus.firstmessage.ru` is documented in `deploy/README.md`.

## Features

- Email/password auth (JWT)
- Digital products: file / external link / text content, cover image upload
- Public storefront at `/product/:slug`
- Stripe Checkout (with optional custom Stripe Payment Link per product)
- Stripe Connect Express onboarding + payouts
- Webhook-driven purchase recording, one-time/lifetime download tokens
- Resend emails: welcome, purchase receipt with access link, sale notification, payout confirmation
- Wallet: balance, withdraw, payout history
- Dashboard + analytics: today's sales/earnings/views, 7-month trend, per-product stats
- Settings: avatar, social channel, email notification toggles, password change

## Tech

React 19 · Vite 8 · Tailwind 4 · Framer Motion · Express 4 · pg · bcrypt · multer · JWT · Stripe · Resend · Postgres 16
