const test = require('node:test');
const assert = require('node:assert/strict');
const { parseSetInput } = require('./workoutSetInput');
const { createWorkoutSession, workoutSessionReducer } = require('./workoutSession');

test('rejects blank, zero, partial and fractional set counts', () => {
  for (const value of ['', ' ', '0', '-1', '2.5', '12abc', 'Infinity']) {
    assert.equal(parseSetInput({ targetType: 'reps', value, load: '' }), null);
    assert.equal(parseSetInput({ targetType: 'duration', value }), null);
  }
});

test('accepts bodyweight and decimal loads but rejects invalid loads', () => {
  assert.deepEqual(parseSetInput({ value: '12', load: '' }), { actualReps: 12, actualLoadKg: 0 });
  assert.deepEqual(parseSetInput({ value: '8', load: '12.5' }), { actualReps: 8, actualLoadKg: 12.5 });
  for (const load of ['-1', '12kg', 'Infinity']) assert.equal(parseSetInput({ value: '8', load }), null);
});

test('records duration input as seconds instead of reps or load', () => {
  const payload = parseSetInput({ targetType: 'duration', value: '30', load: '99' });
  assert.deepEqual(payload, { actualSeconds: 30 });
  const base = createWorkoutSession({ exercises: [{ id: 'stretch', name: 'Stretch', sets: 1, reps: '30' }] });
  const state = { ...base, queue: base.queue.map(item => ({ ...item, targets: item.targets.map(target => ({ ...target, targetType: 'duration' })) })) };
  const next = workoutSessionReducer(state, { type: 'COMPLETE_SET', payload });
  assert.equal(next.queue[0].results[0].actualSeconds, 30);
  assert.equal(next.queue[0].results[0].actualReps, undefined);
});
