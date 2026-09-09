import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createAuthTokenStorage } from './authTokenStorageCore.js';

test('native token storage delegates to the encrypted store', async () => {
  const values = new Map();
  const secureStore = {
    getItemAsync: async (key) => values.get(key) ?? null,
    setItemAsync: async (key, value) => values.set(key, value),
    deleteItemAsync: async (key) => values.delete(key),
  };
  const storage = createAuthTokenStorage({ platform: 'ios', secureStore });
  await storage.setToken('secret-token');
  assert.equal(await storage.getToken(), 'secret-token');
  await storage.clearToken();
  assert.equal(await storage.getToken(), null);
});

test('web token storage is session-only and never calls native secure storage', async () => {
  const secureStore = new Proxy({}, { get: () => { throw new Error('must not be used'); } });
  const storage = createAuthTokenStorage({ platform: 'web', secureStore });
  await storage.setToken('session-token');
  assert.equal(await storage.getToken(), 'session-token');
  await storage.clearToken();
  assert.equal(await storage.getToken(), null);
});
