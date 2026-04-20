import { test } from 'node:test';
import assert from 'node:assert/strict';
import { signAuthToken, verifyAuthToken, signDownloadToken, verifyDownloadToken } from '../jwt.js';

test('signAuthToken produces a JWT that round-trips through verifyAuthToken', () => {
  const token = signAuthToken({ id: 42, email: 'alice@example.com' });
  assert.match(token, /^ey[A-Za-z0-9_-]+\.ey[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);

  const decoded = verifyAuthToken(token);
  assert.equal(decoded.sub, '42');
  assert.equal(decoded.email, 'alice@example.com');
});

test('verifyAuthToken rejects a token signed with a different secret', () => {
  const token = signAuthToken({ id: 1, email: 'a@b.c' });
  const tampered = token.slice(0, -4) + 'xxxx';
  assert.throws(() => verifyAuthToken(tampered));
});

test('signDownloadToken/verifyDownloadToken round-trip with custom payload', () => {
  const token = signDownloadToken({ purchaseId: 7, productId: 3 }, 60);
  const decoded = verifyDownloadToken(token);
  assert.equal(decoded.purchaseId, 7);
  assert.equal(decoded.productId, 3);
  assert.ok(decoded.exp > Math.floor(Date.now() / 1000));
});
