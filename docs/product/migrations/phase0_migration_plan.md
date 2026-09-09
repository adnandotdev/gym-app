# Phase 0 Migration Plan

## Context
As part of the Workout Guidance Suite (Phase 0), we are moving from loose string types (e.g. `equipment: "Dumbbells"`) and unstructured session records into a unified V2 schema.

## Data to Migrate
1. **Legacy Exercise Variations**: We must map current string IDs and arrays to the new `taxonomies.js`.
2. **Current Saved Sessions / Activities**: Current sessions lack `target` data, explicit rest states, and caution references.
3. **Legacy Equipment Profiles**: The coarse onboarding choices (Bodyweight, Portable, Gym) must map to precise equipment objects via `featureFlags.js` (initially disabled).

## Migration Rules (Future Phases)
- **Non-Destructive**: Do not erase legacy sessions. If a session cannot be safely converted to a V2 schema, preserve it under a `legacy_v1` tag.
- **Idempotency**: The migration must be able to run multiple times without duplicating or corrupting data.
- **Feature Flags**: Migration scripts will be governed by `featureFlags.js` switches (e.g. `smartSubstitutions`, `adaptiveWarmup`).
- **Offline Integrity**: Wait for network sync or queue the migration safely if the device is offline and data requires remote validation.

## V2 Schema Compatibility
The new V2 rules added in `schemas.js` enforce valid taxonomies.
- Legacy `exercises.js` equipment strings like `"Dumbbells"` will be normalized using `normalizeEquipmentAlias()` at run-time during the migration.
- Unrecognized or generic equipment (e.g., "Machine") will be mapped to a fallback generic machine type in the taxonomy if an exact match is missing.

## Action Plan
- [ ] During Phase 1 implementation, add a transparent migration hook in `WorkoutPlanContext.js` for equipment profiles.
- [ ] During Phase 2, implement schema-upgrades in `WorkoutActivityContext.js` before saving or displaying older sessions.
- [ ] Document all edge cases inside specific PRs.
