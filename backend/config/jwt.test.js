const { test } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const { JWT_OPTIONS, getJwtSignOptions } = require('./jwt');

test('JWT sign and verify options stay aligned', () => {
  const secret = 'a'.repeat(32);
  const token = jwt.sign({ id: 'user-id' }, secret, getJwtSignOptions({ JWT_EXPIRES_IN: '7d' }));
  const decoded = jwt.verify(token, secret, {
    algorithms: [JWT_OPTIONS.algorithm],
    issuer: JWT_OPTIONS.issuer,
    audience: JWT_OPTIONS.audience,
  });

  assert.equal(decoded.id, 'user-id');
  assert.equal(decoded.iss, 'liftsutra-api');
  assert.equal(decoded.aud, 'liftsutra-app');
});
