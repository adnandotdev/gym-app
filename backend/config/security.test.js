const { test } = require('node:test');
const assert = require('node:assert/strict');
const { corsOptions, getAllowedOrigins, validateSecurityEnvironment } = require('./security');

test('production can be native-only and validates any configured browser origins', () => {
  assert.doesNotThrow(() => validateSecurityEnvironment({ NODE_ENV: 'production' }));
  assert.doesNotThrow(() => validateSecurityEnvironment({
    NODE_ENV: 'production',
    CORS_ORIGINS: 'https://app.example.com',
  }));
  for (const origin of ['*', 'https://*.example.com', 'http://app.example.com', 'https://app.example.com/path', 'https://app.example.com?token=x']) {
    assert.throws(
      () => validateSecurityEnvironment({ NODE_ENV: 'production', CORS_ORIGINS: origin }),
      /CORS_ORIGINS/,
    );
  }
});

test('parses allowed CORS origins from comma separated config', () => {
  assert.deepEqual(
    getAllowedOrigins({ CORS_ORIGINS: 'https://a.example.com, https://b.example.com' }),
    ['https://a.example.com', 'https://b.example.com']
  );
});

test('production CORS allows configured origins and native requests without origin', async () => {
  const options = corsOptions({
    NODE_ENV: 'production',
    CORS_ORIGINS: 'https://app.example.com',
  });

  await assert.doesNotReject(() => new Promise((resolve, reject) => {
    options.origin('https://app.example.com', (error) => error ? reject(error) : resolve());
  }));

  await assert.doesNotReject(() => new Promise((resolve, reject) => {
    options.origin(undefined, (error) => error ? reject(error) : resolve());
  }));

  await assert.rejects(() => new Promise((resolve, reject) => {
    options.origin('https://evil.example.com', (error) => error ? reject(error) : resolve());
  }), /Origin is not allowed/);
});

test('native-only production rejects browser origins while allowing requests without an origin', async () => {
  const options = corsOptions({ NODE_ENV: 'production' });
  await assert.doesNotReject(() => new Promise((resolve, reject) => {
    options.origin(undefined, (error) => error ? reject(error) : resolve());
  }));
  await assert.rejects(() => new Promise((resolve, reject) => {
    options.origin('https://browser.example.com', (error) => error ? reject(error) : resolve());
  }), /Origin is not allowed/);
});
