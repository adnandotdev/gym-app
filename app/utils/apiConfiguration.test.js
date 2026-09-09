import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveApiUrl } from './apiConfiguration.js';

test('development keeps local API workflow', () => {
  assert.match(resolveApiUrl(undefined, true), /^http:/);
  assert.equal(resolveApiUrl('http://localhost:5000/api/', true), 'http://localhost:5000/api');
});

test('release blocks missing, insecure, local, credential-bearing and malformed endpoints', () => {
  for (const value of [undefined, '', 'invalid', 'http://api.example.com/api', 'https://localhost/api', 'https://127.0.0.1/api', 'https://192.168.1.2/api', 'https://gym.local/api', 'https://[::1]/api', 'https://user:pass@api.example.com/api', 'https://api.example.com/api?key=value']) {
    assert.equal(resolveApiUrl(value, false), null, String(value));
  }
  assert.equal(resolveApiUrl('https://api.example.com/api/', false), 'https://api.example.com/api');
  assert.equal(resolveApiUrl('https://api.example.com', false), null);
  assert.equal(resolveApiUrl('https://api.example.com/v1', false), null);
});
