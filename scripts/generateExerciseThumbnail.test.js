const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const PROCESSOR = path.join(__dirname, 'generateExerciseThumbnail.swift');
const SOURCE = path.join(
  ROOT,
  'assets/images/exercises/demonstrations/glutes-3--heel-elevated/male-start.jpg',
);

const getJpegDimensions = (filePath) => {
  const buffer = fs.readFileSync(filePath);
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    const segmentLength = buffer.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xc3) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      };
    }
    offset += 2 + segmentLength;
  }
  throw new Error(`Could not read JPEG dimensions for ${filePath}`);
};

describe('exercise thumbnail processor', () => {
  it('creates a deterministic full-bleed 480x360 JPEG without an added canvas', () => {
    assert.equal(fs.existsSync(PROCESSOR), true, 'Missing thumbnail processor');
    const outputDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'exercise-thumb-'));
    const output = path.join(outputDirectory, 'male-thumbnail.jpg');
    fs.copyFileSync(SOURCE, output);
    const moduleCache = path.join(os.tmpdir(), 'exercise-thumb-swift-cache');
    fs.mkdirSync(moduleCache, { recursive: true });
    const result = spawnSync('swift', [
      '-module-cache-path',
      moduleCache,
      PROCESSOR,
      SOURCE,
      output,
    ], {
      cwd: ROOT,
      encoding: 'utf8',
    });

    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.equal(fs.existsSync(output), true);
    assert.deepEqual(getJpegDimensions(output), { width: 480, height: 360 });
    assert.ok(fs.statSync(output).size <= 60 * 1024);

    const source = fs.readFileSync(PROCESSOR, 'utf8');
    assert.doesNotMatch(source, /cropping\(to:|context\.fill|setFillColor|aspectFit/);
    assert.match(source, /sourceImage\.width \* 3 == sourceImage\.height \* 4/);
  });
});
