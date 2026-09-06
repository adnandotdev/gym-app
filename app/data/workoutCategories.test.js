const test = require('node:test');
const assert = require('node:assert/strict');

const { exercises } = require('./exercises');
const { getExerciseVariations } = require('./exerciseVariations');
const {
  WORKOUT_CATEGORIES,
  getCategoryById,
  getCategoryExercises,
  getCategorySummary,
} = require('./workoutCategories');

test('uses stable unique categories with explicit ordered memberships', () => {
  const ids = WORKOUT_CATEGORIES.map((category) => category.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(WORKOUT_CATEGORIES.length >= 6);
  for (const category of WORKOUT_CATEGORIES) {
    assert.ok(category.title);
    assert.ok(category.items.length > 0);
    assert.equal(new Set(category.items.map((item) => item.variationId)).size, category.items.length);
  }
});

test('every configured family and variation resolves against the real library', () => {
  const familyIds = new Set(exercises.map((exercise) => exercise.id));
  for (const category of WORKOUT_CATEGORIES) {
    for (const item of category.items) {
      assert.ok(familyIds.has(item.familyId), `${category.id}: missing ${item.familyId}`);
      assert.ok(
        getExerciseVariations(item.familyId).some((variation) => variation.id === item.variationId),
        `${category.id}: missing ${item.variationId}`,
      );
    }
  }
});

test('side plank resolves the exact variation instead of all abs exercises', () => {
  const sidePlank = getCategoryExercises('both-side-plank');
  assert.deepEqual(sidePlank.map((exercise) => exercise.exerciseVariantId), ['abs-2--side']);
});

test('similar-looking homepage categories have distinct memberships', () => {
  const identities = (id) => getCategoryExercises(id).map((item) => item.exerciseVariantId);
  assert.notDeepEqual(identities('both-side-plank'), identities('abs-workout'));
  assert.notDeepEqual(identities('torso-trap-workout'), identities('lower-back-exercise'));
  assert.notDeepEqual(identities('full-body-warm-up'), identities('strength-exercise'));
});

test('summaries are derived from resolved membership and unknown categories are safe', () => {
  const summary = getCategorySummary('abs-workout');
  assert.equal(summary.exerciseCount, getCategoryExercises('abs-workout').length);
  assert.equal(getCategoryById('missing'), null);
  assert.deepEqual(getCategoryExercises('missing'), []);
  assert.equal(getCategorySummary('missing'), null);
});

test('resolved category arrays and exercises are safe consumer copies', () => {
  const first = getCategoryExercises('strength-exercise');
  const originalName = first[0].name;
  first[0].name = 'Changed';
  first.pop();

  const second = getCategoryExercises('strength-exercise');
  assert.equal(second[0].name, originalName);
  assert.ok(second.length > first.length);
});
