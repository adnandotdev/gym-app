const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');

test('LiftSutra is the public app identity without changing the project slug', () => {
  const { expo } = JSON.parse(fs.readFileSync(path.join(root, 'app.json')));
  assert.equal(expo.name, 'LiftSutra');
  assert.equal(expo.slug, 'musclemap');
  const foreground = fs.readFileSync(path.join(root, expo.android.adaptiveIcon.foregroundImage));
  assert.equal(foreground[25], 6, 'Android foreground must be an RGBA PNG');
  for (const asset of [expo.icon, expo.android.adaptiveIcon.foregroundImage, expo.web.favicon]) {
    assert.match(asset, /liftsutra/);
    const bytes = fs.readFileSync(path.join(root, asset));
    assert.equal(bytes.toString('ascii', 1, 4), 'PNG');
    assert.equal(bytes.readUInt32BE(16), bytes.readUInt32BE(20), 'Launcher assets must be square');
  }
});

test('all existing brand surfaces share the approved logo component', () => {
  for (const file of ['user/HomeScreen.js', 'auth/LoginScreen.js', 'auth/RegisterScreen.js', 'auth/ForgotPasswordScreen.js', 'onboarding/OnboardingHeader.js']) {
    const source = fs.readFileSync(path.join(root, 'app/screens', file), 'utf8');
    assert.match(source, /<BrandLogo\b/, file);
    assert.doesNotMatch(source, /MuscleMap|>Muscle</, file);
  }
});

test('compact logo isolates launcher padding and uses transparent artwork', () => {
  const source = fs.readFileSync(path.join(root, 'app/components/BrandLogo.js'), 'utf8');
  assert.match(source, /liftsutra-adaptive\.png/);
  assert.match(source, /styles\.markViewport/);
  assert.match(source, /includeFontPadding: false/);
});
