const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validateServerEnvironment, requireProductionDatabase } = require('./runtimeSafety');

test('production startup requires persistent storage and a strong configured signing secret', () => {
  assert.throws(() => validateServerEnvironment({ NODE_ENV: 'production' }), /MONGO_URI/);
  assert.throws(() => validateServerEnvironment({ NODE_ENV: 'production', MONGO_URI: 'mongodb://db' }), /JWT_SECRET/);
  assert.doesNotThrow(() => validateServerEnvironment({ NODE_ENV: 'production', MONGO_URI: 'mongodb://db', JWT_SECRET: 'a'.repeat(32) }));
  assert.doesNotThrow(() => validateServerEnvironment({ NODE_ENV: 'development', MONGO_URI: 'mongodb://db' }));
});

test('production rejects placeholder secrets even when they are long enough', () => {
  assert.throws(() => validateServerEnvironment({
    NODE_ENV: 'production',
    MONGO_URI: 'mongodb://db',
    JWT_SECRET: 'replace-with-at-least-32-random-characters',
  }), /random JWT_SECRET/);
});

test('production database outage blocks requests, reconnect resumes requests, development retains offline mode', () => {
  const previous = process.env.NODE_ENV;
  try {
    const connection = { readyState: 0 };
    let status;
    let payload;
    let calls = 0;
    const res = { status(code) { status = code; return this; }, json(value) { payload = value; return this; } };
    const guard = requireProductionDatabase(connection);
    process.env.NODE_ENV = 'production';
    guard({}, res, () => { calls += 1; });
    assert.equal(status, 503);
    assert.equal(payload.success, false);
    assert.equal(calls, 0);
    connection.readyState = 1;
    guard({}, res, () => { calls += 1; });
    assert.equal(calls, 1);
    process.env.NODE_ENV = 'development';
    connection.readyState = 0;
    guard({}, res, () => { calls += 1; });
    assert.equal(calls, 2);
  } finally {
    if (previous === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previous;
  }
});

test('every demo storage entry point is inaccessible in production even if middleware already passed', () => {
  const store = require('./devMemoryStore');
  const previous = process.env.NODE_ENV;
  try {
    process.env.NODE_ENV = 'production';
    for (const operation of Object.values(store)) {
      assert.throws(() => operation(), /disabled in production/);
    }
  } finally {
    if (previous === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previous;
  }
});
