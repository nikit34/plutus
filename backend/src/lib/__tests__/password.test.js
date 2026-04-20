import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword } from '../password.js';

test('hashPassword produces a bcrypt hash that verifyPassword accepts', async () => {
  const hash = await hashPassword('hunter2');
  assert.match(hash, /^\$2[aby]\$/);
  assert.equal(await verifyPassword('hunter2', hash), true);
});

test('verifyPassword rejects the wrong password', async () => {
  const hash = await hashPassword('correct horse');
  assert.equal(await verifyPassword('battery staple', hash), false);
});

test('hashes of the same password are different (bcrypt salts each call)', async () => {
  const a = await hashPassword('same');
  const b = await hashPassword('same');
  assert.notEqual(a, b);
  assert.equal(await verifyPassword('same', a), true);
  assert.equal(await verifyPassword('same', b), true);
});
