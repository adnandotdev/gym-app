const { exercises } = require('./exercises');
const {
  buildVariationExercise,
  getSelectedVariation,
} = require('./exerciseVariations');

const createCategory = (id, title, description, items) => Object.freeze({
  id,
  title,
  description,
  items: Object.freeze(items.map((item) => Object.freeze({ ...item }))),
});

const WORKOUT_CATEGORIES = Object.freeze([
  createCategory(
    'full-body-warm-up',
    'Full Body Warm Up',
    'A lower-intensity bodyweight and resistance-band preparation sequence from the current library.',
    [
      { familyId: 'chest-3', variationId: 'chest-3--incline' },
      { familyId: 'abs-2', variationId: 'abs-2--high' },
      { familyId: 'shoulder-6', variationId: 'shoulder-6--banded' },
      { familyId: 'abs-1', variationId: 'abs-1--reverse' },
      { familyId: 'legs-6', variationId: 'legs-6--single-leg' },
      { familyId: 'glutes-5', variationId: 'glutes-5--band' },
    ],
  ),
  createCategory(
    'strength-exercise',
    'Strength Exercise',
    'A balanced selection of compound and accessory strength movements.',
    [
      { familyId: 'chest-1', variationId: 'chest-1--flat-medium-grip' },
      { familyId: 'back-1', variationId: 'back-1--pronated' },
      { familyId: 'shoulder-1', variationId: 'shoulder-1--standing-barbell' },
      { familyId: 'arms-1', variationId: 'arms-1--medium-grip' },
      { familyId: 'abs-2', variationId: 'abs-2--forearm' },
      { familyId: 'legs-1', variationId: 'legs-1--high-bar' },
      { familyId: 'glutes-1', variationId: 'glutes-1--barbell' },
    ],
  ),
  createCategory(
    'both-side-plank',
    'Both Side Plank',
    'The exact Side Plank variation. Complete the prescribed hold on both sides.',
    [{ familyId: 'abs-2', variationId: 'abs-2--side' }],
  ),
  createCategory(
    'abs-workout',
    'Abs Workout',
    'Core flexion, anti-extension, rotation, and hip-control movements.',
    [
      { familyId: 'abs-1', variationId: 'abs-1--standard' },
      { familyId: 'abs-2', variationId: 'abs-2--forearm' },
      { familyId: 'abs-3', variationId: 'abs-3--straight-leg' },
      { familyId: 'abs-4', variationId: 'abs-4--feet-down' },
      { familyId: 'abs-5', variationId: 'abs-5--kneeling-rope' },
    ],
  ),
  createCategory(
    'torso-trap-workout',
    'Torso and Trap Workout',
    'Upper-back, rear-shoulder, trapezius, and trunk-control movements.',
    [
      { familyId: 'back-3', variationId: 'back-3--wide-grip' },
      { familyId: 'back-4', variationId: 'back-4--wide-pronated' },
      { familyId: 'shoulder-4', variationId: 'shoulder-4--standard' },
      { familyId: 'shoulder-6', variationId: 'shoulder-6--rope-forehead' },
      { familyId: 'abs-4', variationId: 'abs-4--cable-rotation' },
    ],
  ),
  createCategory(
    'lower-back-exercise',
    'Lower Back Exercise',
    'Posterior-chain movements where the lower back stabilizes or extends the torso.',
    [
      { familyId: 'legs-3', variationId: 'legs-3--barbell' },
      { familyId: 'back-3', variationId: 'back-3--pronated' },
      { familyId: 'back-5', variationId: 'back-5--chest-supported' },
      { familyId: 'glutes-4', variationId: 'glutes-4--standard' },
      { familyId: 'glutes-5', variationId: 'glutes-5--rope' },
    ],
  ),
]);

const getCategoryById = (categoryId) => (
  WORKOUT_CATEGORIES.find((category) => category.id === categoryId) || null
);

const getCategoryExercises = (categoryId, catalog = exercises) => {
  const category = getCategoryById(categoryId);
  if (!category || !Array.isArray(catalog)) return [];

  return category.items.reduce((resolved, item) => {
    const parent = catalog.find((exercise) => exercise.id === item.familyId);
    const variation = getSelectedVariation(item.familyId, item.variationId);
    const exercise = buildVariationExercise(parent, variation);
    if (!exercise || exercise.exerciseVariantId !== item.variationId) return resolved;
    return [...resolved, exercise];
  }, []);
};

const getCategorySummary = (categoryId, catalog = exercises) => {
  const category = getCategoryById(categoryId);
  if (!category) return null;
  const categoryExercises = getCategoryExercises(categoryId, catalog);

  return {
    id: category.id,
    title: category.title,
    description: category.description,
    exerciseCount: categoryExercises.length,
  };
};

module.exports = {
  WORKOUT_CATEGORIES,
  getCategoryById,
  getCategoryExercises,
  getCategorySummary,
};
