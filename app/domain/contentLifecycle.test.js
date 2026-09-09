const {
  canTransition,
  transitionContentState,
  isEligibleForProduction,
} = require('./contentLifecycle');
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

describe('Content Lifecycle', () => {
  describe('canTransition', () => {
    it('allows valid transitions', () => {
      assert.equal(canTransition('draft', 'in_review'), true);
      assert.equal(canTransition('in_review', 'approved'), true);
      assert.equal(canTransition('approved', 'published'), true);
      assert.equal(canTransition('published', 'retired'), true);
    });

    it('rejects invalid transitions', () => {
      assert.equal(canTransition('draft', 'published'), false);
      assert.equal(canTransition('retired', 'draft'), false);
      assert.equal(canTransition('draft', 'unknown_state'), false);
    });
  });

  describe('transitionContentState', () => {
    it('returns new object with updated state', () => {
      const content = { id: 'c1', reviewStatus: 'draft' };
      const updated = transitionContentState(content, 'in_review');
      assert.equal(updated.reviewStatus, 'in_review');
      assert.equal(updated.id, 'c1');
      assert.ok(updated.updatedAt > 0);
    });

    it('throws on invalid transition', () => {
      const content = { id: 'c1', reviewStatus: 'draft' };
      assert.throws(() => transitionContentState(content, 'published'), /Invalid content state transition/);
    });
  });

  describe('isEligibleForProduction', () => {
    it('returns true only for published content', () => {
      assert.equal(isEligibleForProduction({ reviewStatus: 'published' }), true);
      assert.equal(isEligibleForProduction({ reviewStatus: 'approved' }), false);
      assert.equal(isEligibleForProduction({ reviewStatus: 'draft' }), false);
    });
  });
});
