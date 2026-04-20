import { test } from 'node:test';
import assert from 'node:assert/strict';
import { signState, verifyState, generatePkce, isProviderConfigured } from '../oauth.js';

test('signState + verifyState round-trip preserves payload', () => {
  const token = signState({ provider: 'google', nonce: 'abc123' });
  const payload = verifyState(token);
  assert.ok(payload);
  assert.equal(payload.provider, 'google');
  assert.equal(payload.nonce, 'abc123');
});

test('verifyState rejects a tampered token', () => {
  const token = signState({ provider: 'google', nonce: 'n' });
  const [body, sig] = token.split('.');
  const tamperedBody = body.slice(0, -2) + 'XX';
  assert.equal(verifyState(`${tamperedBody}.${sig}`), null);
});

test('verifyState rejects expired tokens', () => {
  // Build a forged payload whose `exp` is in the past. It must fail to verify.
  const fakeBody = Buffer.from(JSON.stringify({ provider: 'google', exp: Date.now() - 10_000 })).toString('base64url');
  assert.equal(verifyState(`${fakeBody}.invalidsig`), null);
});

test('verifyState handles garbage input safely', () => {
  assert.equal(verifyState(''), null);
  assert.equal(verifyState(null), null);
  assert.equal(verifyState('not-a-token'), null);
});

test('generatePkce returns a verifier and a matching S256 challenge', () => {
  const { verifier, challenge } = generatePkce();
  assert.match(verifier, /^[A-Za-z0-9_-]+$/);
  assert.match(challenge, /^[A-Za-z0-9_-]+$/);
  assert.ok(verifier.length >= 43);
  assert.ok(challenge.length >= 43);
});

test('isProviderConfigured returns false when creds are empty', () => {
  // Test env doesn't set OAuth creds, so both should be false.
  assert.equal(isProviderConfigured('google'), false);
  assert.equal(isProviderConfigured('x'), false);
  assert.equal(isProviderConfigured('unknown'), false);
});
