// Decision Engine interfaces and core precedence skeleton
// Phase 0: Pure eligibility/decision interfaces with reason codes.

const DECISION_REASONS = Object.freeze({
  SAFETY_BLOCK: 'safety_block',
  EQUIPMENT_UNAVAILABLE: 'equipment_unavailable',
  INTENT_MISMATCH: 'intent_mismatch',
  READINESS_ADAPTED: 'readiness_adapted',
  LEVEL_ADAPTED: 'level_adapted',
  HISTORY_PROGRESSION: 'history_progression',
  CONVENIENCE: 'convenience',
});

// A pure interface that evaluates a single item against constraints
const evaluateEligibility = (candidate, context) => {
  const { cautions = [], equipmentProfile = null, readiness = null } = context;

  const reasons = [];

  // 1. Safety Block (Stub)
  if (cautions.some(c => c.movementsToAvoid.includes(candidate.movementPattern))) {
    return { isEligible: false, blockReason: DECISION_REASONS.SAFETY_BLOCK };
  }

  // 2. Equipment Availability (Stub)
  if (equipmentProfile && candidate.requiredEquipmentIds) {
    const missing = candidate.requiredEquipmentIds.find(eq => !equipmentProfile.availableEquipmentIds.includes(eq));
    if (missing) {
      return { isEligible: false, blockReason: DECISION_REASONS.EQUIPMENT_UNAVAILABLE };
    }
  }

  // 3. Readiness Adaptations (F06)
  const adaptations = [];
  if (readiness) {
    if (readiness.soreness === 'Pain') {
      return { isEligible: false, blockReason: DECISION_REASONS.SAFETY_BLOCK };
    }

    if (readiness.energy === 'Low' || readiness.sleep === 'Poor') {
      adaptations.push({
        type: 'reduce_volume',
        reason: DECISION_REASONS.READINESS_ADAPTED,
        message: 'Volume reduced due to fatigue.',
      });
    }
  }

  // If we pass hard gates, it's eligible, but we may have adaptation reasons
  return { isEligible: true, adaptations };
};

// Top-level session builder stub
const buildSession = (plan, context) => {
  // In Phase 0, we just return the plan as-is or blocked if hard rules fail.
  // Full cross-feature interactions are implemented in subsequent phases.

  const items = [];
  const warnings = [];
  const adaptations = [];
  let blocked = false;

  for (const item of plan.items) {
    const result = evaluateEligibility(item, context);
    if (!result.isEligible) {
      blocked = true;
      warnings.push({
        itemId: item.id,
        reason: result.blockReason,
        message: `Item blocked due to ${result.blockReason}`,
      });
    } else {
      // Apply F06 Adaptations
      let adaptedItem = { ...item, status: 'pending' };
      if (result.adaptations && result.adaptations.length > 0) {
        adaptations.push(...result.adaptations);

        // Apply volume reduction if requested
        if (result.adaptations.some(a => a.type === 'reduce_volume')) {
          adaptedItem.sets = Math.max(1, (adaptedItem.sets || 3) - 1);
          adaptedItem.reps = Math.max(5, (adaptedItem.reps || 10) - 2);
          adaptedItem.isAdapted = true;
        }
      }
      items.push(adaptedItem);
    }
  }

  return {
    decision: blocked ? 'blocked' : 'ready',
    items,
    warnings,
    adaptations,
    engineVersion: '1.0.0', // V2 engine schema
  };
};

module.exports = {
  DECISION_REASONS,
  evaluateEligibility,
  buildSession,
};
