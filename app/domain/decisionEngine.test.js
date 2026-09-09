const test = require('node:test');
const assert = require('node:assert/strict');
const { buildSession, DECISION_REASONS } = require('./decisionEngine');

test('F06: Pain produces a hard safety block', () => {
  const plan = { items: [{ id: 'ex1', sets: 3, reps: 10 }] };
  const context = { readiness: { soreness: 'Pain', energy: 'Normal', sleep: 'Good' } };
  const result = buildSession(plan, context);

  assert.equal(result.decision, 'blocked');
  assert.equal(result.warnings.length, 1);
  assert.equal(result.warnings[0].reason, DECISION_REASONS.SAFETY_BLOCK);
});

test('F06: Low energy reduces volume', () => {
  const plan = { items: [{ id: 'ex1', sets: 3, reps: 10 }] };
  const context = { readiness: { soreness: 'None', energy: 'Low', sleep: 'Good' } };
  const result = buildSession(plan, context);

  assert.equal(result.decision, 'ready');
  assert.equal(result.adaptations.length, 1);
  assert.equal(result.adaptations[0].type, 'reduce_volume');
  assert.equal(result.items[0].sets, 2); // 3 - 1
  assert.equal(result.items[0].reps, 8); // 10 - 2
  assert.equal(result.items[0].isAdapted, true);
});

test('F06: Normal readiness does not adapt', () => {
  const plan = { items: [{ id: 'ex1', sets: 3, reps: 10 }] };
  const context = { readiness: { soreness: 'None', energy: 'Normal', sleep: 'Good' } };
  const result = buildSession(plan, context);

  assert.equal(result.decision, 'ready');
  assert.equal(result.adaptations.length, 0);
  assert.equal(result.items[0].sets, 3);
});
