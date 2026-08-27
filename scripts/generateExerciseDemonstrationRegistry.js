const fs = require('node:fs');
const path = require('node:path');
const { EXERCISE_VARIATIONS } = require('../app/data/exerciseVariations');

const ROOT = path.resolve(__dirname, '..');
const OUTPUT_PATH = path.join(ROOT, 'app/data/exerciseDemonstrationImages.js');
const variationIds = Object.values(EXERCISE_VARIATIONS)
  .flat()
  .map((variation) => variation.id)
  .sort();

const entries = variationIds.map((variationId) => `  '${variationId}': Object.freeze({
    start: require('../../assets/images/exercises/demonstrations/${variationId}/male-start.jpg'),
    finish: require('../../assets/images/exercises/demonstrations/${variationId}/male-finish.jpg'),
  }),`).join('\n');

const source = `const { getDefaultVariation } = require('./exerciseVariations');

const MALE_EXERCISE_DEMONSTRATIONS = Object.freeze({
${entries}
});

const normalizeGender = (gender) => String(gender || 'male').trim().toLowerCase();

const getDefaultExerciseDemonstration = (familyId, gender = 'male') => {
  if (normalizeGender(gender) !== 'male') return null;
  const defaultVariation = getDefaultVariation(familyId);
  return defaultVariation
    ? MALE_EXERCISE_DEMONSTRATIONS[defaultVariation.id] || null
    : null;
};

const resolveExerciseDemonstration = (variationId, familyId, gender = 'male') => {
  if (normalizeGender(gender) !== 'male') return null;
  if (MALE_EXERCISE_DEMONSTRATIONS[variationId]) {
    return MALE_EXERCISE_DEMONSTRATIONS[variationId];
  }

  return getDefaultExerciseDemonstration(familyId || variationId, gender);
};

module.exports = {
  MALE_EXERCISE_DEMONSTRATIONS,
  getDefaultExerciseDemonstration,
  resolveExerciseDemonstration,
};
`;

fs.writeFileSync(OUTPUT_PATH, source);
console.log(`Wrote ${variationIds.length} demonstration entries to ${OUTPUT_PATH}`);
