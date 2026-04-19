ALTER TABLE users ADD COLUMN IF NOT EXISTS crypto_address TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS crypto_currency TEXT;

ALTER TABLE payouts ADD COLUMN IF NOT EXISTS method TEXT NOT NULL DEFAULT 'stripe';
ALTER TABLE payouts ADD COLUMN IF NOT EXISTS crypto_address TEXT;
ALTER TABLE payouts ADD COLUMN IF NOT EXISTS crypto_currency TEXT;
ALTER TABLE payouts ADD COLUMN IF NOT EXISTS nowpayments_withdrawal_id TEXT;
ALTER TABLE payouts ADD COLUMN IF NOT EXISTS nowpayments_batch_id TEXT;

CREATE INDEX IF NOT EXISTS payouts_nowpayments_idx ON payouts(nowpayments_withdrawal_id) WHERE nowpayments_withdrawal_id IS NOT NULL;
