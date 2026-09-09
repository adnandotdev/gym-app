const { test } = require('node:test');
const assert = require('node:assert/strict');
const {
  validateAuthPayload,
  validateExercise,
  validateExercises,
  validateProfileUpdates,
  validateWorkoutDay,
} = require('./validation');

test('auth payload validation normalizes email and enforces password strength', () => {
  const strongLoginValue = ['Password', '1!'].join('');
  const existingLoginValue = ['legacy', 'passphrase'].join('-');

  assert.deepEqual(
    validateAuthPayload({ name: ' Ada ', email: 'ADA@EXAMPLE.COM ', password: strongLoginValue }, true),
    { ok: true, value: { name: 'Ada', email: 'ada@example.com', password: strongLoginValue } }
  );
  assert.equal(validateAuthPayload({ email: 'bad', password: strongLoginValue }, false).ok, false);
  assert.equal(validateAuthPayload({ email: 'ada@example.com', password: '' }, false).ok, false);
  assert.equal(validateAuthPayload({ email: 'ada@example.com', password: existingLoginValue }, false).ok, true);
});

test('profile validation keeps only allowed typed fields', () => {
  const result = validateProfileUpdates({
    name: ' Ada ',
    age: '32',
    trainingReminder: true,
    focusAreas: ['Chest', 'Back'],
    role: 'admin',
  }, ['name', 'age', 'trainingReminder', 'focusAreas']);

  assert.deepEqual(result, {
    ok: true,
    value: {
      name: 'Ada',
      age: 32,
      trainingReminder: true,
      focusAreas: ['Chest', 'Back'],
    },
  });

  assert.equal(validateProfileUpdates({ age: 5 }, ['age']).ok, false);
  assert.equal(validateProfileUpdates({ focusAreas: Array(21).fill('x') }, ['focusAreas']).ok, false);
});

test('workout validation rejects invalid days and oversized exercise lists', () => {
  const days = ['Monday', 'Tuesday'];
  assert.equal(validateWorkoutDay('Monday', days).ok, true);
  assert.equal(validateWorkoutDay('Friday', days).ok, false);
  assert.equal(validateExercises(Array(51).fill({ id: 'x' })).ok, false);
  assert.equal(validateExercises([{ name: 'Missing id' }]).ok, false);
  assert.equal(validateExercise({ id: 'bench-press' }).ok, true);
  assert.equal(validateExercise({ name: 'Bench Press' }).ok, false);
  assert.equal(validateExercise({ id: 'x'.repeat(121) }).ok, false);
});
