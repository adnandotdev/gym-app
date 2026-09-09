const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const source = fs.readFileSync(__filename.replace(/\.test\.js$/, '.js'), 'utf8');

test('login page does not show social sign-in placeholders', () => {
  assert.doesNotMatch(source, /Social sign-in/i);
  assert.doesNotMatch(source, /styles\.social(Row|Button|Text|Note)/);
  assert.doesNotMatch(source, /styles\.divider(Row)?/);
});
