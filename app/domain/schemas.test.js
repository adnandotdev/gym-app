const {
  safeParse,
  parseExerciseGuidanceV2,
  parseCaution,
  parseUserPreferences,
} = require('./schemas');
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

describe('Schemas', () => {
  describe('parseExerciseGuidanceV2', () => {
    it('validates correct guidance data', () => {
      const validData = {
        exerciseVariationId: 'chest-1--flat-medium-grip',
        movementPatterns: ['horizontal-push'],
        requiredEquipmentIds: ['barbell', 'flat-bench'],
        optionalEquipmentIds: [],
        contentVersion: '1.0.0',
        reviewStatus: 'approved',
      };

      const result = safeParse(validData, parseExerciseGuidanceV2);
      assert.equal(result.success, true);
      assert.equal(result.data.exerciseVariationId, 'chest-1--flat-medium-grip');
    });

    it('fails on invalid movement pattern', () => {
      const invalidData = {
        exerciseVariationId: 'chest-1--flat-medium-grip',
        movementPatterns: ['unknown-pattern'],
        requiredEquipmentIds: [],
        contentVersion: '1.0.0',
        reviewStatus: 'approved',
      };

      const result = safeParse(invalidData, parseExerciseGuidanceV2);
      assert.equal(result.success, false);
      assert.match(result.error, /Unknown movement pattern/);
    });

    it('fails on missing required fields', () => {
      const result = safeParse({}, parseExerciseGuidanceV2);
      assert.equal(result.success, false);
    });
  });

  describe('parseCaution', () => {
    it('validates correct caution data', () => {
      const validData = {
        id: 'caution-1',
        userId: 'user-1',
        area: 'knee',
        status: 'active',
        movementsToAvoid: ['squat', 'lunges'],
        updatedAt: 123456789,
      };

      const result = safeParse(validData, parseCaution);
      assert.equal(result.success, true);
    });

    it('fails on invalid status', () => {
      const invalidData = {
        id: 'caution-1',
        userId: 'user-1',
        area: 'knee',
        status: 'bad-status',
        movementsToAvoid: [],
      };

      const result = safeParse(invalidData, parseCaution);
      assert.equal(result.success, false);
    });
  });

  describe('parseUserPreferences', () => {
    it('validates correct user preferences', () => {
      const validData = {
        guidanceLevel: 'intermediate',
        preferredUnits: 'metric',
        enabledFormTips: false,
        enabledReadinessCheck: true,
      };

      const result = safeParse(validData, parseUserPreferences);
      assert.equal(result.success, true);
      assert.equal(result.data.enabledFormTips, false);
      assert.equal(result.data.defaultEquipmentProfileId, null);
    });
  });
});
