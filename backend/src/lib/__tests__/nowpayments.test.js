import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { verifyIpnSignature } from '../nowpayments.js';

// Mirror the algorithm NOWPayments documents: sort keys at every level,
// JSON.stringify, HMAC-SHA512 with the IPN secret.
function sign(body, secret) {
  const sortDeep = (v) => {
    if (Array.isArray(v)) return v.map(sortDeep);
    if (v && typeof v === 'object') {
      const out = {};
      for (const k of Object.keys(v).sort()) out[k] = sortDeep(v[k]);
      return out;
    }
    return v;
  };
  return crypto.createHmac('sha512', secret).update(JSON.stringify(sortDeep(body))).digest('hex');
}

const SECRET = 'test-nowpayments-ipn-secret';

test('verifyIpnSignature accepts a correctly signed payload', () => {
  const body = { payment_id: 1, payment_status: 'finished', order_id: 'plutus-7' };
  const sig = sign(body, SECRET);
  const raw = Buffer.from(JSON.stringify(body));
  assert.equal(verifyIpnSignature(raw, sig), true);
});

test('verifyIpnSignature rejects a wrong signature', () => {
  const body = { payment_id: 1, payment_status: 'finished' };
  const raw = Buffer.from(JSON.stringify(body));
  const badSig = crypto.createHmac('sha512', 'wrong-secret').update(JSON.stringify(body)).digest('hex');
  assert.equal(verifyIpnSignature(raw, badSig), false);
});

test('verifyIpnSignature is order-independent on keys', () => {
  const a = { a: 1, b: 2, c: { z: 1, a: 2 } };
  const b = { c: { a: 2, z: 1 }, b: 2, a: 1 };
  const sigFromA = sign(a, SECRET);
  const rawFromB = Buffer.from(JSON.stringify(b));
  assert.equal(verifyIpnSignature(rawFromB, sigFromA), true);
});

test('verifyIpnSignature rejects empty / malformed inputs', () => {
  assert.equal(verifyIpnSignature(Buffer.from('{}'), ''), false);
  assert.equal(verifyIpnSignature(Buffer.from('not json'), 'deadbeef'), false);
});
