# Plutus — deployment guide

End-to-end setup to run Plutus on a single server at `plutus.firstmessage.ru`.
Stack: Node 20, Postgres 16, nginx, Stripe (test mode), Resend.

---

## 0. Prerequisites

- Server reachable at `plutus.firstmessage.ru` (A/AAAA record configured).
- Stripe account — test mode API keys.
- Resend account + verified sender domain.
- Docker (optional, for Postgres) OR a native Postgres 16 install.

---

## 1. Local development (your computer)

```bash
# 1. Start Postgres
cd backend
docker compose up -d

# 2. Configure
cp .env.example .env
# Edit .env — set JWT_SECRET (random), STRIPE_SECRET_KEY, RESEND_API_KEY

# 3. Install + migrate
npm install
npm run migrate

# 4. Start API
npm run dev
# -> listening on :4000

# 5. Frontend (separate terminal, from repo root)
npm install
echo "VITE_API_BASE_URL=http://localhost:4000" > .env.local
npm run dev
# -> http://localhost:5173
```

### Stripe webhook locally

```bash
# Install Stripe CLI (once)
stripe login

# Forward events to your local backend
stripe listen --forward-to http://localhost:4000/api/webhooks/stripe
# Copy the "whsec_..." signing secret into backend/.env → STRIPE_WEBHOOK_SECRET
```

Trigger a fake purchase:
```bash
stripe trigger checkout.session.completed
```

---

## 2. Production deploy (plutus.firstmessage.ru)

### 2.1. Provision

```bash
sudo apt update && sudo apt install -y nodejs npm postgresql-16 nginx certbot python3-certbot-nginx
sudo adduser --system --group --home /opt/plutus plutus
```

### 2.2. Postgres

```bash
sudo -u postgres psql <<SQL
CREATE USER plutus WITH PASSWORD 'CHANGE_ME_STRONG_PASSWORD';
CREATE DATABASE plutus OWNER plutus;
SQL
```

### 2.3. Deploy code

```bash
# On your laptop
rsync -avz --delete \
  --exclude node_modules --exclude dist --exclude .git --exclude backend/storage \
  ./ plutus@your-server:/opt/plutus/
```

On the server:
```bash
sudo chown -R plutus:plutus /opt/plutus
sudo -u plutus bash
cd /opt/plutus/backend
npm ci --omit=dev
cp .env.example .env   # then edit .env (see §2.4)
npm run migrate
mkdir -p storage
exit
```

### 2.4. `backend/.env` (production)

```env
NODE_ENV=production
PORT=4000
API_BASE_URL=https://plutus.firstmessage.ru
FRONTEND_BASE_URL=https://plutus.firstmessage.ru
CORS_ORIGINS=https://plutus.firstmessage.ru

DATABASE_URL=postgres://plutus:CHANGE_ME_STRONG_PASSWORD@localhost:5432/plutus

JWT_SECRET=$(openssl rand -hex 48)
JWT_TTL=30d
DOWNLOAD_SECRET=$(openssl rand -hex 48)

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...   # see §2.7
PLATFORM_FEE_PCT=0.05

RESEND_API_KEY=re_...
EMAIL_FROM=Plutus <noreply@plutus.firstmessage.ru>

STORAGE_DIR=/opt/plutus/backend/storage
MAX_UPLOAD_MB=100
```

### 2.5. systemd

```bash
sudo cp /opt/plutus/deploy/plutus-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now plutus-backend
sudo systemctl status plutus-backend
journalctl -u plutus-backend -f
```

### 2.6. Frontend build + nginx

```bash
# Build the SPA on the server (or build locally and rsync dist/)
cd /opt/plutus
sudo -u plutus bash -c 'npm ci && VITE_API_BASE_URL=https://plutus.firstmessage.ru npm run build'
sudo mkdir -p /var/www/plutus
sudo rsync -a /opt/plutus/dist/ /var/www/plutus/
sudo chown -R www-data:www-data /var/www/plutus

# nginx
sudo cp /opt/plutus/deploy/nginx.conf /etc/nginx/sites-available/plutus
sudo ln -sf /etc/nginx/sites-available/plutus /etc/nginx/sites-enabled/plutus
sudo nginx -t && sudo systemctl reload nginx

# TLS
sudo certbot --nginx -d plutus.firstmessage.ru
```

### 2.7. Stripe webhook

1. Open https://dashboard.stripe.com/test/webhooks → **Add endpoint**
2. URL: `https://plutus.firstmessage.ru/api/webhooks/stripe`
3. Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `charge.refunded`, `account.updated`
4. Copy the signing secret → `backend/.env` → `STRIPE_WEBHOOK_SECRET`
5. `sudo systemctl restart plutus-backend`

### 2.8. Stripe Connect

In Stripe Dashboard → **Connect → Settings**:
- Enable **Express** accounts
- Branding: logo, colors
- Platform profile: set your platform URL to `https://plutus.firstmessage.ru`

Sellers onboard via Wallet → *Connect with Stripe*.

### 2.9. Resend

1. Verify `plutus.firstmessage.ru` (DKIM/SPF DNS records).
2. Put the API key in `backend/.env` → `RESEND_API_KEY`.

---

## 3. Updating

```bash
# Pull new code, rebuild, restart
rsync ...
cd /opt/plutus/backend && npm ci --omit=dev && npm run migrate
sudo systemctl restart plutus-backend
cd /opt/plutus && npm ci && VITE_API_BASE_URL=https://plutus.firstmessage.ru npm run build
sudo rsync -a --delete dist/ /var/www/plutus/
sudo systemctl reload nginx
```

---

## 4. Backups

The two things that matter:
- **Postgres**: `pg_dump plutus > plutus-YYYYMMDD.sql` (cron weekly)
- **Storage**: `/opt/plutus/backend/storage/` — user-uploaded covers, content files, avatars

Recommended: rsync both to off-site storage nightly.

---

## 5. Troubleshooting

| Symptom | Where to look |
|---|---|
| `502 Bad Gateway` | `sudo systemctl status plutus-backend`, `journalctl -u plutus-backend -n 200` |
| Webhook signature fails | `STRIPE_WEBHOOK_SECRET` must match the one Stripe shows for *this specific endpoint* |
| Checkout session created but purchase never marked paid | Webhook not reaching server — test with `curl -X POST https://plutus.firstmessage.ru/api/webhooks/stripe -d '{}'` (expect 400) |
| Uploads fail >1MB | nginx `client_max_body_size` — already set to 110m in provided config |
| 401 on every request | JWT secret rotated but clients still have old tokens — have users sign in again |

---

## 6. Known limits / next steps

- No refunds UI (only webhook → DB update if you refund in Stripe dashboard)
- No team members / multi-user per account
- No OAuth — email+password only
- No full-text search over products
- Analytics tip is heuristic, not ML
