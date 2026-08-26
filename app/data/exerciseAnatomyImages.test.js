const { before, describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '../..');
const GENDERS = ['male', 'female'];
const VIEWS = ['front', 'back'];

before(() => {
  require.extensions['.png'] = (module, filename) => {
    module.exports = filename;
  };
});

const getLibraryIds = () => {
  const source = fs.readFileSync(path.join(ROOT, 'app/data/exercises.js'), 'utf8');
  return [...source.matchAll(/\bid:\s*'([^']+)'/g)].map((match) => match[1]);
};

const loadResolver = () => require('./exerciseAnatomyImages');

const readPngDimensions = (source) => {
  const png = fs.readFileSync(source);
  return {
    width: png.readUInt32BE(16),
    height: png.readUInt32BE(20),
  };
};

describe('exercise anatomy asset coverage', () => {
  it('does not cover anatomy images with title-mask rectangles', () => {
    const componentSource = fs.readFileSync(
      path.join(ROOT, 'app/components/MuscleVisualizer.js'),
      'utf8'
    );
    const librarySource = fs.readFileSync(
      path.join(ROOT, 'app/screens/user/ExerciseLibraryScreen.js'),
      'utf8'
    );

    assert.doesNotMatch(componentSource, /titleMask|frontTitleMask|backTitleMask/);
    assert.doesNotMatch(librarySource, /cardImageTitleMask/);
  });

  it('reads every current Exercise Library ID exactly once', () => {
    const libraryIds = getLibraryIds();

    assert.equal(libraryIds.length, 40);
    assert.equal(new Set(libraryIds).size, libraryIds.length);
  });

  it('has an explicit catalog entry for every and only library exercise', () => {
    const { EXERCISE_ANATOMY_IMAGES } = loadResolver();
    const libraryIds = getLibraryIds();

    assert.deepEqual(Object.keys(EXERCISE_ANATOMY_IMAGES).sort(), libraryIds.sort());
  });

  it('resolves four separate physical PNG files for every exercise', () => {
    const {
      EXERCISE_ANATOMY_IMAGES,
      NEUTRAL_ANATOMY_IMAGES,
      resolveExerciseAnatomyImage,
    } = loadResolver();
    const neutralPaths = new Set(
      GENDERS.flatMap((gender) =>
        VIEWS.map((view) => NEUTRAL_ANATOMY_IMAGES[gender][view])
      )
    );
    const allPaths = [];

    getLibraryIds().forEach((exerciseId) => {
      GENDERS.forEach((gender) => {
        VIEWS.forEach((view) => {
          const source = resolveExerciseAnatomyImage(exerciseId, gender, view);
          const expected = path.join(
            ROOT,
            'assets/images/exercises/anatomy',
            exerciseId,
            `${gender}-${view}.png`
          );

          assert.equal(source, expected);
          assert.equal(source, EXERCISE_ANATOMY_IMAGES[exerciseId][gender][view]);
          assert.equal(neutralPaths.has(source), false);
          assert.equal(fs.statSync(source).isFile(), true);
          assert.deepEqual(
            [...fs.readFileSync(source).subarray(0, 8)],
            [137, 80, 78, 71, 13, 10, 26, 10]
          );
          allPaths.push(source);
        });
      });
    });

    assert.equal(allPaths.length, 160);
    assert.equal(new Set(allPaths).size, 160);
    assert.equal(new Set(allPaths.map((source) => fs.realpathSync(source))).size, 160);
    assert.equal(
      new Set(
        allPaths.map((source) => {
          const stat = fs.statSync(source);
          return `${stat.dev}:${stat.ino}`;
        })
      ).size,
      160
    );
  });

  it('keeps every exercise image on the thumbnail frame aspect ratio', () => {
    const { resolveExerciseAnatomyImage } = loadResolver();

    getLibraryIds().forEach((exerciseId) => {
      GENDERS.forEach((gender) => {
        VIEWS.forEach((view) => {
          const dimensions = readPngDimensions(
            resolveExerciseAnatomyImage(exerciseId, gender, view)
          );

          assert.deepEqual(dimensions, { width: 849, height: 926 });
        });
      });
    });
  });

  it('uses neutral views only for unknown exercise IDs', () => {
    const { NEUTRAL_ANATOMY_IMAGES, resolveExerciseAnatomyImage } = loadResolver();

    assert.equal(
      resolveExerciseAnatomyImage('not-in-library', 'Male', 'front'),
      NEUTRAL_ANATOMY_IMAGES.male.front
    );
    assert.equal(
      resolveExerciseAnatomyImage('not-in-library', ' female ', 'back'),
      NEUTRAL_ANATOMY_IMAGES.female.back
    );
    assert.equal(
      resolveExerciseAnatomyImage(undefined, undefined, 'front'),
      NEUTRAL_ANATOMY_IMAGES.male.front
    );
  });
});
