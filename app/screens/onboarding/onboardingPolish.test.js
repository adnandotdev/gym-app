const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const read = (file) => fs.readFileSync(path.join(__dirname, file), 'utf8');

test('gender selection stays focused on onboarding without a login prompt', () => {
  const source = read('Step2Gender.js');
  assert.doesNotMatch(source, /Already have an account|Log in|loginLink|handleLogout|AuthContext|navigate\(['"]Login/);
});

test('weight ruler explains its interaction', () => {
  const source = read('Step6CurrentWeight.js');
  assert.match(source, /Swipe left or right to adjust your weight/);
  assert.match(source, /accessibilityHint=/);
  assert.match(source, /normalizeWeightUnit\(onboardingData\.weightUnit\)/);
  assert.match(source, /initialUnit === 'lb' \? lbToKg\(storedWeight\) : storedWeight/);
  assert.match(source, /unit === 'kg' \? localWeightKg : kgToLb\(localWeightKg\)/);
});

test('all stable body build values remain available', () => {
  const source = read('BodyShapeOptions.js');
  for (const [value, label] of [[1, 'Athletic'], [2, 'Lean'], [3, 'Average'], [4, 'Fuller build'], [5, 'Larger build']]) {
    assert.match(source, new RegExp(`value: ${value}, label: '${label}'`));
  }
  assert.match(source, /accessibilityRole="radio"/);
});

test('focus areas keep the previous split body-and-pills layout', () => {
  const source = read('Step10FocusAreas.js');
  assert.match(source, /id: 'Legs'/);
  assert.match(source, /area === 'Leg' \? 'Legs' : area/);
  assert.match(source, /accessibilityRole="checkbox"/);
  assert.match(source, /OnboardingFocusModel gender=\{onboardingData.gender\} selectedAreas=\{selectedAreas\}/);
  assert.match(source, /styles\.splitRow/);
  assert.match(source, /styles\.pillsColumn/);
  assert.match(source, /styles\.dottedConnector/);
  assert.doesNotMatch(source, /styles\.bodyCard|styles\.areaGrid/);
});

test('target weight uses kilograms internally and saves the selected display unit', () => {
  const source = read('Step9TargetWeight.js');
  assert.match(source, /currentWeightKg = unit === 'lb' \? lbToKg\(storedCurrentWeight\) : storedCurrentWeight/);
  assert.match(source, /unit === 'kg' \? localTargetWeightKg : kgToLb\(localTargetWeightKg\)/);
});

test('training days render all seven choices in one row', () => {
  const source = read('Step11TrainingDays.js');
  assert.match(source, /styles\.daysRow/);
  assert.doesNotMatch(source, /days\.slice/);
  assert.doesNotMatch(source, /dayButtonFour/);
});

test('training reminder switch keeps a contrasting thumb and track in dark mode', () => {
  const source = read('Step11TrainingDays.js');
  assert.match(source, /trackColor=\{\{ false: colors\.muted, true: colors\.primary \}\}/);
  assert.match(source, /reminder \? colors\.accentOnDark : colors\.white/);
  assert.match(source, /ios_backgroundColor=\{colors\.muted\}/);
});

test('equipment cards use meaningful icons and radio semantics', () => {
  const source = read('Step12Equipment.js');
  assert.match(source, /body-outline/);
  assert.match(source, /barbell-outline/);
  assert.match(source, /fitness-outline/);
  assert.match(source, /accessibilityRole="radio"/);
  assert.doesNotMatch(source, /placeholderRect|charAt\(0\)/);
});

test('injury choices preserve stable values without generated artwork', () => {
  const source = read('Step13Injuries.js');
  for (const name of ['No injuries', 'Shoulders', 'Back', 'Waist', 'Wrist', 'Knee']) {
    assert.match(source, new RegExp(`id: '${name}'`));
  }
  assert.doesNotMatch(source, /injury-.*-liftsutra/);
  assert.match(source, /submitOnboarding\(\{ injuries: selectedInjuries \}\)/);
});

test('onboarding submission accepts a latest-value override', () => {
  const source = read('../../context/OnboardingContext.js');
  assert.match(source, /submitOnboarding = async \(overrides = \{\}\)/);
  assert.match(source, /\.\.\.onboardingData, \.\.\.overrides/);
});
