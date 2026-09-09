import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { checkReleaseBuild } from './checkReleaseBuild.mjs';

test('both release profiles refuse missing, HTTP and LAN endpoints', () => {
  for (const profile of ['preview', 'production']) {
    for (const endpoint of [undefined, '', 'http://api.example.com/api', 'https://192.168.1.1/api']) {
      assert.throws(() => checkReleaseBuild({ EAS_BUILD_PROFILE: profile, EXPO_PUBLIC_API_URL: endpoint }), /Release build stopped/);
    }
    assert.equal(checkReleaseBuild({ EAS_BUILD_PROFILE: profile, EXPO_PUBLIC_API_URL: 'https://api.example.com/api' }), true);
  }
});

test('manual preflight defaults to strict and development profile is excluded', () => {
  assert.throws(() => checkReleaseBuild({}), /Release build stopped/);
  assert.equal(checkReleaseBuild({ EAS_BUILD_PROFILE: 'development' }), false);
});

test('actual lifecycle command exits nonzero for bad config without printing its value', () => {
  const sensitiveUrl = 'https://username:secret@api.example.com/api';
  const result = spawnSync(process.execPath, ['scripts/checkReleaseBuild.mjs'], {
    cwd: fileURLToProjectRoot(),
    env: { EAS_BUILD_PROFILE: 'production', EXPO_PUBLIC_API_URL: sensitiveUrl },
    encoding: 'utf8',
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Release build stopped/);
  assert.ok(!result.stderr.includes(sensitiveUrl));
});

function fileURLToProjectRoot() {
  return new URL('..', import.meta.url);
}
