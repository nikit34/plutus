ALTER TABLE purchases ADD COLUMN IF NOT EXISTS payment_provider TEXT NOT NULL DEFAULT 'stripe';
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS nowpayments_invoice_id TEXT;
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS nowpayments_payment_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS purchases_nowpayments_invoice_idx ON purchases(nowpayments_invoice_id) WHERE nowpayments_invoice_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS purchases_nowpayments_payment_idx ON purchases(nowpayments_payment_id) WHERE nowpayments_payment_id IS NOT NULL;
