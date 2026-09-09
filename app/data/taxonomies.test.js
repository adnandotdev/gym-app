const {
  EQUIPMENT_CATEGORIES,
  CANONICAL_EQUIPMENT,
  MOVEMENT_PATTERNS,
  normalizeEquipmentAlias,
  getEquipmentById,
  isValidMovementPattern,
} = require('./taxonomies');
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

describe('Taxonomies', () => {
  describe('normalizeEquipmentAlias', () => {
    it('normalizes exact IDs', () => {
      assert.equal(normalizeEquipmentAlias('dumbbell'), 'dumbbell');
      assert.equal(normalizeEquipmentAlias('barbell'), 'barbell');
    });

    it('normalizes exact names case-insensitively', () => {
      assert.equal(normalizeEquipmentAlias('Dumbbell'), 'dumbbell');
      assert.equal(normalizeEquipmentAlias('BARBELL'), 'barbell');
    });

    it('normalizes known aliases case-insensitively', () => {
      assert.equal(normalizeEquipmentAlias('dumbbells'), 'dumbbell');
      assert.equal(normalizeEquipmentAlias('OLYMPIC BAR'), 'barbell');
      assert.equal(normalizeEquipmentAlias('mat'), 'floor-mat');
    });

    it('returns null for unknown aliases', () => {
      assert.equal(normalizeEquipmentAlias('unknown machine'), null);
      assert.equal(normalizeEquipmentAlias(null), null);
      assert.equal(normalizeEquipmentAlias(123), null);
    });
  });

  describe('getEquipmentById', () => {
    it('returns the canonical equipment object for a valid ID', () => {
      const eq = getEquipmentById('dumbbell');
      assert.deepEqual(eq, {
        id: 'dumbbell',
        name: 'Dumbbell',
        category: 'dumbbell',
        aliases: ['dumbbells'],
      });
    });

    it('returns null for an invalid ID', () => {
      assert.equal(getEquipmentById('unknown'), null);
    });
  });

  describe('isValidMovementPattern', () => {
    it('returns true for known movement patterns', () => {
      assert.equal(isValidMovementPattern('horizontal-push'), true);
      assert.equal(isValidMovementPattern('squat'), true);
    });

    it('returns false for unknown movement patterns', () => {
      assert.equal(isValidMovementPattern('unknown-pattern'), false);
      assert.equal(isValidMovementPattern(''), false);
    });
  });
});
