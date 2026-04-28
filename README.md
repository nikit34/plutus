# Plutus — open-source creator commerce platform

[![License: MIT](https://img.shields.io/badge/license-MIT-22c55e.svg)](LICENSE)
[![Stars](https://img.shields.io/github/stars/nikit34/plutus?style=flat&color=facc15)](https://github.com/nikit34/plutus/stargazers)
[![Live demo](https://img.shields.io/badge/demo-plutus.firstmessage.ru-a78bfa)](https://plutus.firstmessage.ru)
[![Stack](https://img.shields.io/badge/stack-React%2019%20%C2%B7%20Node%20%C2%B7%20Postgres%2016-0ea5e9)](#tech-stack)

![Plutus product page](product-page.png)

> **Plutus is an open-source, self-hostable creator commerce platform that lets digital creators sell files, external links, and text-based products via Stripe Checkout, with Stripe Connect Express payouts, transactional email, and a built-in analytics dashboard.** It's a self-hosted alternative to Gumroad, Patreon, Lemon Squeezy and Stan Store — you keep your data, your domain, and 100% of revenue minus Stripe's processing fees.

**Live demo:** [plutus.firstmessage.ru](https://plutus.firstmessage.ru)
**Repository:** [github.com/nikit34/plutus](https://github.com/nikit34/plutus)
**License:** MIT

## Why Plutus

- **Own your platform.** Self-host on any Node + Postgres machine. No platform fee, no account-suspension risk.
- **Real Stripe integration.** Stripe Checkout for buyers, Stripe Connect Express for seller payouts — not a redirect to a generic payment link.
- **Three product types out of the box.** Sell a downloadable **file**, an **external link** (Notion, Telegram, Google Drive, anything URL-addressable), or **text** content delivered after purchase.
- **Email built in.** Resend transactional emails for welcome, purchase receipt with access link, sale notifications, and payout confirmations.
- **Production-tested.** The reference deployment runs at [plutus.firstmessage.ru](https://plutus.firstmessage.ru) with nginx + systemd configs in [`deploy/`](deploy/).

## How Plutus compares

| | **Plutus** | Gumroad | Lemon Squeezy | Stan Store |
|---|---|---|---|---|
| Source available | ✅ MIT | ❌ | ❌ | ❌ |
| Self-host | ✅ | ❌ | ❌ | ❌ |
| Own your data & customer list | ✅ | ⚠️ | ⚠️ | ⚠️ |
| Platform take rate | **0%** (Stripe fees only) | 10% | 5% + $0.50 | Monthly subscription |
| Stripe Connect payouts | ✅ native | n/a | n/a | n/a |
| Custom domain | ✅ free | paid plans | paid plans | paid plans |
| Digital file / link / text products | ✅ | ✅ | ✅ | ✅ |
| Email receipts & sale alerts | ✅ Resend | ✅ | ✅ | ✅ |

Comparison content for individual competitors lives at:
[vs Gumroad](https://plutus.firstmessage.ru/vs/gumroad) ·
[vs Patreon](https://plutus.firstmessage.ru/vs/patreon) ·
[vs Stan Store](https://plutus.firstmessage.ru/vs/stan-store) ·
[vs Stripe Payment Links](https://plutus.firstmessage.ru/vs/stripe-payment-links) ·
[vs Boosty](https://plutus.firstmessage.ru/vs/boosty) ·
[vs Etsy Digital](https://plutus.firstmessage.ru/vs/etsy-digital).

## Features

- **Auth** — email/password with JWT.
- **Products** — file upload, external link, or text content; cover image; per-product pricing; optional custom Stripe Payment Link.
- **Storefront** — public product page at `/product/:slug`.
- **Checkout** — Stripe Checkout (cards, Apple Pay, Google Pay, Link).
- **Payouts** — Stripe Connect Express onboarding; payouts go directly to seller's connected account.
- **Webhooks** — purchase recording, one-time and lifetime download tokens.
- **Email** — Resend templates for welcome, purchase receipt with access link, sale notification, payout confirmation.
- **Wallet** — balance, withdraw, payout history.
- **Analytics** — today's sales / earnings / views, 7-month trend, per-product stats.
- **Settings** — avatar, social channel link, email notification toggles, password change.

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

Open `http://localhost:5173`, create an account, create a product, open its public link in an incognito window, and buy with the Stripe test card `4242 4242 4242 4242`.

For the Stripe webhook locally:

```bash
stripe listen --forward-to http://localhost:4000/api/webhooks/stripe
# copy the whsec_... into backend/.env → STRIPE_WEBHOOK_SECRET
```

## Project structure

```
backend/    # Express API, Postgres migrations, Stripe + Resend
src/        # React SPA (Vite)
public/     # Static SEO landing pages, sitemap, robots
deploy/     # nginx.conf, systemd unit, production README
```

Production deployment for `plutus.firstmessage.ru` is documented in [`deploy/README.md`](deploy/README.md).

## Tech stack

**Frontend:** React 19 · Vite 8 · Tailwind CSS 4 · Framer Motion
**Backend:** Node.js · Express 4 · pg · bcrypt · multer · JSON Web Tokens
**Infra:** PostgreSQL 16 · Stripe (Checkout + Connect Express) · Resend · nginx · systemd

## FAQ

### What is Plutus?
Plutus is an open-source, self-hostable creator commerce platform. Digital creators use it to sell files, external links, or text-based digital products through Stripe Checkout, while payouts to sellers go through Stripe Connect Express. It's a code-first alternative to Gumroad, Patreon, Lemon Squeezy and Stan Store.

### Is Plutus free?
The software is MIT-licensed and free to self-host. The only fees you pay are Stripe's standard processing fees — Plutus itself takes 0%.

### How is Plutus different from Gumroad?
Gumroad is a hosted SaaS that takes a 10% flat fee on every sale and owns the buyer relationship. Plutus is self-hosted: you run it on your own server, you own the customer database, you set the policies, and you pay only Stripe's processing fees.

### How is Plutus different from a Stripe Payment Link?
A Stripe Payment Link is a single checkout URL — no storefront, no buyer account, no automated digital delivery, no analytics dashboard, no seller payout split. Plutus wraps Stripe with the storefront, delivery (file/link/text), buyer-side download tokens, seller-side wallet, and analytics.

### What payment methods does Plutus support?
Anything supported by Stripe Checkout: cards, Apple Pay, Google Pay, Link, and locale-specific methods that Stripe enables for the connected account.

### How are seller payouts handled?
Through **Stripe Connect Express**. Each seller onboards a connected Stripe account; payouts land directly there on Stripe's normal payout schedule. Plutus does not custody funds.

### Can I sell physical products?
Plutus is built for **digital** products — files, external links (Notion pages, Telegram channels, Drive folders), and text. For physical goods, use Stripe's standard Checkout features outside this platform.

### What database does Plutus use?
PostgreSQL 16. Local development uses Docker Compose; production uses any managed or self-hosted Postgres.

### Where can I deploy Plutus?
Anywhere you can run Node.js and Postgres — bare metal, VPS, AWS, GCP, Hetzner, Fly.io. The `deploy/` folder ships an nginx site config and a systemd unit for Linux.

### Is Plutus production-ready?
The reference deployment runs at [plutus.firstmessage.ru](https://plutus.firstmessage.ru). The license is MIT — there is no warranty, run your own load and security review before taking real payments.

### Who built Plutus?
[Nikita Permyakov](https://github.com/nikit34) (`@nikit34`).

## Contributing

Issues and pull requests are welcome. For substantial changes, open an issue first to discuss the direction.

## License

[MIT](LICENSE) © 2026 Nikita Permyakov.
