const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('./app');

const startApp = async (options = {}) => {
  const app = createApp({
    env: { NODE_ENV: 'production', CORS_ORIGINS: 'https://app.liftsutra.example' },
    connection: { readyState: 1 },
    ...options,
  });
  const server = await new Promise((resolve) => {
    const instance = app.listen(0, '127.0.0.1', () => resolve(instance));
  });
  return { server, baseUrl: `http://127.0.0.1:${server.address().port}` };
};

test('liveness is independent from database readiness', async (t) => {
  const { server, baseUrl } = await startApp({ connection: { readyState: 0 } });
  t.after(() => server.close());

  const live = await fetch(`${baseUrl}/health`);
  const ready = await fetch(`${baseUrl}/ready`);
  assert.equal(live.status, 200);
  assert.deepEqual(await live.json(), { status: 'ok' });
  assert.equal(ready.status, 503);
  assert.deepEqual(await ready.json(), { status: 'unavailable' });
});

test('CORS allows native requests and configured web origin but rejects other web origins', async (t) => {
  const { server, baseUrl } = await startApp();
  t.after(() => server.close());

  const native = await fetch(`${baseUrl}/health`);
  const allowed = await fetch(`${baseUrl}/health`, { headers: { Origin: 'https://app.liftsutra.example' } });
  const blocked = await fetch(`${baseUrl}/health`, { headers: { Origin: 'https://evil.example' } });
  assert.equal(native.status, 200);
  assert.equal(allowed.headers.get('access-control-allow-origin'), 'https://app.liftsutra.example');
  assert.equal(blocked.status, 403);
  assert.equal(blocked.headers.get('access-control-allow-origin'), null);
});

test('unknown routes use a stable JSON response without implementation details', async (t) => {
  const { server, baseUrl } = await startApp();
  t.after(() => server.close());
  const response = await fetch(`${baseUrl}/missing`);
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { success: false, message: 'Route not found.' });
});

test('proxy-aware API throttling accepts Render-style forwarded client addresses', async (t) => {
  const { server, baseUrl } = await startApp();
  t.after(() => server.close());
  const response = await fetch(`${baseUrl}/api/missing`, {
    headers: { 'X-Forwarded-For': '203.0.113.8' },
  });
  assert.equal(response.status, 404);
  assert.match(response.headers.get('ratelimit-policy') || '', /300/);
});
