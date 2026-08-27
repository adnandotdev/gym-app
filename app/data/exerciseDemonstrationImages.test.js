const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { EXERCISE_VARIATIONS } = require('./exerciseVariations');

const ROOT = path.resolve(__dirname, '../..');
const REGISTRY_PATH = path.join(__dirname, 'exerciseDemonstrationImages.js');
const DEMO_ROOT = path.join(ROOT, 'assets/images/exercises/demonstrations');
const EXPECTED_WIDTH = 768;
const EXPECTED_HEIGHT = 576;
const MAX_FILE_BYTES = 220 * 1024;

const getJpegDimensions = (filePath) => {
  const buffer = fs.readFileSync(filePath);
  assert.equal(buffer[0], 0xff, `${filePath} is not a JPEG`);
  assert.equal(buffer[1], 0xd8, `${filePath} is not a JPEG`);

  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];
    const segmentLength = buffer.readUInt16BE(offset + 2);
    const isStartOfFrame = marker >= 0xc0 && marker <= 0xc3;
    if (isStartOfFrame) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      };
    }
    offset += 2 + segmentLength;
  }

  throw new Error(`Could not read JPEG dimensions for ${filePath}`);
};

const getExpectedVariationIds = () =>
  Object.values(EXERCISE_VARIATIONS)
    .flat()
    .map((variation) => variation.id)
    .sort();

const loadResolver = () => {
  const source = fs.readFileSync(REGISTRY_PATH, 'utf8').replace(
    /require\('(\.\.\/\.\.\/assets\/images\/exercises\/demonstrations\/[^']+\.jpg)'\)/g,
    "'$1'",
  );
  const module = { exports: {} };
  const evaluate = new Function('module', 'exports', 'require', source);
  evaluate(module, module.exports, require);
  return module.exports;
};

describe('male exercise demonstration imagery', () => {
  it('registers start and finish images for every variation with static Metro requires', () => {
    const source = fs.readFileSync(REGISTRY_PATH, 'utf8');
    const registeredIds = [...source.matchAll(/'([^']+--[^']+)':\s*Object\.freeze\(\{/g)]
      .map((match) => match[1])
      .sort();

    assert.deepEqual(registeredIds, getExpectedVariationIds());
    assert.match(source, /start:\s*require\('\.\.\/\.\.\/assets\/images\/exercises\/demonstrations\//);
    assert.match(source, /male-start\.jpg/);
    assert.match(source, /finish:\s*require\('\.\.\/\.\.\/assets\/images\/exercises\/demonstrations\//);
    assert.match(source, /male-finish\.jpg/);
  });

  it('keeps all 320 male display assets complete, consistent and bundle-conscious', () => {
    const expectedIds = getExpectedVariationIds();
    const files = expectedIds.flatMap((variationId) => [
      path.join(DEMO_ROOT, variationId, 'male-start.jpg'),
      path.join(DEMO_ROOT, variationId, 'male-finish.jpg'),
    ]);

    assert.equal(files.length, 320);
    files.forEach((filePath) => {
      assert.equal(fs.existsSync(filePath), true, `Missing ${filePath}`);
      assert.deepEqual(getJpegDimensions(filePath), {
        width: EXPECTED_WIDTH,
        height: EXPECTED_HEIGHT,
      });
      assert.ok(
        fs.statSync(filePath).size <= MAX_FILE_BYTES,
        `${filePath} exceeds ${MAX_FILE_BYTES} bytes`,
      );
    });

    const hashes = files.map((filePath) =>
      crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex'));
    assert.equal(new Set(hashes).size, files.length, 'Every movement phase must be unique');
  });

  it('resolves selected demonstrations and falls back to the family default', () => {
    const {
      getDefaultExerciseDemonstration,
      resolveExerciseDemonstration,
    } = loadResolver();
    const selected = EXERCISE_VARIATIONS['back-2'][2];

    assert.equal(resolveExerciseDemonstration(selected.id), resolveExerciseDemonstration(selected.id));
    assert.equal(
      resolveExerciseDemonstration('missing', 'back-2'),
      getDefaultExerciseDemonstration('back-2'),
    );
    assert.equal(resolveExerciseDemonstration('missing', 'missing'), null);
  });

  it('places movement imagery before the separate anatomy section and uses it in library cards', () => {
    const detailSource = fs.readFileSync(
      path.join(ROOT, 'app/screens/user/ExerciseDetailScreen.js'),
      'utf8',
    );
    const librarySource = fs.readFileSync(
      path.join(ROOT, 'app/screens/user/ExerciseLibraryScreen.js'),
      'utf8',
    );

    const sheetSource = fs.readFileSync(
      path.join(ROOT, 'app/screens/user/ExerciseVariationSheet.js'),
      'utf8',
    );
    const planSource = fs.readFileSync(
      path.join(ROOT, 'app/screens/user/WorkoutPlanScreen.js'),
      'utf8',
    );
    const addToPlanSource = fs.readFileSync(
      path.join(ROOT, 'app/screens/user/AddToPlanSheetScreen.js'),
      'utf8',
    );

    assert.match(detailSource, /ExerciseDemonstrationViewer/);
    assert.ok(
      detailSource.indexOf('<ExerciseDemonstrationViewer')
        < detailSource.indexOf('<MuscleVisualizer'),
      'movement demonstration must appear before anatomy',
    );
    assert.match(detailSource, /variationId=\{selectedExercise\.exerciseVariantId\}/);
    assert.match(librarySource, /getDefaultExerciseDemonstration/);
    assert.match(librarySource, /demonstration\.start/);
    assert.match(sheetSource, /resolveExerciseDemonstration/);
    assert.match(sheetSource, /variation\.id/);
    assert.match(sheetSource, /variation\.equipment/);
    assert.match(planSource, /resolveExerciseDemonstration/);
    assert.match(planSource, /item\.exerciseVariantId \|\| item\.id/);
    assert.match(planSource, /demonstration\.start/);
    assert.match(addToPlanSource, /resolveExerciseDemonstration/);
    assert.match(addToPlanSource, /exercise\.exerciseVariantId \|\| exercise\.id/);
    assert.match(addToPlanSource, /demonstration\.start/);
  });

  it('provides accessible start and finish controls without mixing in anatomy overlays', () => {
    const source = fs.readFileSync(
      path.join(ROOT, 'app/components/ExerciseDemonstrationViewer.js'),
      'utf8',
    );

    assert.match(source, /accessibilityRole="tab"/);
    assert.match(source, /accessibilityState=\{\{ selected:/);
    assert.match(source, /Start position/);
    assert.match(source, /Finish position/);
    assert.match(source, /resizeMode="cover"/);
    assert.doesNotMatch(source, /primaryMuscles|secondaryMuscles|highlight/);
  });
});
