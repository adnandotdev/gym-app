const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const {
  THEME_PREFERENCE_KEY,
  THEME_PREFERENCES,
  normalizeThemePreference,
  resolveThemePreference,
} = require('./themePreference');

describe('theme preference', () => {
  it('uses a versioned, app-specific persistence key', () => {
    assert.equal(THEME_PREFERENCE_KEY, '@liftsutra/theme-preference:v1');
  });

  it('accepts all supported appearance choices', () => {
    assert.deepEqual(THEME_PREFERENCES, ['system', 'light', 'dark']);
    THEME_PREFERENCES.forEach((preference) => {
      assert.equal(normalizeThemePreference(preference), preference);
    });
  });

  it('safely falls back to system for missing or corrupt values', () => {
    [null, undefined, '', 'sepia', 3, {}].forEach((value) => {
      assert.equal(normalizeThemePreference(value), 'system');
    });
  });

  it('follows the device only for the system preference', () => {
    assert.equal(resolveThemePreference('system', 'dark'), 'dark');
    assert.equal(resolveThemePreference('system', 'light'), 'light');
    assert.equal(resolveThemePreference('system', null), 'light');
    assert.equal(resolveThemePreference('dark', 'light'), 'dark');
    assert.equal(resolveThemePreference('light', 'dark'), 'light');
  });
});
