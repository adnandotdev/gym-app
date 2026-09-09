const {
  getFeatureFlag,
  setFeatureFlags,
  resetFeatureFlags,
  getAllFlags,
} = require('./featureFlags');
const { beforeEach, describe, it } = require('node:test');
const assert = require('node:assert/strict');

describe('Feature Flags', () => {
  beforeEach(() => {
    resetFeatureFlags();
  });

  it('returns default false for unlaunched features', () => {
    assert.equal(getFeatureFlag('readinessCheck'), false);
    assert.equal(getFeatureFlag('smartSubstitutions'), false);
  });

  it('allows setting overrides', () => {
    setFeatureFlags({ readinessCheck: true, unknownFlag: true });
    assert.equal(getFeatureFlag('readinessCheck'), true);
    // Even if it's unknown, it sets it, but typically we only query known flags
    assert.equal(getFeatureFlag('unknownFlag'), true);
    // Unchanged flags remain false
    assert.equal(getFeatureFlag('smartSubstitutions'), false);
  });

  it('resets back to defaults', () => {
    setFeatureFlags({ readinessCheck: true });
    resetFeatureFlags();
    assert.equal(getFeatureFlag('readinessCheck'), false);
  });

  it('getAllFlags returns a full snapshot', () => {
    setFeatureFlags({ progressionSuggestions: true });
    const flags = getAllFlags();
    assert.equal(flags.progressionSuggestions, true);
    assert.equal(flags.adaptiveWarmup, false);
  });
});
