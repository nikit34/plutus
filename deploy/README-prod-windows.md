# Plutus — production on Windows + Cloudflare tunnel

Targets the same machine (`permi@192.168.1.69`) that already runs `health-mdt`
behind the `firstmessage` named tunnel. The existing cloudflared service
is reused — we only add one ingress rule and one subdomain.

Final result: `https://plutus.firstmessage.ru` served by a docker-compose
stack (Postgres + Node API + Caddy+SPA container) listening on host port 8082.

---

## 1. On the server (one-time)

```powershell
# Clone the repo
cd $env:USERPROFILE
git clone https://github.com/nikit34/plutus.git

# Create repo-root .env (compose-level config)
cd plutus
Copy-Item .env.prod.example .env
notepad .env   # set POSTGRES_PASSWORD, VITE_GA_ID

# Create backend/.env (Node runtime config)
Copy-Item backend\.env.example backend\.env
notepad backend\.env
# Fill in: API_BASE_URL, FRONTEND_BASE_URL, CORS_ORIGINS=https://plutus.firstmessage.ru
# JWT_SECRET, DOWNLOAD_SECRET (both: openssl rand -hex 48)
# STRIPE_SECRET_KEY=sk_live_...  STRIPE_WEBHOOK_SECRET=whsec_... (new for prod URL)
# RESEND_API_KEY, NOWPAYMENTS_*, OAUTH_*
# NOTE: do NOT set DATABASE_URL or STORAGE_DIR — compose overrides both.
```

## 2. Cloudflare tunnel ingress

Edit `C:\Users\permi\.cloudflared\config.yml` — add one rule **before the
catch-all 404 line**:

```yaml
tunnel: ef48409e-cab1-4853-8550-6e389394191a
credentials-file: C:\Users\permi\.cloudflared\ef48409e-cab1-4853-8550-6e389394191a.json

ingress:
  - hostname: firstmessage.ru
    service: http://localhost:8000
  - hostname: health.firstmessage.ru
    service: http://localhost:8081
    originRequest:
      httpHostHeader: localhost
  - hostname: plutus.firstmessage.ru          # ← NEW
    service: http://localhost:8082            # ← NEW
    originRequest:                            # ← NEW
      httpHostHeader: localhost               # ← NEW
  - service: http_status:404
```

Register the DNS record (creates CNAME → `<tunnel-id>.cfargotunnel.com`
automatically in the Cloudflare zone):

```powershell
cloudflared tunnel route dns firstmessage plutus.firstmessage.ru
```

Restart the tunnel service so it picks up the new config:

```powershell
Restart-Service cloudflared
```

## 3. Start the stack

```powershell
cd $env:USERPROFILE\plutus
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml logs -f
```

First build: ~3–5 min. After that, `up -d` is instant on unchanged sources.

Sanity check (inside the server):

```powershell
Invoke-WebRequest http://localhost:8082/api/health | Select-Object Content
# → {"ok":true,"env":"production"}
```

Then from outside: https://plutus.firstmessage.ru/api/health.

## 4. Auto-deploy on `git push`

Register the sync loop in Task Scheduler so it runs at startup:

```powershell
$action = New-ScheduledTaskAction `
  -Execute "powershell.exe" `
  -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File $env:USERPROFILE\plutus\deploy\plutus-sync.ps1"
$trigger = New-ScheduledTaskTrigger -AtStartup
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERNAME" -LogonType Interactive -RunLevel Highest
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
Register-ScheduledTask -TaskName "plutus-sync" -Action $action -Trigger $trigger -Principal $principal -Settings $settings
Start-ScheduledTask -TaskName "plutus-sync"
```

The task polls `origin/main` every 60s; when it sees new commits it
`git reset --hard` + `docker compose up -d --build`. Logs go to
`$env:USERPROFILE\plutus-sync.log`.

## 5. External services — prod URLs

Once `plutus.firstmessage.ru` resolves:

**Stripe** — https://dashboard.stripe.com/webhooks
- Add endpoint: `https://plutus.firstmessage.ru/api/webhooks/stripe`
- Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`,
  `checkout.session.async_payment_failed`, `charge.refunded`, `account.updated`
- Copy the new `whsec_...` → `backend/.env` → `STRIPE_WEBHOOK_SECRET` →
  `docker compose -f docker-compose.prod.yml restart api`

**NOWPayments** — https://account.nowpayments.io/store/ipn
- IPN URL: `https://plutus.firstmessage.ru/api/webhooks/nowpayments`

**Google OAuth** — https://console.cloud.google.com/apis/credentials
- Add Authorized redirect URI:
  `https://plutus.firstmessage.ru/api/auth/oauth/google/callback`

**X OAuth** — https://developer.x.com/en/portal/projects
- Callback URL: `https://plutus.firstmessage.ru/api/auth/oauth/x/callback`

**Resend** — https://resend.com/domains
- Verify `plutus.firstmessage.ru` (or reuse an existing verified domain)
- Update `EMAIL_FROM` in `backend/.env`

## 6. Backups

Two pieces of durable state:

```powershell
# Weekly DB dump (add to Task Scheduler, weekly)
docker compose -f $env:USERPROFILE\plutus\docker-compose.prod.yml exec -T postgres `
  pg_dump -U plutus plutus > $env:USERPROFILE\plutus-backup-$(Get-Date -Format yyyyMMdd).sql

# Uploaded files live in the plutus-storage volume
docker run --rm -v plutus_plutus-storage:/src -v ${PWD}:/dst alpine `
  tar czf /dst/plutus-storage-$(Get-Date -Format yyyyMMdd).tgz -C /src .
```

## 7. Troubleshooting

| Symptom | Where to look |
|---|---|
| 502 from Cloudflare | `docker compose logs web`, check :8082 is listening on host |
| 530 / 1033 | tunnel service stopped — `Get-Service cloudflared`, `Restart-Service cloudflared` |
| `DATABASE_URL is not set` | the api container should get it from compose env — verify `docker compose exec api env \| findstr DATABASE` |
| Stripe webhook 400 | signing secret is per-endpoint; the dev `stripe listen` secret WILL NOT work for prod URL |
| OAuth `redirect_uri_mismatch` | you forgot to add the prod callback URL to Google/X app settings |
| Sync loop not deploying | check `$env:USERPROFILE\plutus-sync.log`, task must run as Interactive user with Docker Desktop access |
