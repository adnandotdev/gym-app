// Feature flags manage phased rollouts and safe feature toggling
// The framework supports local defaults and an interface for remote overrides

const DEFAULT_FLAGS = Object.freeze({
  readinessCheck: false, // Phase 3
  adaptiveWarmup: false, // Phase 3
  smartSubstitutions: false, // Phase 4
  painAwareRules: false, // Phase 5
  progressionSuggestions: false, // Phase 6
});

let _currentFlags = { ...DEFAULT_FLAGS };

const getFeatureFlag = (flagName) => {
  return !!_currentFlags[flagName];
};

const setFeatureFlags = (overrides) => {
  _currentFlags = {
    ..._currentFlags,
    ...overrides,
  };
};

const resetFeatureFlags = () => {
  _currentFlags = { ...DEFAULT_FLAGS };
};

// Returns a snapshot of all active flags
const getAllFlags = () => {
  return { ..._currentFlags };
};

module.exports = {
  getFeatureFlag,
  setFeatureFlags,
  resetFeatureFlags,
  getAllFlags,
};
