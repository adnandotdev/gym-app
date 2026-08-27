const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../..');

const getLibraryIds = () => {
  const source = fs.readFileSync(path.join(ROOT, 'app/data/exercises.js'), 'utf8');
  return [...source.matchAll(/\bid:\s*'([^']+)'/g)].map((match) => match[1]);
};

const readAppFile = (relativePath) =>
  fs.readFileSync(path.join(ROOT, relativePath), 'utf8');

describe('exercise variation catalog', () => {
  it('covers every current exercise family with a useful single-select set', () => {
    const { EXERCISE_VARIATIONS } = require('./exerciseVariations');
    const libraryIds = getLibraryIds();

    assert.deepEqual(Object.keys(EXERCISE_VARIATIONS).sort(), libraryIds.sort());

    libraryIds.forEach((familyId) => {
      const variations = EXERCISE_VARIATIONS[familyId];
      assert.ok(variations.length >= 3, `${familyId} needs at least three variations`);
      assert.equal(
        variations.filter((variation) => variation.isDefault).length,
        1,
        `${familyId} must have exactly one default`,
      );
    });
  });

  it('uses globally unique, complete and anatomy-safe variation records', () => {
    const { EXERCISE_VARIATIONS, VARIATION_GROUPS } = require('./exerciseVariations');
    const libraryIds = new Set(getLibraryIds());
    const variations = Object.values(EXERCISE_VARIATIONS).flat();

    assert.equal(new Set(variations.map((variation) => variation.id)).size, variations.length);

    variations.forEach((variation) => {
      assert.ok(variation.id.startsWith(`${variation.familyId}--`));
      assert.ok(variation.name.length > 2);
      assert.ok(variation.summary.length > 4);
      assert.ok(variation.setupCue.length > 4);
      assert.ok(variation.equipment.length > 1);
      assert.ok(variation.difficulty.length > 1);
      assert.ok(variation.primaryMuscles.length > 0);
      assert.ok(Array.isArray(variation.secondaryMuscles));
      assert.ok(VARIATION_GROUPS.includes(variation.group));
      assert.ok(libraryIds.has(variation.anatomyExerciseId));
    });
  });

  it('selects defaults safely and creates immutable workout records per variation', () => {
    const {
      buildVariationExercise,
      getDefaultVariation,
      getExerciseVariations,
      getSelectedVariation,
    } = require('./exerciseVariations');
    const parent = {
      id: 'back-2',
      name: 'Lat Pulldown',
      muscleGroup: 'Back',
      secondaryMuscles: ['Biceps'],
      equipment: 'Cable',
      difficulty: 'Beginner',
      sets: 4,
      reps: '10-12',
      instructions: ['Pull to the upper chest.'],
    };
    const variations = getExerciseVariations(parent.id);
    const selected = variations.find((variation) => !variation.isDefault);
    const workoutExercise = buildVariationExercise(parent, selected);

    assert.equal(getDefaultVariation(parent.id).isDefault, true);
    assert.equal(getSelectedVariation(parent.id, selected.id), selected);
    assert.equal(getSelectedVariation(parent.id, 'missing'), getDefaultVariation(parent.id));
    assert.equal(workoutExercise.id, selected.id);
    assert.equal(workoutExercise.exerciseFamilyId, parent.id);
    assert.equal(workoutExercise.exerciseVariantId, selected.id);
    assert.equal(workoutExercise.anatomyExerciseId, selected.anatomyExerciseId);
    assert.equal(workoutExercise.name, selected.name);
    assert.deepEqual(parent.secondaryMuscles, ['Biceps']);
    assert.deepEqual(parent.instructions, ['Pull to the upper chest.']);
    assert.notEqual(workoutExercise.secondaryMuscles, parent.secondaryMuscles);
    assert.notEqual(workoutExercise.instructions, parent.instructions);
  });

  it('keeps a saved non-default selection when older records only retain the variation id', () => {
    const { getExerciseVariations, getSelectedVariation } = require('./exerciseVariations');
    const selected = getExerciseVariations('back-2').find((variation) => !variation.isDefault);
    const savedExercise = {
      id: selected.id,
      exerciseFamilyId: 'back-2',
    };

    assert.equal(
      getSelectedVariation(
        savedExercise.exerciseFamilyId,
        savedExercise.exerciseVariantId || savedExercise.id,
      ),
      selected,
    );
  });

  it('does not inherit equipment-specific parent instructions into another variation', () => {
    const { buildVariationExercise, getExerciseVariations } = require('./exerciseVariations');
    const parent = {
      id: 'shoulder-1',
      name: 'Overhead Press',
      muscleGroup: 'Shoulders',
      secondaryMuscles: ['Triceps'],
      equipment: 'Barbell',
      difficulty: 'Intermediate',
      instructions: ['Hold the barbell at shoulder height.', 'Press the bar overhead.'],
    };
    const seatedDumbbell = getExerciseVariations(parent.id)
      .find((variation) => variation.id === 'shoulder-1--seated-dumbbell');
    const exercise = buildVariationExercise(parent, seatedDumbbell);

    assert.equal(exercise.instructions[0], seatedDumbbell.setupCue);
    assert.equal(exercise.instructions.length >= 3, true);
    assert.doesNotMatch(exercise.instructions.join(' '), /barbell/i);
    assert.doesNotMatch(exercise.instructions.join(' '), /press the bar/i);
  });

  it('builds a safe immutable detail fallback for unknown legacy exercises', () => {
    const { buildLegacyExerciseFallback } = require('./exerciseVariations');
    const legacy = {
      id: 'legacy-custom-1',
      name: 'Saved Custom Exercise',
      muscleGroup: 'Full Body',
      instructions: ['Move with control.'],
    };
    const fallback = buildLegacyExerciseFallback(legacy);

    assert.equal(fallback.id, legacy.id);
    assert.equal(fallback.anatomyExerciseId, legacy.id);
    assert.deepEqual(fallback.primaryMuscles, ['Full Body']);
    assert.deepEqual(fallback.secondaryMuscles, []);
    assert.deepEqual(fallback.instructions, legacy.instructions);
    assert.notEqual(fallback.instructions, legacy.instructions);
  });

  it('resolves a saved variation back to its library family', () => {
    const { resolveExerciseFamily } = require('./exerciseVariations');
    const library = [
      { id: 'back-2', name: 'Lat Pulldown' },
      { id: 'back-3', name: 'Barbell Row' },
    ];

    assert.equal(
      resolveExerciseFamily({ id: 'back-2--close-neutral', exerciseFamilyId: 'back-2' }, library),
      library[0],
    );
    assert.equal(resolveExerciseFamily(library[1], library), library[1]);
    assert.equal(resolveExerciseFamily({ id: 'missing' }, library), null);
  });
});

describe('exercise variation interface contracts', () => {
  it('uses an accessible single-select native sheet and a concrete workout record', () => {
    const detailSource = readAppFile('app/screens/user/ExerciseDetailScreen.js');
    const sheetSource = readAppFile('app/screens/user/ExerciseVariationSheet.js');

    assert.match(detailSource, /getSelectedVariation/);
    assert.match(detailSource, /buildVariationExercise/);
    assert.match(detailSource, /routeExercise\.exerciseVariantId \|\| routeExercise\.id/);
    assert.match(detailSource, /hasVariations/);
    assert.match(detailSource, /anatomyExerciseId/);
    assert.match(detailSource, /Choose Variation/);
    assert.match(detailSource, /Add Another Variation/);
    assert.match(detailSource, /navigation\.navigate\('AddToPlan',\s*\{ exercise: selectedExercise \}\)/);
    assert.match(sheetSource, /presentationStyle="pageSheet"/);
    assert.match(sheetSource, /accessibilityRole="radio"/);
    assert.equal(
      (sheetSource.match(/accessibilityRole="radiogroup"/g) || []).length,
      1,
      'one global selection must expose one radiogroup',
    );
    assert.match(sheetSource, /accessibilityState=\{\{ checked: selected \}\}/);
    assert.match(sheetSource, /accessibilityViewIsModal/);
  });

  it('surfaces family counts and persists variation identity', () => {
    const librarySource = readAppFile('app/screens/user/ExerciseLibraryScreen.js');
    const schemaSource = readAppFile('backend/models/WorkoutPlan.js');

    assert.match(librarySource, /getVariationCount/);
    assert.match(librarySource, /variations/);
    assert.match(schemaSource, /exerciseFamilyId/);
    assert.match(schemaSource, /exerciseVariantId/);
    assert.match(schemaSource, /anatomyExerciseId/);
    assert.match(schemaSource, /variationSummary/);
    assert.match(schemaSource, /primaryMuscles/);
  });

  it('uses real saved ids instead of fabricating a default variation identity', () => {
    const routeSource = readAppFile('backend/routes/workoutPlan.js');
    const memorySource = readAppFile('backend/utils/devMemoryStore.js');

    assert.doesNotMatch(routeSource, /exerciseFamilyId\}--default/);
    assert.doesNotMatch(memorySource, /exerciseFamilyId\}--default/);

    const memoryStore = require('../../backend/utils/devMemoryStore');
    const userId = `variation-test-${Date.now()}`;
    const partialDefault = {
      id: 'back-2--medium-pronated',
      name: 'Lat Pulldown',
      exerciseFamilyId: 'back-2',
      isDefaultVariation: true,
    };
    memoryStore.setWorkoutPlanDay(userId, 'Monday', [partialDefault]);

    const result = memoryStore.addWorkoutExercise(userId, 'Monday', {
      ...partialDefault,
      exerciseVariantId: partialDefault.id,
    });

    assert.equal(result.duplicate, true);
    assert.equal(result.exercises.length, 1);
  });
});
