-- Users
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'Pro',
  social_link TEXT,
  social_label TEXT,
  subscribers INTEGER NOT NULL DEFAULT 0,
  stripe_account_id TEXT,
  stripe_onboarded BOOLEAN NOT NULL DEFAULT FALSE,
  email_notif_sales BOOLEAN NOT NULL DEFAULT TRUE,
  email_notif_payouts BOOLEAN NOT NULL DEFAULT TRUE,
  email_notif_tips BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  cover_path TEXT,
  theme TEXT NOT NULL DEFAULT 'midnight',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','draft','archived')),
  -- delivered content after purchase
  content_type TEXT NOT NULL DEFAULT 'file' CHECK (content_type IN ('file','link','text')),
  content_file_path TEXT,
  content_file_name TEXT,
  content_file_size BIGINT,
  content_url TEXT,
  content_label TEXT,
  content_body TEXT,
  stripe_payment_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_user_idx ON products(user_id);
CREATE INDEX IF NOT EXISTS products_status_idx ON products(status);

-- Purchases
CREATE TABLE IF NOT EXISTS purchases (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  seller_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  buyer_email TEXT,
  amount_cents INTEGER NOT NULL,
  platform_fee_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','refunded','failed')),
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent TEXT,
  download_token TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS purchases_seller_idx ON purchases(seller_id);
CREATE INDEX IF NOT EXISTS purchases_product_idx ON purchases(product_id);
CREATE INDEX IF NOT EXISTS purchases_status_idx ON purchases(status);
CREATE INDEX IF NOT EXISTS purchases_paid_at_idx ON purchases(paid_at);

-- Payouts
CREATE TABLE IF NOT EXISTS payouts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','paid','failed','canceled')),
  stripe_transfer_id TEXT,
  stripe_payout_id TEXT,
  method_label TEXT,
  failure_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS payouts_user_idx ON payouts(user_id);
CREATE INDEX IF NOT EXISTS payouts_created_idx ON payouts(created_at DESC);

-- Events (analytics: views, clicks, etc.)
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  visitor_hash TEXT,
  meta JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS events_product_idx ON events(product_id);
CREATE INDEX IF NOT EXISTS events_user_idx ON events(user_id);
CREATE INDEX IF NOT EXISTS events_type_created_idx ON events(type, created_at);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  meta JSONB,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notifications_user_idx ON notifications(user_id, created_at DESC);

-- Schema version table
CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
