const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../..');
const read = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');

const productionThemeConsumers = [
  'App.js',
  ...fs.readdirSync(path.join(ROOT, 'app/components')).filter((file) => file.endsWith('.js')).map((file) => `app/components/${file}`),
  ...fs.readdirSync(path.join(ROOT, 'app/navigation')).filter((file) => file.endsWith('.js')).map((file) => `app/navigation/${file}`),
  ...['admin', 'auth', 'onboarding', 'user'].flatMap((folder) =>
    fs.readdirSync(path.join(ROOT, `app/screens/${folder}`)).filter((file) => file.endsWith('.js')).map((file) => `app/screens/${folder}/${file}`),
  ),
];

describe('app-wide appearance integration', () => {
  it('defines matching light and dark palettes without changing the approved light brand', () => {
    const theme = read('app/theme/colors.js');
    assert.match(theme, /export const lightColors/);
    assert.match(theme, /export const darkColors/);
    assert.match(theme, /primary:\s*'#7C4DFF'/);
    assert.match(theme, /canvas:\s*'#101014'/);
  });

  it('hydrates the saved preference before rendering the application', () => {
    const app = read('App.js');
    assert.match(app, /ThemeProvider/);
    assert.match(app, /ThemeReadyGate/);
    assert.match(app, /<ThemeProvider>[\s\S]*<ThemeReadyGate fontsLoaded=\{fontsLoaded\} \/>[\s\S]*<\/ThemeProvider>/);
    assert.match(app, /function ThemeReadyGate[\s\S]*<AuthProvider>/);
  });

  it('allows the operating system to render both native color schemes', () => {
    const { expo } = JSON.parse(read('app.json'));
    assert.equal(expo.userInterfaceStyle, 'automatic');
  });

  it('themes navigation and system chrome from the resolved scheme', () => {
    const navigator = read('app/navigation/AppNavigator.js');
    assert.match(navigator, /theme=\{navigationTheme\}/);
    assert.match(navigator, /useAppTheme/);

    const fixedStatusBars = productionThemeConsumers.filter((file) => /barStyle=["']dark-content["']/.test(read(file)));
    assert.deepEqual(fixedStatusBars, []);
  });

  it('uses the native unspecified value when following the system appearance', () => {
    const provider = read('app/context/ThemeContext.js');
    assert.match(provider, /preference === 'system' \? 'unspecified' : preference/);
    assert.doesNotMatch(provider, /Appearance\.setColorScheme\([^)]*null/);
  });

  it('exposes System, Light, and Dark controls from Profile', () => {
    const profile = read('app/screens/user/ProfileScreen.js');
    assert.match(profile, /Appearance/);
    assert.match(profile, /THEME_PREFERENCES/);
    assert.match(profile, /setPreference/);
    assert.match(profile, /accessibilityState=\{\{ selected:/);
  });

  it('does not leave module-level light-only color imports in rendered files', () => {
    const legacyConsumers = productionThemeConsumers.filter((file) => {
      const source = read(file);
      return /import\s*\{[^}]*\bcolors\b[^}]*\}\s*from\s*['"][^'"]*theme\/colors['"]/.test(source);
    });
    assert.deepEqual(legacyConsumers, []);
  });
});
