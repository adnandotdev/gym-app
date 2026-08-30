const { it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const PROCESSOR = path.join(__dirname, 'processExerciseDemonstrationDiptych.sh');

const createPortraitBmp = (filePath, width = 120, height = 180, whiteRow = null) => {
  const rowSize = Math.ceil((width * 3) / 4) * 4;
  const pixelBytes = rowSize * height;
  const buffer = Buffer.alloc(54 + pixelBytes);
  buffer.write('BM', 0, 2, 'ascii');
  buffer.writeUInt32LE(buffer.length, 2);
  buffer.writeUInt32LE(54, 10);
  buffer.writeUInt32LE(40, 14);
  buffer.writeInt32LE(width, 18);
  buffer.writeInt32LE(height, 22);
  buffer.writeUInt16LE(1, 26);
  buffer.writeUInt16LE(24, 28);
  buffer.writeUInt32LE(pixelBytes, 34);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = 54 + y * rowSize + x * 3;
      const isWhiteRow = y === whiteRow;
      buffer[offset] = isWhiteRow ? 255 : 40 + (x % 80);
      buffer[offset + 1] = isWhiteRow ? 255 : 50 + (y % 90);
      buffer[offset + 2] = isWhiteRow ? 255 : 70 + ((x + y) % 100);
    }
  }
  fs.writeFileSync(filePath, buffer);
};

it('rejects a plain 2:3 portrait that has no real diptych divider', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'exercise-diptych-'));
  const source = path.join(workspace, 'single-portrait.bmp');
  const output = path.join(workspace, 'output');
  createPortraitBmp(source);

  const result = spawnSync(PROCESSOR, [source, output], {
    cwd: ROOT,
    encoding: 'utf8',
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /divider/i);
  assert.equal(fs.existsSync(path.join(output, 'male-start.jpg')), false);
  assert.equal(fs.existsSync(path.join(output, 'male-finish.jpg')), false);

  const verifiedOutput = path.join(workspace, 'verified-output');
  const verifiedResult = spawnSync(PROCESSOR, [
    source,
    verifiedOutput,
    '--allow-equal-split',
  ], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  assert.equal(verifiedResult.status, 0, verifiedResult.stderr || verifiedResult.stdout);
  assert.equal(fs.existsSync(path.join(verifiedOutput, 'male-start.jpg')), true);
  assert.equal(fs.existsSync(path.join(verifiedOutput, 'male-finish.jpg')), true);

  const falseDividerSource = path.join(workspace, 'false-divider.bmp');
  const falseDividerOutput = path.join(workspace, 'false-divider-output');
  createPortraitBmp(falseDividerSource, 120, 180, 80);
  const forcedEqualResult = spawnSync(PROCESSOR, [
    falseDividerSource,
    falseDividerOutput,
    '--allow-equal-split',
  ], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  assert.equal(forcedEqualResult.status, 0, forcedEqualResult.stderr || forcedEqualResult.stdout);
});
