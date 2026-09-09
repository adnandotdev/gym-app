const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const source = fs.readFileSync(__filename.replace(/\.test\.js$/, '.js'), 'utf8');

test('fitness-level choices use meaningful icons instead of initial placeholders', () => {
  assert.match(source, /walk-outline/);
  assert.match(source, /fitness-outline/);
  assert.match(source, /barbell-outline/);
  assert.doesNotMatch(source, /charAt\(0\)|placeholderRect|placeholderText/);
  assert.doesNotMatch(source, /#[0-9A-Fa-f]{6}/);
});

test('fitness-level choices expose clear selection semantics and guidance', () => {
  assert.match(source, /Choose the option that best matches your current training experience\./);
  assert.match(source, /accessibilityRole="radio"/);
  assert.match(source, /accessibilityState=\{\{ selected: isSelected \}\}/);
  assert.match(source, /styles\.radioOuter/);
  assert.match(source, /styles\.radioInner/);
});
