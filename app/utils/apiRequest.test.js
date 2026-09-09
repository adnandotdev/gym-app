import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeRequestOptions } from './apiRequest.js';

test('DELETE accepts the existing Axios-style data payload without dropping it', () => {
  assert.deepEqual(
    normalizeRequestOptions('DELETE', { data: { day: 'Monday', exerciseId: 'bench-press' } }),
    { method: 'DELETE', body: { day: 'Monday', exerciseId: 'bench-press' }, headers: {} },
  );
});

test('explicit body wins over compatibility data and preserves headers', () => {
  assert.deepEqual(
    normalizeRequestOptions('PUT', { body: { value: 1 }, data: { value: 2 }, headers: { 'X-Test': 'yes' } }),
    { method: 'PUT', body: { value: 1 }, headers: { 'X-Test': 'yes' } },
  );
});
