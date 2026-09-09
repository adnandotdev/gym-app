const CONTENT_STATES = Object.freeze([
  'draft',
  'in_review',
  'approved',
  'published',
  'retired',
]);

const VALID_TRANSITIONS = Object.freeze({
  draft: ['in_review'],
  in_review: ['approved', 'draft'], // draft here acts as "changes_requested"
  approved: ['published', 'draft', 'retired'],
  published: ['retired', 'draft'], // back to draft if a revision is needed
  retired: [], // Terminal state
});

const canTransition = (currentState, nextState) => {
  if (!CONTENT_STATES.includes(currentState) || !CONTENT_STATES.includes(nextState)) {
    return false;
  }
  const validNextStates = VALID_TRANSITIONS[currentState] || [];
  return validNextStates.includes(nextState);
};

const transitionContentState = (content, nextState) => {
  const currentState = content.reviewStatus || 'draft';
  if (!canTransition(currentState, nextState)) {
    throw new Error(`Invalid content state transition from ${currentState} to ${nextState}`);
  }
  return {
    ...content,
    reviewStatus: nextState,
    updatedAt: Date.now(),
  };
};

const isEligibleForProduction = (content) => {
  return content && content.reviewStatus === 'published';
};

module.exports = {
  CONTENT_STATES,
  VALID_TRANSITIONS,
  canTransition,
  transitionContentState,
  isEligibleForProduction,
};
