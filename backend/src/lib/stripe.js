import Stripe from 'stripe';
import { config } from '../config.js';

let client = null;

export function getStripe() {
  if (!config.stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY not set');
  }
  if (!client) {
    client = new Stripe(config.stripeSecretKey, { apiVersion: '2024-11-20.acacia' });
  }
  return client;
}

export function hasStripe() {
  return !!config.stripeSecretKey;
}
