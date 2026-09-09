const test = require('node:test');
const assert = require('node:assert/strict');
const { generateWarmup } = require('./warmupGenerator');

test('F02: Generates warm-up including full body and muscle-specific items', () => {
  const plan = {
    items: [
      { primaryMuscles: ['Chest', 'Shoulders'] },
      { primaryMuscles: ['Abs'] }
    ]
  };

  const warmups = generateWarmup(plan);

  // Should have Full Body (Jumping Jacks) + Arm Circles + Torso Twists or Cat-Cow
  assert.ok(warmups.length >= 2);
  assert.equal(warmups[0].primaryMuscles.includes('Full Body'), true);
  assert.equal(warmups.every(w => w.isWarmup), true);
  assert.equal(warmups.every(w => w.phase === 'warmup'), true);
});

test('F02: Empty plan returns empty warmups', () => {
  const warmups = generateWarmup({ items: [] });
  assert.equal(warmups.length, 0);
});
