import 'dotenv/config';

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env: ${name}`);
  return v;
}

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:4000',
  frontendBaseUrl: process.env.FRONTEND_BASE_URL || 'http://localhost:5173',
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),

  databaseUrl: required('DATABASE_URL'),

  jwtSecret: required('JWT_SECRET'),
  jwtTtl: process.env.JWT_TTL || '30d',
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS || 12),
  downloadSecret: process.env.DOWNLOAD_SECRET || required('JWT_SECRET'),
  downloadTtl: Number(process.env.DOWNLOAD_TTL_SECONDS || 7 * 24 * 3600),

  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  platformFeePct: Number(process.env.PLATFORM_FEE_PCT || 0.05),

  resendApiKey: process.env.RESEND_API_KEY || '',
  emailFrom: process.env.EMAIL_FROM || 'Plutus <noreply@localhost>',

  nowpaymentsApiKey: process.env.NOWPAYMENTS_API_KEY || '',
  nowpaymentsIpnSecret: process.env.NOWPAYMENTS_IPN_SECRET || '',
  nowpaymentsSandbox: (process.env.NOWPAYMENTS_SANDBOX || 'false').toLowerCase() === 'true',
  nowpaymentsEmail: process.env.NOWPAYMENTS_EMAIL || '',
  nowpaymentsPassword: process.env.NOWPAYMENTS_PASSWORD || '',

  storageDir: process.env.STORAGE_DIR || './storage',
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB || 100),

  oauthGoogleClientId: process.env.OAUTH_GOOGLE_CLIENT_ID || '',
  oauthGoogleClientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET || '',
  oauthXClientId: process.env.OAUTH_X_CLIENT_ID || '',
  oauthXClientSecret: process.env.OAUTH_X_CLIENT_SECRET || '',
};
