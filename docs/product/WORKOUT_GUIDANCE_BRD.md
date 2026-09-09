# MuscleMap Workout Guidance Suite

## Complete Business Requirements Document and AI Implementation Prompt

**Document status:** Implementation-ready product specification with explicitly marked product decisions

**Product:** MuscleMap mobile application

**Repository:** `/Users/mohammadadnan/Projects/BaseApp`

**Primary client:** React Native with Expo and React Navigation

**Backend:** Node.js, Express, MongoDB

**Audience:** Product owner, designer, mobile engineer, backend engineer, QA engineer, content reviewer, and coding AI models of any capability level

**Scope:** Ten connected workout-guidance capabilities described in F01-F10 below
**Last updated:** 2026-09-07

---

## 1. Instructions for the implementing AI model

Treat this document as the complete product and engineering contract for this feature program. Do not rely on the conversation that produced it. Before changing code, inspect the repository and verify every statement under **Confirmed current baseline** because code can change after this document is written.

### 1.1 Required working method

1. Confirm the repository root is `/Users/mohammadadnan/Projects/BaseApp`.
2. Read `AGENTS.md`, `DESIGN.md`, `PROJECT_TRACKING.md`, `package.json`, and the files named in this BRD.
3. Check the working tree. Preserve all unrelated and user-authored changes, especially environment files.
4. For Expo work, follow the exact documentation version required by the repository instructions and reconcile it with the SDK actually declared in `package.json`. Do not silently change SDK versions.
5. Build one delivery phase at a time in the sequence in section 21. Do not attempt all ten features in one unreviewable change.
6. Use test-driven development: add a failing test, implement the smallest correct behavior, refactor, then rerun the relevant suite.
7. Keep business rules in pure domain functions. Screens may render state and dispatch events but must not duplicate recommendation, safety, or progression logic.
8. Keep all state transitions immutable. Never mutate plans, session queues, activity records, user preferences, or catalog objects.
9. Validate all external and persisted input. Old or malformed local records must degrade safely rather than crash the app.
10. Do not fabricate exercise science claims, medical claims, exercise images, equipment instructions, contraindications, or historical activity.
11. Do not publish AI-generated fitness guidance directly. New guidance content requires the review status and provenance rules in section 16.
12. Run the verification gates for the phase. Report exactly what passed, what failed, what was not run, and why.
13. End each phase with a concise file list, behavior summary, test results, remaining risks, and the next recommended phase.

### 1.2 Prohibited shortcuts

- Do not infer a category by matching display text.
- Do not use broad muscle groups as a substitute for explicit category membership.
- Do not use the same substitution for all skip reasons.
- Do not mark a skipped exercise as completed.
- Do not increase weight solely because a workout was opened or time elapsed.
- Do not prescribe a “safe” movement when a red-flag symptom is present.
- Do not call an injury or pain feature diagnosis, treatment, recovery, physiotherapy, or rehabilitation.
- Do not store sensitive body, pain, injury, or readiness data in analytics events or logs.
- Do not hardcode secrets, LAN addresses, user IDs, dates, or device-specific behavior.
- Do not add a remote API when local state is sufficient for the current phase unless the API contract has been approved.
- Do not leave visual controls without behavior, accessibility roles, disabled states, or explanatory copy.

### 1.3 Required implementation response format

For each assigned phase, the implementing model must first return:

```text
SCOPE
- Features and requirements included
- Explicit exclusions

CURRENT-STATE EVIDENCE
- Relevant files and behaviors verified
- Conflicts or drift from this BRD

IMPLEMENTATION PLAN
- Ordered changes
- Data migrations
- Tests written first
- Risks and rollback

OPEN DECISIONS
- Only decisions that materially block safe implementation
```

After implementation, return:

```text
IMPLEMENTED
- User-visible outcomes
- Domain/data/API changes

VERIFIED
- Unit, integration, UI, E2E, accessibility, export, and health checks

NOT VERIFIED
- Anything not run and the exact reason

FILES
- Created and modified files

RISKS / FOLLOW-UP
- Remaining risks and the next phase
```

---

## 2. Capability statement

MuscleMap will evolve from an exercise library, weekly plan, and basic workout queue into a guided gym companion. A user will be able to understand equipment, prepare for the selected workout, receive guidance appropriate to their experience, track sets and rest, replace unsuitable exercises intelligently, record progress, and receive conservative safety adaptations without the app presenting itself as a medical provider.

The ten capabilities are:

| ID | Capability | Primary outcome |
|---|---|---|
| F01 | Equipment Guide Mode | The user can identify, set up, and use gym equipment with clear safety cues. |
| F02 | Adaptive Warm-Up and Cooldown | The planned workout receives a relevant preparation and recovery sequence. |
| F03 | Guidance Level | Instructions, defaults, and detail adapt for beginner, intermediate, or advanced users. |
| F04 | In-Workout Form Tips | The user receives short, timely technique cues without leaving the session. |
| F05 | Equipment Availability Filters | The library, plan, and substitutions respect equipment the user can actually access. |
| F06 | Workout Readiness Check | The workout can be shortened, softened, or stopped based on a quick pre-session check. |
| F07 | Rest Timer and Set Tracking | The user records sets, reps, weight, holds, and rest accurately. |
| F08 | Smart Substitution and Skip Reasons | Skip becomes an explainable replace/skip flow that preserves workout intent. |
| F09 | Progressive Overload Tracker | The app recommends conservative next-session targets from valid history. |
| F10 | Pain/Injury-Safe Mode | The app filters or warns about movements conservatively and stops on red flags. |

These are one connected system, not ten unrelated screens. Equipment availability, user level, readiness, plan intent, pain exclusions, and history all feed session construction. Set results and substitutions feed Activity and future progression.

---

## 3. Confirmed current baseline

The following was verified when this BRD was created. Reverify before implementation.

- `app/data/workoutCategories.js` defines six stable homepage categories with explicit variation-level membership.
- `app/data/exercises.js` already contains fields such as `difficulty`, `equipment`, `sets`, `reps`, `instructions`, `primaryMuscles`, and `secondaryMuscles` for exercise families.
- `app/data/exerciseVariations.js` resolves exercise families and variations and builds the variation-aware objects used by the plan and session.
- `app/screens/user/ExerciseDetailScreen.js` already shows demonstrations, equipment, difficulty, muscles, variation selection, instructions, and Add to Plan.
- `app/context/WorkoutPlanContext.js` owns a seven-day plan, loads it from the backend, migrates older AsyncStorage data, and performs optimistic add/remove/clear updates.
- `app/domain/workoutSession.js` creates a deduplicated immutable queue and supports active, paused, completed, and empty sessions; queue items are pending, completed, or skipped.
- `app/screens/user/WorkoutSessionScreen.js` starts from passed plan exercises, runs per-exercise and total timers, supports pause/reset/complete/skip/undo, and saves a summary.
- `app/context/WorkoutActivityContext.js` stores a user-scoped, device-local history with a 50-record limit.
- `app/screens/user/ActivityScreen.js` shows today’s plan and basic recent session summaries.
- `DESIGN.md` defines the Figma-aligned purple visual system, Overpass typography, 24px screen gutters, 12/16px radii, minimum 44px targets, and honest-progress rules.
- Exercise demonstration images use a static resolver and variation-specific start/finish/thumbnail assets. Anatomy imagery remains a separate viewer.
- The onboarding flow already collects fitness level, training days, equipment choice, and broad injury selections. Those existing values must be normalized and reused rather than collected twice.

### 3.1 Baseline gaps this program addresses

- Equipment is a label, not a teachable object with setup and safety guidance.
- Warm-up is currently a curated category, not a plan-derived phase with cooldown.
- Fitness level is collected but does not consistently alter guidance or defaults.
- Instructions are mostly read before a workout rather than surfaced at useful moments during it.
- Equipment choice is broad and does not fully filter the library, plan validation, or substitutions.
- No pre-session readiness decision is captured.
- A session tracks elapsed time per exercise but not sets, loads, reps, RPE/RIR, or structured rest.
- Skip advances correctly but does not capture why or offer a replacement.
- Activity does not contain enough structured performance data for progression.
- Injury onboarding is not yet a conservative rules engine and must not be treated as one.

---

## 4. Goals, success measures, and non-goals

### 4.1 Product goals

1. Reduce uncertainty for a person who is unfamiliar with a gym or a machine.
2. Make the start-to-finish workout flow coherent: prepare, train, rest, adapt, finish, review.
3. Preserve the user’s workout intent when equipment is occupied or a movement is unsuitable.
4. Provide useful structure to beginners without slowing down advanced users.
5. Capture trustworthy performance history that can support conservative progression.
6. Improve safety through education, opt-out controls, warnings, and red-flag stops.
7. Work reliably with intermittent connectivity and app backgrounding.
8. Keep the interface aligned with the existing Figma-inspired design language.

### 4.2 Suggested success measures

These are product metrics, not guaranteed outcomes. Establish a baseline before setting targets.

- Workout-start-to-finish rate.
- Percentage of planned exercises completed, skipped, and substituted.
- Percentage of equipment-unavailable skips resolved with a replacement.
- Warm-up and cooldown completion rate.
- Set logging completion rate.
- Rest timer usage and manual override rate.
- Equipment guide opens followed by exercise start.
- Readiness adaptations accepted versus dismissed.
- Progression suggestions accepted, edited, or rejected.
- Session recovery success after app backgrounding or restart.
- User-reported clarity, confidence, and perceived usefulness.
- Safety content reports, red-flag stops, and content correction turnaround.

Do not optimize for heavier weight, longer workouts, calorie burn, streak pressure, or reduced skipping at the expense of safety or user control.

### 4.3 Non-goals

- Medical diagnosis, treatment, physiotherapy, rehabilitation, or emergency response.
- Live camera posture analysis, computer vision, or automatic rep counting in the initial program.
- Real-time wearable integration in the initial program.
- Automated nutrition, supplement, medication, or disease-management advice.
- Social competition, public leaderboards, or trainer marketplaces.
- Automatic publication of generative-AI exercise guidance.
- Guaranteed injury prevention or guaranteed fitness results.
- Replacing a qualified coach, medical professional, or equipment manufacturer’s instructions.

---

## 5. Actors and representative personas

### 5.1 Primary actor: member

An authenticated person who browses exercises, creates a weekly plan, completes workouts, and views Activity. The app must also handle a local/demo user if the existing authentication design supports it, but synced records require authenticated ownership.

### 5.2 Supporting actors

- **Content editor:** Creates or updates exercise, equipment, safety, warm-up, cooldown, and substitution content.
- **Clinical/safety reviewer:** Reviews contraindications, pain rules, warning language, and red-flag decisions. This is a governance role, not an in-app clinician.
- **Administrator:** Publishes approved catalog versions and can retire unsafe or obsolete content.
- **Support/operations:** Investigates sync failures and content version issues using non-sensitive diagnostic data.

### 5.3 Representative personas

- **New gym member:** Does not know machine names, adjustment points, or appropriate starting load. Needs visual setup and simple cues.
- **Returning exerciser:** Understands movements but needs a plan, set/rest tracking, and conservative progress suggestions.
- **Experienced lifter:** Wants fast logging, minimal prompts, equipment substitutions, and editable targets.
- **Home trainee:** Has limited equipment and needs bodyweight/band/dumbbell alternatives.
- **User with a limitation:** Wants to exclude aggravating movements and understand when the app cannot safely advise.

The same person may behave like different personas on different days. Guidance level and readiness are session inputs, not permanent labels.

---

## 6. Product principles and global invariants

### 6.1 Guidance hierarchy

Every generated session must apply constraints in this order:

1. Red-flag safety stop.
2. Explicit user exclusions and clinician-reviewed contraindication rules.
3. Equipment availability.
4. Workout intent and movement-pattern coverage.
5. Readiness adaptation.
6. Guidance level and user preferences.
7. Exercise history and progressive-overload suggestion.
8. Variety and convenience.

A lower-priority goal can never override a higher-priority safety or availability constraint.

### 6.2 Global invariants

- A saved plan remains the user’s plan. Starting a session creates a versioned snapshot; session adaptations do not silently rewrite the weekly plan.
- “Completed,” “skipped,” “substituted,” “stopped,” and “not started” are distinct outcomes.
- A substitution must retain a link to the original planned exercise and the reason for replacement.
- Timers must be derived from timestamps when the app resumes; do not assume one JavaScript interval equals one elapsed second.
- A progression recommendation is a suggestion and is always editable or dismissible.
- Pain and readiness answers can reduce or stop a session but must never be used to shame the user.
- The user can pause, skip, replace, end, or exit from every active workout state.
- Unsupported, deleted, or malformed exercise references are rejected or shown as unavailable without crashing.
- Content displayed in an active session is versioned so later catalog edits do not change historical meaning.
- History records are append-oriented. Corrections create a new revision/audit entry rather than silently rewriting server truth.
- Color is never the only way to communicate state.
- A control that looks interactive must be interactive, intentionally disabled with a reason, or removed.

### 6.3 Safety language

Use calm, direct language. A persistent but unobtrusive safety note should communicate:

> Stop exercising if you feel sharp or worsening pain, chest pain, severe shortness of breath, dizziness, numbness, or faintness. Seek appropriate professional help for medical or injury concerns.

Do not claim that an exercise, substitution, warm-up, or filter is universally safe.

---

## 7. Shared end-to-end journey

### 7.1 Plan and discover

1. User opens Home or Activity.
2. User opens a curated category or Exercise Library.
3. Equipment filters default from the user’s saved environment but can be changed for the current browse session.
4. Exercise cards show equipment, difficulty, and whether the exercise conflicts with a saved exclusion.
5. Exercise Detail offers demonstration, setup, technique, common mistakes, safety notes, alternatives, and Add to Plan.
6. If an exercise conflicts with unavailable equipment or a safety exclusion, the app explains why and offers alternatives before adding.

### 7.2 Start today’s workout

1. User taps Start Exercise/Start Today’s Workout.
2. The app snapshots today’s saved plan.
3. If the plan is empty, the user goes to planning/library rather than an empty timer.
4. The app asks a short readiness check unless the user has intentionally disabled the non-safety questions.
5. Red flags stop the workout flow and show appropriate guidance.
6. Otherwise, the app proposes the session plan: warm-up, main workout, and cooldown, including any readiness/equipment adaptations.
7. The user can review changes, restore the original non-conflicting plan, or start.

### 7.3 Perform the session

1. Warm-up items run with time/repetition targets and brief cues.
2. Main exercises run set by set.
3. Each set can record load, reps/time, completion, and optional effort.
4. A rest timer starts after a completed set when another set remains.
5. Form tips appear at context-appropriate moments without covering the primary action.
6. Skip opens reason choices and, when appropriate, ranked substitutions.
7. The user can select a substitute, skip without replacement, retry, or end the session.
8. Cooldown is offered at the end and may be shortened or skipped honestly.

### 7.4 Finish and review

1. Summary distinguishes planned, completed, partially completed, substituted, skipped, and stopped items.
2. Activity saves set-level outcomes, timing, substitutions, readiness adaptation metadata, and content versions.
3. The app may show next-time targets only when enough trustworthy data exists.
4. Sync happens immediately when online or queues safely for retry when offline.

---

## 8. Shared domain model and terminology

Names below are conceptual. Match the repository’s naming conventions during implementation.

### 8.1 Core identifiers

- `exerciseFamilyId`: stable exercise family identifier, for example `abs-2`.
- `exerciseVariationId`: stable concrete variation identifier, for example `abs-2--side`.
- `equipmentId`: normalized equipment identifier, not display text.
- `movementPatternId`: normalized intent such as horizontal-push, vertical-pull, squat, hinge, carry, rotation, anti-extension, mobility, or locomotion.
- `contentVersion`: immutable published version of guidance content.
- `sessionId`: stable UUID or collision-resistant ID generated once per session.
- `sessionItemId`: stable ID for one item in one session, even when the same variation appears elsewhere.
- `originalSessionItemId`: link from a substitute to the planned item it replaced.

### 8.2 Recommended entities

```ts
type Equipment = {
  id: string;
  name: string;
  aliases: string[];
  category: 'machine' | 'cable' | 'barbell' | 'dumbbell' | 'kettlebell' |
    'bench' | 'rack' | 'band' | 'bodyweight' | 'cardio' | 'other';
  setupSteps: GuidanceStep[];
  safetyChecks: GuidanceStep[];
  adjustmentPoints: EquipmentAdjustment[];
  media: MediaReference[];
  manufacturerDisclaimer?: string;
  contentVersion: string;
  reviewStatus: 'draft' | 'in_review' | 'approved' | 'retired';
};

type ExerciseGuidance = {
  exerciseVariationId: string;
  movementPatterns: string[];
  requiredEquipmentIds: string[];
  optionalEquipmentIds: string[];
  setupSteps: GuidanceStep[];
  executionSteps: GuidanceStep[];
  formCues: GuidanceCue[];
  commonMistakes: GuidanceMistake[];
  stopConditions: GuidanceCue[];
  contraindicationTags: string[];
  warmupTags: string[];
  cooldownTags: string[];
  unilateral: boolean;
  contentVersion: string;
  reviewStatus: 'draft' | 'in_review' | 'approved' | 'retired';
};

type UserWorkoutPreferences = {
  guidanceLevel: 'beginner' | 'intermediate' | 'advanced';
  defaultEquipmentProfileId?: string;
  enabledFormTips: boolean;
  enabledReadinessCheck: boolean;
  defaultRestSecondsByIntent: Record<string, number>;
  preferredUnits: 'metric' | 'imperial';
  accessibility: {
    reduceMotion?: boolean;
    largerText?: boolean;
    haptics?: boolean;
    audioCues?: boolean;
  };
  updatedAt: number;
};

type EquipmentProfile = {
  id: string;
  userId: string;
  name: string;
  locationType: 'full_gym' | 'home' | 'travel' | 'custom';
  availableEquipmentIds: string[];
  temporarilyUnavailableEquipmentIds: string[];
  updatedAt: number;
};

type ReadinessCheck = {
  id: string;
  sessionId: string;
  energy: 1 | 2 | 3 | 4 | 5;
  soreness: 'none' | 'mild' | 'moderate' | 'severe';
  pain: 'none' | 'mild' | 'moderate' | 'severe';
  painAreas: string[];
  sleepQuality?: 1 | 2 | 3 | 4 | 5;
  availableMinutes: number;
  redFlags: string[];
  decision: 'proceed' | 'adapt' | 'stop';
  capturedAt: number;
};

type SetTarget = {
  setNumber: number;
  targetType: 'reps' | 'duration' | 'distance';
  targetMin?: number;
  targetMax?: number;
  targetSeconds?: number;
  targetDistanceMeters?: number;
  targetLoadKg?: number;
  targetRir?: number;
  restSeconds: number;
};

type SetResult = {
  setNumber: number;
  status: 'pending' | 'completed' | 'partial' | 'skipped';
  actualReps?: number;
  actualSeconds?: number;
  actualDistanceMeters?: number;
  actualLoadKg?: number;
  rir?: number;
  rpe?: number;
  completedAt?: number;
  editedAt?: number;
};

type WorkoutSessionItem = {
  id: string;
  exerciseVariationId: string;
  originalSessionItemId?: string;
  phase: 'warmup' | 'main' | 'cooldown';
  status: 'pending' | 'active' | 'completed' | 'partial' | 'skipped' | 'replaced';
  skipReason?: SkipReason;
  substitutionReason?: SkipReason;
  targets: SetTarget[];
  results: SetResult[];
  guidanceContentVersion: string;
  sequence: number;
};

type SkipReason = 'equipment_unavailable' | 'too_difficult' | 'discomfort' |
  'fatigue' | 'time' | 'preference' | 'already_completed' | 'other';
```

### 8.3 Data minimization

- Prefer enumerated pain area and skip reason values over free text.
- If optional notes are later added, cap length, sanitize input, encrypt in transit, enforce ownership, and exclude from analytics/logs.
- Store only the readiness inputs needed to explain the adaptation. Provide a setting to avoid retaining readiness answers after the session while retaining the resulting adaptation label.
- Do not store raw camera, microphone, or biometric data because those capabilities are out of scope.

---

## 9. Shared state machines

### 9.1 Session lifecycle

```text
draft
  -> readiness_required
  -> stopped_by_safety
  -> preview_ready
  -> active_warmup
  -> active_main
  -> active_cooldown
  -> completion_review
  -> saving
  -> saved

From active_*:
  -> paused
  -> backgrounded
  -> exit_confirmation
  -> abandoned
  -> completion_review

From saving:
  -> saved
  -> save_queued_offline
  -> save_failed_retryable
  -> save_failed_terminal
```

Rules:

- `stopped_by_safety` cannot transition into an active state without a new readiness check and removal of the red flag; the initial release should require leaving the flow.
- `backgrounded` preserves timing anchors and active item/set. On resume, elapsed values are reconciled from timestamps.
- `abandoned` may save a partial record only after the user chooses “Save partial workout.”
- A session cannot be `saved` twice; saves must be idempotent by `sessionId`.

### 9.2 Exercise item lifecycle

```text
pending -> active -> completed
                  -> partial
                  -> skipped
                  -> replaced -> substitute item pending
```

Rules:

- `replaced` is an outcome for the original item; the substitute receives a new `sessionItemId`.
- A completed item cannot be replaced without an explicit edit in completion review.
- Editing a prior result never silently moves the current pointer.

### 9.3 Set and rest lifecycle

```text
set pending -> set active -> set completed -> rest active -> next set pending
                         -> set partial
                         -> set skipped

rest active -> rest paused
            -> rest extended
            -> rest skipped
            -> rest completed
```

---

## 10. Cross-feature decision engine

Implement the decision engine as deterministic pure functions with explicit inputs and explainable outputs. It must never call UI code, storage, or the network.

### 10.1 Inputs

- Planned exercise variations and saved order.
- Published exercise/equipment guidance version.
- Equipment profile and temporary availability changes.
- User guidance level and unit preference.
- Readiness decision and available time.
- User exclusions and approved contraindication tags.
- Recent valid set history.
- Session overrides made by the user.

### 10.2 Output

```ts
type SessionBuildResult = {
  decision: 'ready' | 'adapted' | 'blocked';
  blockReasons: string[];
  warnings: ExplainableDecision[];
  adaptations: ExplainableDecision[];
  items: WorkoutSessionItem[];
  estimatedMinutes: number;
  sourcePlanSnapshot: PlanSnapshot;
  engineVersion: string;
};
```

Every adaptation must include a stable reason code and user-facing explanation, such as “Replaced Cable Fly because Cable Machine is unavailable” or “Reduced one accessory set because you selected 25 minutes.”

### 10.3 Determinism and precedence

Given the same normalized inputs and engine version, the output order and recommendations must be the same. Ranking ties use a stable identifier, not random order. Explicit safety exclusions eliminate candidates before scoring. Do not allow progression logic to reintroduce an excluded movement.

---

## 11. Detailed feature requirements

The requirements below use stable IDs so implementation, code review, and tests can trace back to this BRD.

### F01. Equipment Guide Mode

#### F01.1 User promise

The user can understand what a piece of equipment is, how to adjust it, how to enter and exit safely, how it is used for the selected exercise, and which common errors to avoid.

#### F01.2 Entry points

- Equipment badge on Exercise Detail.
- “Equipment setup” action above the exercise instructions.
- Setup action on the pre-workout preview.
- Setup action inside the active session, available while paused and before the first set.
- Equipment directory reachable from Exercise Library filters.
- Substitution result when the user selects “I don’t know how to use this equipment.”

#### F01.3 Primary flow

1. User opens an exercise and taps the equipment badge or setup action.
2. App opens an equipment guide sheet/page without losing exercise context.
3. Header shows equipment name, clear photo/illustration, and the selected exercise.
4. Guide presents: identify the machine; inspect it; adjust seat/pad/pin; choose a conservative starting resistance; enter/start position; perform exercise-specific setup; stop and exit safely.
5. User can view “Common mistakes,” “Safety checks,” and “Need an alternative?”
6. “Ready” returns to the exercise at the prior scroll/session position.

#### F01.4 Functional requirements

- **F01-FR-001:** Equipment uses normalized stable IDs and aliases; “Dumbbell” and “Dumbbells” must resolve to the same entity where appropriate.
- **F01-FR-002:** A guide may contain general equipment setup plus exercise-specific setup. Exercise-specific content takes precedence when both exist.
- **F01-FR-003:** Required steps are numbered and concise. Each step may have one approved image or short animation reference, alt text, and an optional safety emphasis.
- **F01-FR-004:** Machine guidance must identify adjustment points generically unless content is specific to an approved model. It must tell users to follow manufacturer placards when controls differ.
- **F01-FR-005:** Starting-load guidance must use qualitative language such as “choose a load you can control” unless an approved progression target exists. Never infer a safe numeric load for a new user.
- **F01-FR-006:** Guide state is read-only during an active set. Opening it pauses the active set timer only after explicit confirmation or according to a documented timer policy.
- **F01-FR-007:** If no approved guide exists, show the equipment label, exercise instructions, a “Guide not available yet” message, and alternatives. Do not generate instructions at runtime.
- **F01-FR-008:** Retired guidance remains referenced by historical sessions but is not offered for new sessions.
- **F01-FR-009:** Users can report inaccurate or unsafe content using fixed reason categories; free text is optional, limited, and private.
- **F01-FR-010:** Equipment guide media must show the relevant adjustment points and avoid branded identifiers unless usage rights exist.

#### F01.5 UI and content specification

- Use the existing canvas, white/cool surface cards, purple primary action, Overpass type, 24px gutter, and 12/16px radii.
- Keep the first screen actionable: equipment name, “Before you start” safety checks, and adjustment steps. Long explanations belong in expandable sections.
- Use consistent callouts: purple for instructional focus, amber for caution, red only for stop conditions.
- Each image must have one subject and one teaching purpose. Do not add decorative gym clutter behind adjustment controls.
- Provide a text-only experience when media fails.
- Suggested labels: “Equipment setup,” “How to adjust,” “Common mistakes,” “Safety checks,” “Use another exercise,” “Ready.”

#### F01.6 Edge cases

- Equipment name exists on the exercise but has no normalized equipment record.
- Exercise uses multiple required items, such as bench plus dumbbells.
- Cable attachment differs from the guide.
- Machine adjustment labels vary by manufacturer.
- User opens the guide after completing some sets.
- Media is unavailable offline, corrupt, or missing an accessibility description.
- Content was retired after the plan was created.
- Right-to-left localization reverses layout but not step order semantics.
- Very large text causes step cards to grow.
- User reports the same guide repeatedly; reports are rate-limited without blocking access.

#### F01.7 Acceptance criteria

- **F01-AC-001:** From every exercise with normalized equipment, the user can reach the matching approved guide in at most two taps.
- **F01-AC-002:** Returning from the guide preserves selected variation, plan/session context, active set, and scroll position.
- **F01-AC-003:** A missing guide produces an honest fallback and no crash.
- **F01-AC-004:** All guide actions meet 44px touch targets and screen readers announce step number, title, body, and safety state.
- **F01-AC-005:** Historical activity can resolve the content version used at workout time.
- **F01-AC-006:** No guide presents itself as manufacturer-specific unless the associated equipment record says so.

#### F01.8 Minimum tests

- Alias normalization and multi-equipment resolution.
- Approved/draft/retired content visibility.
- Missing media and missing guide fallbacks.
- Navigation state restoration from Detail and Session.
- Screen-reader order and large-text layout.
- Content report validation, ownership, rate limit, and sensitive-log exclusion.

---

### F02. Adaptive Warm-Up and Cooldown

#### F02.1 User promise

The app proposes a short preparation and recovery phase relevant to the selected workout, available equipment, readiness, and time. The user can review, edit, shorten, or skip it.

#### F02.2 Definitions

- **General warm-up:** low-intensity movement intended to raise readiness for activity.
- **Specific warm-up:** movement-pattern practice or lighter preparation related to the first/main exercise.
- **Ramp-up set:** a non-working set that approaches the planned movement without counting toward progression volume.
- **Cooldown:** optional low-intensity movement or comfortable mobility after the main workout.

#### F02.3 Generation rules

1. Reject items blocked by safety exclusions.
2. Identify unique movement patterns and primary regions in the main plan.
3. Add a short general warm-up when time allows.
4. Add at most the configured number of pattern-specific items; avoid repeating effectively identical movements.
5. Add ramp-up sets only for eligible loaded compound movements and only when a valid target load exists.
6. Respect equipment availability and use bodyweight alternatives when suitable.
7. Fit within the warm-up time budget by dropping lowest-priority accessory preparation first.
8. Generate cooldown separately. Cooldown is offered, not forced.

#### F02.4 Functional requirements

- **F02-FR-001:** Warm-up/cooldown are distinct session phases and do not count as completed working sets or progressive-overload volume.
- **F02-FR-002:** The original “Full Body Warm Up” category remains browsable; generated warm-ups use tagged eligible movements and are not limited to that category.
- **F02-FR-003:** Default time budgets are configurable, with user choices such as 3, 5, 8, or 10 minutes. Defaults may vary by session duration and guidance level.
- **F02-FR-004:** The preview states why each specific item was included using simple language.
- **F02-FR-005:** Users can remove or reorder non-required items. The app may warn but cannot trap the user.
- **F02-FR-006:** If no approved match exists, provide a minimal general sequence or allow the user to start without one. Never improvise content.
- **F02-FR-007:** Unilateral preparation clearly indicates both sides and tracks them without double-counting the exercise.
- **F02-FR-008:** Time-based and rep-based items use distinct targets.
- **F02-FR-009:** Readiness adaptation can lengthen gentle preparation only within available time and cannot override pain red flags.
- **F02-FR-010:** A user who skips the warm-up sees an honest skipped phase in the final summary; they are not penalized with warning streaks.

#### F02.5 Suggested UI

- Pre-session card: “Your workout is ready” with tabs/sections for Warm-up, Workout, Cooldown.
- Each generated item shows target, equipment, purpose, and replace/remove action.
- During session, phase transition screen says “Warm-up complete — ready for your workout?” and later “Workout complete — cool down?”
- Cooldown dismissal options: “Start cooldown,” “Short 3-minute cooldown,” and “Finish now.”
- Estimated total time updates immediately after edits.

#### F02.6 Edge cases

- Main plan contains one exercise, only mobility, only bodyweight work, or duplicated movement patterns.
- User has two minutes or less.
- First main exercise is already low intensity.
- No target load exists for ramp-up calculation.
- Main plan changes after preview due to substitution.
- Warm-up item equipment becomes unavailable.
- User resumes directly into the main phase after app termination.
- User selects severe soreness or any red flag.
- All warm-up candidates are contraindicated.
- User completes main workout but skips cooldown.

#### F02.7 Acceptance criteria

- **F02-AC-001:** The same normalized inputs and generator version produce the same sequence.
- **F02-AC-002:** Generated items never violate equipment or explicit safety exclusions.
- **F02-AC-003:** Warm-up volume is excluded from main-workout completion and progression calculations.
- **F02-AC-004:** Estimated duration stays within the chosen budget plus a documented tolerance.
- **F02-AC-005:** A user can inspect and edit the sequence before starting.
- **F02-AC-006:** An empty candidate result degrades to a clear choice rather than blocking a non-red-flag workout.

#### F02.8 Minimum tests

- Deterministic selection and stable tie-breaking.
- Movement-pattern coverage and duplicate suppression.
- Time-budget trimming at every supported budget.
- Equipment and contraindication exclusion.
- Unilateral target display and completion.
- Ramp-up set eligibility and exclusion from working volume.
- Phase transitions, skip, resume, and summary accounting.

---

### F03. Beginner, Intermediate, and Advanced Guidance Level

#### F03.1 User promise

The app adjusts instruction density, defaults, confirmations, and eligible progression/regression choices to the user’s current experience while preserving safety and user control.

#### F03.2 Policy decision

Use exactly three persisted levels in the initial release: `beginner`, `intermediate`, and `advanced`, matching current onboarding. The profile contains a default level. Every session preview permits a temporary override. A temporary override does not change the profile unless the user separately chooses “Use this as my default.”

Level is not a score, achievement, or automatic promotion system. The app may invite a user to review it but must not silently change it.

#### F03.3 What the level may change

| Concern | Beginner | Intermediate | Advanced |
|---|---|---|---|
| Instruction density | Full setup, execution, breathing, and mistakes | Essential setup and 2-3 cues | Compact cues with details on demand |
| Demo behavior | Start/finish emphasized; replay discoverable | Standard demo | Compact or minimized by preference |
| Default confirmation | Confirm exercise and first-set setup | Confirm adaptations | Confirm safety-impacting changes only |
| Form-tip frequency | Every exercise and key set transition | First set plus optional later cues | On demand or sparse |
| Rest prompts | Visible with explanation | Visible timer | Compact timer with quick controls |
| Prescription adjustment | Conservative eligible regression/default | Catalog default | Eligible advanced variation only by explicit choice |
| Equipment guide | Prominent | Available | Collapsed/optional |

Level may affect documented set, repetition, duration, or rest defaults only where reviewed level-specific metadata exists. It cannot create a medical recommendation, bypass an exclusion, or infer that advanced users should always lift more.

#### F03.4 Functional requirements

- **F03-FR-001:** Normalize legacy values case-insensitively; invalid or absent values default to beginner guidance presentation without silently changing exercise difficulty.
- **F03-FR-002:** The current session level is visible in preview and session settings.
- **F03-FR-003:** Mid-session level changes preserve exercise, active set, recorded results, timers, and substitutions.
- **F03-FR-004:** If a level-specific prescription changes the saved plan’s targets, preview must show original versus session target and a reason.
- **F03-FR-005:** Missing level-specific content uses approved base guidance and says no special adjustment is available where relevant.
- **F03-FR-006:** Advanced mode never hides stop conditions or the pain/stop action.
- **F03-FR-007:** Level-specific content must be versioned and independently reviewable.
- **F03-FR-008:** Activity records the level and actual prescription used, not merely the profile default.
- **F03-FR-009:** If level changes after a session snapshot is created, ask whether to apply it to the current preview; never rebuild an active session silently.
- **F03-FR-010:** Guidance-level telemetry records the enum and interaction, not personal rationale or body data.

#### F03.5 Edge cases

- Legacy values such as “new,” “expert,” empty string, or localized labels.
- User changes profile level on another device during an active session.
- Requested level content has not been translated.
- An advanced exercise has only beginner/base guidance.
- User changes level during an active rest timer.
- Readiness adapts volume while level adapts cue density; the two changes must not be confused.
- Accessibility preference requests more explanatory text even in advanced mode.

#### F03.6 Acceptance criteria

- **F03-AC-001:** The same resolved session level controls Detail, equipment guide, form tips, preview, session, and summary consistently.
- **F03-AC-002:** A session override never mutates the persisted profile without separate explicit consent.
- **F03-AC-003:** Changing level never loses recorded workout state.
- **F03-AC-004:** Unsupported content falls back safely and visibly.
- **F03-AC-005:** Safety warnings and stop controls are identical in availability across levels.
- **F03-AC-006:** Level-dependent prescription changes are included in the immutable session snapshot.

#### F03.7 Minimum tests

- Enum normalization and invalid legacy fallback.
- Presentation/prescription table fixtures for each level.
- Base-content fallback and missing translation.
- Session override versus saved-default behavior.
- Mid-session change preserving state.
- Cross-feature precedence with readiness, safety, and accessibility.

---

### F04. In-Workout Form Tips

#### F04.1 User promise

The active workout provides one clear, variation-relevant cue at the right moment, with optional deeper guidance, without claiming to observe the user’s body or blocking workout controls.

#### F04.2 Cue taxonomy

- `setup`: position, grip, stance, machine adjustment, or starting alignment.
- `movement`: path, range, tempo, or controlled execution.
- `brace`: trunk and stability instruction.
- `breathing`: general breathing cue, subject to safety review.
- `common_mistake`: a frequent error and correction.
- `stop_condition`: approved warning that signals ending the movement.
- `equipment_specific`: attachment or machine-specific detail.

Each cue contains stable ID, exact variation or family fallback, eligible levels, phase/set timing, priority, approved text, optional approved media, locale, content version, and review status.

#### F04.3 Display rules

1. Before set one, prefer setup or equipment-specific cue.
2. During/between later sets, prefer movement, brace, breathing, or common-mistake cues.
3. Never repeat a non-safety cue until the eligible pool is exhausted.
4. Keep one primary cue visible. “More tips” opens the complete approved list.
5. Stop conditions remain reachable at all times and are not rotated away from the detailed view.
6. Pause automatic rotation while the app is backgrounded, session is paused, or the user is reading expanded content.
7. Do not announce rotating tips to a screen reader every few seconds. Announce on exercise/set transition or user request.

#### F04.4 Functional requirements

- **F04-FR-001:** Exact variation cues take precedence; family-level cues are explicitly marked as general guidance internally.
- **F04-FR-002:** Missing cue content removes the component or shows one approved base instruction. It never creates generic AI coaching.
- **F04-FR-003:** Tips cannot assert “your back is rounded,” “your form is correct,” or any other observation without a separately validated sensing feature.
- **F04-FR-004:** Expand/collapse does not change timer or set state.
- **F04-FR-005:** Dismissal can hide non-safety tips for the exercise or session. Stop conditions remain available.
- **F04-FR-006:** Substitution immediately resolves cues for the substitute and resets its cue sequence.
- **F04-FR-007:** Switching level recomputes eligible cues without resetting performance state.
- **F04-FR-008:** Reduced-motion mode uses an immediate content change; standard mode may use a subtle opacity/translation transition.
- **F04-FR-009:** Content reports link to cue ID and content version.
- **F04-FR-010:** Tip interactions may be analyzed by cue type/ID only; no sensitive session notes are included.

#### F04.5 UI specification

- Place the cue below the demonstration/prescription and above secondary controls, or inside a compact card visible without obscuring the primary set action.
- Show a small category label such as “SETUP TIP” and one or two short sentences.
- “More tips” opens a bottom sheet with Setup, Movement, Breathing, Common mistakes, and Stop if sections.
- Pain/Stop remains a separate high-visibility action; do not bury it in tips.
- For very large text, the cue grows and the screen scrolls while the primary action remains reachable.

#### F04.6 Edge cases

- One eligible cue, no cues, duplicated cue IDs, or a retired cue referenced by a restored session.
- User completes a set while the tip transition is animating.
- Tip content is longer in translation.
- Screen rotates or window resizes.
- Exercise is substituted after partial work.
- App resumes after cue schedule would have advanced.
- User has audio cues on but screen reader also active; avoid duplicate announcements.

#### F04.7 Acceptance criteria

- **F04-AC-001:** The displayed cue belongs to the exact variation or documented family fallback.
- **F04-AC-002:** Tips never cover or disable Complete Set, Pause, Skip/Replace, or Pain/Stop.
- **F04-AC-003:** Missing or retired content cannot create a blank, crashing, or hallucinated carousel.
- **F04-AC-004:** Substitution and level changes update tips correctly without resetting results.
- **F04-AC-005:** Reduced motion and screen-reader behavior meet the global accessibility rules.
- **F04-AC-006:** No copy implies live form detection.

#### F04.8 Minimum tests

- Variation/family resolution and review-status filtering.
- Non-repetition and deterministic sequencing.
- Pause/background/expanded-sheet behavior.
- Substitute and level-change integration.
- Missing/retired/long/localized content.
- Accessibility announcement throttling and reduced motion.

---

### F05. Equipment Availability Filters

#### F05.1 User promise

The user can browse and build a workout from equipment available at the current location, while still understanding why other exercises are unavailable and how to replace them.

#### F05.2 Equipment profiles

Support saved profiles such as “My Gym,” “Home,” and “Travel,” plus a temporary “Available today” override. The existing coarse onboarding choices—Bodyweight, Portable, Gym—are migration hints, not exact inventory truth. Prompt the user to confirm the inferred starter set before using it as a precise filter.

Examples of normalized equipment include bodyweight, floor space/mat, resistance band, dumbbell, barbell, plates, bench, rack, cable station, pull-up bar, dip station, medicine ball, stability ball, leg press, and specific machines. Final taxonomy must be derived from the actual catalog and reviewed for aliases.

#### F05.3 Matching semantics

- All required equipment must be present (`AND`).
- Optional equipment never excludes an exercise.
- Alternative requirement groups allow one complete option, for example `(barbell + rack) OR dumbbells`.
- Bodyweight is available by default unless the exercise needs an explicit surface/anchor.
- “No equipment selected” means bodyweight-only, not “show everything.”
- Temporarily unavailable equipment subtracts from the chosen profile for this session/browse context.

#### F05.4 Functional requirements

- **F05-FR-001:** The same equipment IDs and matching function power onboarding/profile, library, plan preflight, warm-up generator, and substitutions.
- **F05-FR-002:** Library filters compose with category, muscle, difficulty, search, guidance level, and safety eligibility.
- **F05-FR-003:** The app distinguishes “Hide unavailable” from “Show all with availability labels.” Default behavior is a product decision in section 24; use “Show all with labels” until validated.
- **F05-FR-004:** Active filters, selected profile, temporary overrides, and result count are visible.
- **F05-FR-005:** “Clear filters” resets transient library filters but does not erase a saved equipment profile.
- **F05-FR-006:** Changing equipment after a plan is saved never silently deletes plan items. Preflight flags conflicts and offers substitutions.
- **F05-FR-007:** Users can mark equipment occupied/unavailable from a guide or skip sheet for the current session.
- **F05-FR-008:** Alias comparison is normalized and case-insensitive; presentation strings remain localized.
- **F05-FR-009:** An exercise with unknown requirements displays “Equipment details incomplete” and is not claimed eligible under strict filtering.
- **F05-FR-010:** Equipment profiles are user-scoped and cleared from in-memory UI before switching accounts.

#### F05.5 UI specification

- Library: Filter button with active-count badge; horizontal summary chips; modal/sheet with profile, categories, and multi-select equipment.
- Exercise card: concise equipment label plus “Available” or “Needs equipment” where appropriate.
- Empty state: state which filters conflict and offer “Edit equipment,” “Clear all filters,” and “Show alternatives.”
- Plan preview: conflict row with planned movement, missing equipment, and Replace action.
- Use selected icons plus text; selection cannot rely on purple border alone.

#### F05.6 Edge cases

- Multi-equipment exercise, optional attachment, one-of-many equipment groups, duplicate aliases, unknown item, deleted profile.
- User edits equipment profile on another device.
- Temporary override is active when app terminates.
- Deep link/category navigation opens with previously active filters.
- Search has results but equipment removes them all.
- User marks every item temporarily unavailable.
- “Dumbbell” versus “Dumbbells,” machine family versus exact machine, and bench angle differences.

#### F05.7 Acceptance criteria

- **F05-AC-001:** Every filter result satisfies the documented requirement expression.
- **F05-AC-002:** Filters combine predictably and counts are derived from actual results.
- **F05-AC-003:** Temporary availability never overwrites a saved profile without explicit consent.
- **F05-AC-004:** Existing plan items remain visible when equipment changes and are clearly flagged.
- **F05-AC-005:** Empty and unknown-equipment states explain recovery actions.
- **F05-AC-006:** The taxonomy behaves consistently across all feature entry points.

#### F05.8 Minimum tests

- AND/OR/optional/bodyweight matching truth table.
- Alias normalization and unknown requirements.
- Composition with every other supported filter.
- Saved profile versus temporary override.
- Plan conflict preflight and no silent deletion.
- User switch, offline cache, and storage corruption.

---

### F06. Workout Readiness Check

#### F06.1 User promise

Before training, the user can quickly describe current energy, soreness, pain, recovery, and time. The app explains whether it will keep, reduce, shorten, or stop the proposed session.

#### F06.2 Questions

Keep the initial flow to approximately 15-30 seconds:

1. **Energy:** 1 very low to 5 high.
2. **Soreness:** none, mild, moderate, severe.
3. **Pain now:** none, mild, moderate, severe. If not none, collect structured area and open F10 evaluation.
4. **Sleep/recovery:** optional 1-5 input, phrased as perceived recovery rather than clinical sleep scoring.
5. **Time available:** bounded choices plus a validated custom duration.
6. **Red flags:** an approved concise checklist or immediate “Stop and get help” entry. Exact wording requires safety review.

Do not combine answers into a pseudo-medical readiness percentage. Use explainable states: `ready`, `adapt`, `stop`, `skipped`, and `stale`.

#### F06.3 Default adaptation table

This table is a product starting point and requires fitness/safety review before release:

| Condition | Allowed output |
|---|---|
| Any red flag | Stop; no workout recommendation |
| Severe current pain | Stop affected training flow; F10 response |
| Moderate pain | Pause and require F10 evaluation; no automatic continue |
| Very low energy or severe soreness without pain | Offer reduced volume/intensity or rest-day choice |
| Low available time | Shorten accessory work and optional phases while preserving safe setup/rest |
| Normal/high readiness | Preserve plan; do not automatically add volume/load |
| Check skipped | Preserve plan with no readiness-derived adaptation |

#### F06.4 Functional requirements

- **F06-FR-001:** Readiness belongs to one session attempt and has a capture timestamp.
- **F06-FR-002:** A check becomes stale after a configurable period or material plan/profile change; the initial recommended period is four hours, pending product approval.
- **F06-FR-003:** Back navigation preserves valid draft answers for the current attempt.
- **F06-FR-004:** The user can skip non-safety questions. Skipping never fabricates a favorable score.
- **F06-FR-005:** Every adaptation contains reason codes, original targets, adapted targets, and user-facing explanation.
- **F06-FR-006:** User may reject performance/time adaptations and use the original non-conflicting plan. Hard safety blocks cannot be overridden in the initial release.
- **F06-FR-007:** Readiness changes the session snapshot only after preview confirmation.
- **F06-FR-008:** Readiness data retention is explained. User can delete retained readiness records independently if they are persisted.
- **F06-FR-009:** No detailed readiness, pain, sleep, or body data appears in analytics or push notification copy.
- **F06-FR-010:** Submission is idempotent and double taps cannot create two sessions.

#### F06.5 UI specification

- One question per compact screen/card or a carefully tested single scrolling screen.
- Use words alongside scales, for example “1 Very low” and “5 High.”
- Result screen title: “Today’s recommendation,” with one of “Ready as planned,” “A lighter session may fit today,” or approved stop language.
- Show “What changed and why” with exact before/after rows.
- Actions: “Use adapted workout,” “Review changes,” “Use original workout” when permitted, and “End for now.”
- Never use guilt, streak-loss warnings, or celebratory language on a stop decision.

#### F06.6 Edge cases

- Partial/contradictory answers, boundary values, stale draft, timezone rollover, plan edited during check, user switches account.
- Offline start, server failure, double submit, app killed on result screen.
- User reports pain but closes the sheet.
- Available time is less than minimum safe setup/rest estimate.
- A low-readiness adaptation removes every main item.
- User repeatedly rejects the same adaptation.

#### F06.7 Acceptance criteria

- **F06-AC-001:** Every allowed input combination produces a deterministic decision and reason set.
- **F06-AC-002:** Pain and red flags are evaluated before warm-up and progression.
- **F06-AC-003:** Check skipped is distinguishable from ready.
- **F06-AC-004:** The original and adapted plan can be compared before confirmation.
- **F06-AC-005:** Hard-stop paths never offer a continue-workout action.
- **F06-AC-006:** Readiness data is user-scoped and follows the retention/deletion policy.

#### F06.8 Minimum tests

- Exhaustive decision-table boundary tests.
- Schema validation, partial answers, and stale policy.
- Double-submit/idempotency and user switch.
- Readiness-to-F10 precedence.
- Preview accept/reject and snapshot integrity.
- Offline submission/recovery and sensitive analytics/log exclusion.

---

### F07. Rest Timer and Set Tracking

#### F07.1 User promise

The user can follow and record the real workout dose—set by set—with clear rest timing, editable outcomes, accurate background behavior, and recovery after interruption.

#### F07.2 Supported modalities

- Repetition with external load.
- Repetition with bodyweight or assisted bodyweight.
- Timed hold or timed movement.
- Distance is a future-compatible data type but need not receive UI until catalog content requires it.
- Unilateral work can be represented as one set with a both-sides instruction or separate left/right results. Choose per exercise metadata and keep summary semantics consistent.

#### F07.3 Primary flow

1. Session shows Exercise X of Y and Set 1 of N.
2. User reviews target and begins/continues the set.
3. On “Complete Set,” a fast log confirms actual reps/time and load; previous values prefill when trustworthy.
4. Rest starts automatically if another working set remains.
5. User may pause, skip rest, add 15/30 seconds, or finish rest early.
6. Next set appears with recorded prior result visible but secondary.
7. After the final set, exercise status is computed and the session advances.

#### F07.4 Functional requirements

- **F07-FR-001:** Complete Set advances exactly one set. Only resolution of the final set resolves the exercise.
- **F07-FR-002:** Exercise is `completed` when all required working sets are completed, `partial` when at least one but not all working sets is completed, and `skipped` when no set is completed and user skips.
- **F07-FR-003:** Load, reps, time, distance, RIR, and RPE inputs use bounded numeric validation and the correct unit.
- **F07-FR-004:** Store mass canonically in kilograms with the original entered value/unit for faithful display and audit. Conversion/rounding is centralized.
- **F07-FR-005:** Timer state uses `startedAt`, `pausedAt`, accumulated pause, and/or absolute deadline. Intervals render time but do not define truth.
- **F07-FR-006:** App backgrounding, lock screen, delayed ticks, timezone changes, and clock changes reconcile predictably. Define whether active-set time continues; default: elapsed exercise/session time continues unless explicitly paused, while user-entered performance remains unchanged.
- **F07-FR-007:** Rest may continue in background. On return, show elapsed/completed rest state and do not start multiple timers.
- **F07-FR-008:** Audio/haptic cues follow user settings, silent mode/platform behavior, and accessibility preferences.
- **F07-FR-009:** Editing or deleting a prior set requires clear selection and confirmation when it changes computed exercise completion.
- **F07-FR-010:** Reset affects only the current timer or uncommitted set. It cannot erase completed sets without confirmation.
- **F07-FR-011:** Active session draft persists after every material transition using a debounced/atomic strategy, not every display tick.
- **F07-FR-012:** Relaunch offers Resume, Save as partial, or Discard. Discard is destructive and requires confirmation.
- **F07-FR-013:** Session completion save is idempotent. Retrying cannot create duplicate Activity records.
- **F07-FR-014:** Total time distinguishes elapsed session time, active work time where available, and rest time; labels must not imply precision the app does not measure.

#### F07.5 UI hierarchy

During an active set, prioritize:

1. Exercise and set progress.
2. Demonstration/current target.
3. One concise form cue.
4. Primary “Complete Set” action.
5. Pause, Replace/Skip, Pain/Stop.

During rest, prioritize:

1. Large tabular rest countdown.
2. Next set target and next exercise preview.
3. “Start next set,” “+15,” “+30,” pause/resume, and skip rest.
4. Optional education collapsed below.

The session-critical controls must remain reachable on a 360px-wide device and at large text sizes. If sticky actions are used, they must respect the safe area and not cover content.

#### F07.6 Edge cases

- Zero/negative/huge numeric input, decimal locale, pasted characters, NaN, infinity, or kg/lb switch.
- User double taps Complete Set, Skip, or Start Next.
- App is killed one second before rest ends.
- Device time changes or daylight-saving transition occurs.
- User substitutes after completing some sets.
- User edits target while a rest timer is active.
- Session lasts several hours or crosses local midnight.
- Storage is full/corrupt or draft schema is newer than the app.
- Haptic/audio API fails.
- Final set is partial or failed.

#### F07.7 Acceptance criteria

- **F07-AC-001:** Every reducer action is immutable, bounded, and idempotent where repetition is possible.
- **F07-AC-002:** Complete Set, Complete Exercise, Skip Exercise, and Finish Workout cannot be confused or triggered by the same unlabeled control.
- **F07-AC-003:** Background/rest timing reconciles within an approved tolerance and never produces negative time.
- **F07-AC-004:** Relaunch restores exact session phase, exercise, set, results, substitutions, and timer anchor.
- **F07-AC-005:** Summary is derived from set results and item states, not screen time.
- **F07-AC-006:** One session attempt produces at most one saved Activity identity.
- **F07-AC-007:** All primary actions meet accessibility, one-handed-reach, and large-text requirements.

#### F07.8 Minimum tests

- Reducer transition table for each modality and every terminal path.
- Property invariants: counts bounded; no item both completed and skipped; terminal session has no active item; original plan never mutates.
- Clock simulation for delayed ticks, background, restart, clock jump, and long session.
- Numeric validation and unit conversion round trip.
- Draft atomicity, corruption, migration, user switch, and low-storage failure.
- Component and E2E flows for completing, editing, resting, partial completion, resume, and idempotent save.

---

### F08. Smart Exercise Substitution and Skip Reasons

#### F08.1 User promise

When the planned exercise cannot be performed, the user can say why, see ranked compatible alternatives with explanations, replace only this session or intentionally update the plan, or skip without replacement.

#### F08.2 Skip interaction

Tapping “Replace or skip” opens a sheet with:

- Equipment unavailable/occupied.
- Too difficult today.
- Discomfort or pain.
- Fatigued.
- Not enough time.
- Prefer another exercise.
- Already completed elsewhere.
- Other.

Selecting discomfort/pain immediately enters F10 and pauses the workout. Other reasons may show substitutions. “Skip without replacing” remains available. Cancel changes nothing.

#### F08.3 Candidate eligibility

A candidate must:

1. Be approved and resolvable in the current catalog.
2. Not be the current variation.
3. Not have already been rejected in this substitution interaction.
4. Satisfy all required-equipment constraints.
5. Pass safety exclusions and readiness hard constraints.
6. Match the original movement pattern and primary intent within a documented tolerance.
7. Have a prescription that can be resolved for the current session level.

#### F08.4 Suggested deterministic ranking

Rank only eligible candidates. Example score weights require domain review:

- Same primary movement pattern: +40.
- Same primary muscles: +25.
- Same modality: +10.
- Similar difficulty for current level: +10.
- Uses currently available equipment: required gate, then +5 for convenience.
- Familiar/recently completed without negative signal: +5.
- Same exact family but suitable variation: +5.
- Recently rejected/disliked: exclude or strong penalty depending on reason age.

Tie-break using stable variation ID. Return the top three to five, each with reason codes and a concise “why it matches.” Never expose a magic percentage that suggests scientific precision.

#### F08.5 Prescription transfer

- Do not blindly copy sets/reps/load across different exercises.
- Use approved target conversion metadata when available.
- Otherwise use the candidate’s reviewed level default, preserve remaining set count only when compatible, and clearly show the change.
- Completed sets on the original remain attributed to the original. The substitute receives its own results.
- Replacing after partial work marks original `partial` or `replaced_after_partial` according to the finalized schema and records lineage.

#### F08.6 Functional requirements

- **F08-FR-001:** Original item, substitute item, reason, candidate score reasons, and user choice are recorded in the session.
- **F08-FR-002:** Session-only replacement never mutates the weekly plan.
- **F08-FR-003:** “Update future plan” is a separate confirmed action, uses the plan API, and reports success/failure. The current session can continue even if future-plan update fails.
- **F08-FR-004:** No eligible candidates results in an honest empty state with Retry after equipment change, Skip, or End options.
- **F08-FR-005:** Undo before work on the substitute restores the original untouched item and pointer. After substitute sets are recorded, undo requires confirmation and preserves audit history.
- **F08-FR-006:** Rapid/replayed actions cannot insert duplicate substitutes or advance multiple items.
- **F08-FR-007:** Skip reasons are signals, not moral scores. A single preference skip does not permanently remove an exercise.
- **F08-FR-008:** Reason retention for future ranking is transparent and editable in preferences/history.
- **F08-FR-009:** Free-text “Other” is optional, length-limited, sanitized, private, and excluded from analytics.
- **F08-FR-010:** Offline substitution uses the versioned cached catalog/rules. If required data is absent, allow skip without fabricated candidates.

#### F08.7 UI specification

- First sheet asks “What would you like to do?” and separates Replace from Skip.
- Candidate cards show exercise name, demonstration thumbnail, required equipment, target similarity explanation, and prescription difference.
- Avoid labeling a candidate “safe.” Prefer “Matches the same movement” and show cautions separately.
- Confirm screen shows “This workout only” and an optional “Also update [day] plan.” Default is session only.
- Summary shows “Planned A → completed B” and the selected reason.

#### F08.8 Edge cases

- No candidates, all unsafe/unavailable, substitution cycle, same-family alternative, last exercise, partial original sets.
- Equipment becomes available after opening the sheet.
- Plan is edited remotely before “Update future plan.”
- User closes on reason selection, goes offline, double taps, or changes account.
- Substitute is retired in a restored draft.
- Reason is pain but user tries to return directly to active set.

#### F08.9 Acceptance criteria

- **F08-AC-001:** Every candidate satisfies all hard eligibility rules.
- **F08-AC-002:** Candidate order and explanations are deterministic for the same input/rules version.
- **F08-AC-003:** Session-only replacement preserves the saved plan exactly.
- **F08-AC-004:** Activity retains original/replacement lineage and reason.
- **F08-AC-005:** No-candidate, offline, and plan-update-failure states allow safe continuation or exit.
- **F08-AC-006:** Pain reason cannot bypass F10 evaluation.
- **F08-AC-007:** A repeated tap produces a single state transition.

#### F08.10 Minimum tests

- Eligibility/ranking fixtures and deterministic ties.
- Cross-product of equipment, level, readiness, and safety filters.
- Prescription transfer for compatible/incompatible modalities.
- Partial-set lineage, undo, last item, cycle prevention, and idempotency.
- Future-plan update success/conflict/failure without current-session loss.
- Offline cache and no-candidate fallback.

---

### F09. Progressive Overload Tracker

#### F09.1 User promise

When sufficient comparable performance history exists, the app proposes one conservative next target, explains why, and lets the user accept, edit, maintain, deload, or dismiss it.

#### F09.2 Eligibility gate

No increase recommendation is produced unless all required conditions pass:

- Minimum comparable-session count is met. Recommended initial value: two or three valid sessions, pending domain review.
- Exact exercise variation and compatible equipment/mode match.
- Required working sets have trustworthy actual results.
- Unit conversion is valid.
- No pain event, hard safety flag, poor-form self-report, or relevant contraindication was recorded.
- Latest session was not materially reduced for low readiness.
- Target success criteria were met inside configured RPE/RIR limits.
- Data is recent enough under an approved policy.

If eligibility fails, return `insufficient_data`, `maintain`, or `deload_review` with reason codes; do not force an increase.

#### F09.3 Progression modes

- **Double progression:** increase repetitions within a range; after all sets reach the upper bound with acceptable effort, propose the smallest supported load increase and return to the lower rep target.
- **Load progression:** small equipment-compatible load increment when repeated target success is shown.
- **Duration progression:** small hold/time increase within exercise-specific bounds.
- **Volume progression:** add a set only when explicitly approved for that exercise/program and after stricter evidence; not an initial default.
- **Rest progression:** generally do not reduce rest automatically. If offered, it must be a separate goal and never combined with a load increase.

Change one primary variable per recommendation.

#### F09.4 Functional requirements

- **F09-FR-001:** The recommendation engine is deterministic, versioned, pure, and returns reason codes, evidence references, original target, suggested target, and bounds.
- **F09-FR-002:** Recommendation uses actual completed working sets. Warm-up/ramp-up, skipped, substituted-away, and invalid sets are excluded or attributed correctly.
- **F09-FR-003:** RPE/RIR are optional inputs unless the approved program specifically requires them. Missing effort data may reduce confidence or suppress suggestions according to policy.
- **F09-FR-004:** Equipment increments are modeled explicitly. Do not suggest a load the available dumbbells/plates/machine stack cannot represent.
- **F09-FR-005:** Per-hand versus total load is explicit.
- **F09-FR-006:** Metric/imperial conversion uses canonical kg, documented rounding, and original-input preservation.
- **F09-FR-007:** Acceptance creates a proposed future target or explicit plan change. It does not rewrite the current completed session.
- **F09-FR-008:** Plan mutation always requires confirmation and handles server conflict/failure.
- **F09-FR-009:** Dismissal or edit is not treated as non-compliance. Optional fixed reason codes may improve future suggestions.
- **F09-FR-010:** Edited/deleted history triggers recalculation and retains auditability.
- **F09-FR-011:** A substitute builds its own history; do not merge unrelated variations solely because they share a muscle.
- **F09-FR-012:** Safety/readiness gates are evaluated after performance success and can suppress progression.
- **F09-FR-013:** Show maintain and deload-review outcomes as valid progress decisions.

#### F09.5 UI specification

- Activity or next-session preview card: “Next time” with Previous, Completed, and Suggested values.
- Plain-language reason: “You reached 12 reps on all 3 sets twice with controlled effort.”
- Actions: Accept, Edit, Keep current, and Not now.
- Graphs require a textual table/summary alternative and must handle zero, one, or many data points.
- Never use aggressive copy such as “You must increase” or imply failure for maintaining/deloading.

#### F09.6 Edge cases

- Mixed units, equipment increments, per-hand ambiguity, missing RPE/RIR, partial sets, multiple sessions in one day.
- History arrives out of order or contains duplicates/corrupt records.
- Variation metadata changes or retires.
- User accepts suggestion offline, then edits plan elsewhere.
- Large numeric values, decimals, bodyweight-assisted exercises, duration holds.
- Pain or low-readiness result occurs after earlier successful sessions.
- Long gap between comparable sessions.

#### F09.7 Acceptance criteria

- **F09-AC-001:** No recommendation appears without passing every configured eligibility gate.
- **F09-AC-002:** Same normalized history and engine version always produce the same result independent of input order.
- **F09-AC-003:** One primary variable changes within approved exercise/equipment limits.
- **F09-AC-004:** Pain, failed/partial work, high effort, or low-readiness conditions suppress unsafe increases.
- **F09-AC-005:** User confirmation is required before future targets/plans change.
- **F09-AC-006:** Conversion and rounding are reversible within approved tolerance.
- **F09-AC-007:** Recommendation evidence is inspectable and historically traceable.

#### F09.8 Minimum tests

- Eligibility truth table including every suppression reason.
- Double/load/duration progression fixtures.
- Equipment increments and per-hand/total cases.
- Unit round-trip/property tests and numeric bounds.
- History sorting/deduplication/edit/delete recalculation.
- Plan update idempotency/conflict/offline retry.
- Cross-feature suppression by F06 and F10.

---

### F10. Pain/Injury-Safe Mode

#### F10.1 User promise and naming boundary

The app helps a user avoid known exercise conflicts, notice warnings, and respond conservatively when pain occurs. It does not diagnose an injury, guarantee safety, recommend rehabilitation, or replace professional care.

Public-facing naming should be tested. “Movement cautions” or “Pain-aware workout” may be less medically suggestive than “Injury-Safe Mode.” Regardless of label, code and copy must follow the boundaries here.

#### F10.2 Two entry journeys

**Saved caution profile**

1. User reviews migrated onboarding injury areas.
2. App explains that these are movement cautions, not diagnoses.
3. User confirms area, optional side, current status, broad movements to avoid, optional clinician-provided restrictions, and review/expiry date.
4. Plan/library show `blocked`, `caution`, or `no_known_conflict` based on reviewed rules.
5. User can edit, deactivate, or delete the caution.

**Pain during a workout**

1. A persistent “Pain / Stop” action pauses the session in one action.
2. User can immediately end without completing a form.
3. If continuing the decision flow, user selects structured location, severity, sensation category if approved, and red flags.
4. Red flag or severe/sudden concerning input stops the exercise/session path and shows approved seek-help language.
5. Non-red-flag mild discomfort may offer a validated regression/substitution, skip, or end. Continuing the same exercise is not the primary recommendation and, if permitted by policy, requires explicit acknowledgement.
6. Event and decision are recorded privately.

#### F10.3 Rule outcomes

- `hard_block`: exclude from new session candidate lists; active item stops.
- `caution`: show reason and alternatives; user may continue only where approved and with acknowledgement.
- `no_known_conflict`: means the rule set found no mapped conflict. Never display “safe for your injury.”
- `unknown`: metadata is incomplete; show caution and do not claim eligibility.
- `red_flag_stop`: stop workout recommendation and show approved urgent guidance.

#### F10.4 Functional requirements

- **F10-FR-001:** Existing coarse onboarding values migrate as unconfirmed cautions, never diagnoses or hard blocks.
- **F10-FR-002:** Contraindication rules use structured area, joint, movement-pattern, load, impact, position, and exercise-variation tags plus versioned reviewer approval.
- **F10-FR-003:** Hard exclusions apply consistently to library eligibility labels, plan preflight, warm-up/cooldown, substitutions, and progression.
- **F10-FR-004:** Pain/Stop is reachable without scrolling in every active set/rest state.
- **F10-FR-005:** User can stop immediately and choose whether to save a partial workout.
- **F10-FR-006:** Approved red flags include, at minimum subject to clinical/legal review, chest pain, fainting, severe difficulty breathing, sudden severe pain, new numbness/weakness, or other emergency warning signs defined by the reviewer. The app must not diagnose the cause.
- **F10-FR-007:** Red-flag paths cannot offer Continue, progression, or a substitution as the primary next action.
- **F10-FR-008:** Safety rules override guidance level, readiness performance adaptations, equipment convenience, warm-up generation, substitutions, and overload.
- **F10-FR-009:** Every block/caution includes a stable reason and plain-language explanation. Unknown metadata produces uncertainty, not a guarantee.
- **F10-FR-010:** Saved cautions and pain events are sensitive data: strict ownership, minimal retention, deletion/export path, no notification details, no analytics free text, no logs.
- **F10-FR-011:** Content/rule changes are versioned. Historical decisions retain the version used.
- **F10-FR-012:** Draft or unreviewed safety content is never used in production decisions.
- **F10-FR-013:** Deactivating a caution never rewrites historical activity.
- **F10-FR-014:** Remote conflicts involving safety profiles resolve conservatively and require user review; do not silently choose a less restrictive state.
- **F10-FR-015:** The user must be able to report an inaccurate/confusing warning.

#### F10.5 UI and copy rules

- Red communicates stop only. Amber communicates caution. Both include icon, heading, and text.
- Avoid “injured,” “diagnosed,” “safe,” “treat,” “heal,” “fix,” or “prevent” unless part of approved legal/clinical text.
- Approved default: “This movement may conflict with the caution you saved for your knee. Review the reason or choose another exercise.”
- Hard-stop screen prioritizes “End workout” and appropriate professional-help copy. Emergency wording and regional resources require legal/clinical localization.
- A privacy link explains storage and deletion at the point of collection.

#### F10.6 Edge cases

- Left/right/bilateral issue, multiple areas, conflicting rules, expired/healed status, missing metadata, stale offline profile.
- User adds a now-blocked exercise through an old deep link.
- Safety profile changes mid-session or on another device.
- All session items are excluded.
- User refuses detail collection but wants to stop.
- User chooses pain reason after partial sets.
- Localization lacks approved red-flag copy.
- Backend unavailable during pain-event save.
- Account deletion, logout, or local device shared by multiple users.

#### F10.7 Acceptance criteria

- **F10-AC-001:** Every hard-block and red-flag path prevents new active work from starting.
- **F10-AC-002:** No screen claims an exercise is medically safe or diagnoses the user.
- **F10-AC-003:** The immediate stop path requires no questionnaire.
- **F10-AC-004:** Safety precedence is identical across discovery, planning, session generation, substitution, and progression.
- **F10-AC-005:** Unknown/missing content fails conservatively and explainably.
- **F10-AC-006:** Sensitive records are isolated by user and deletable under the approved retention policy.
- **F10-AC-007:** Historical records retain rule/content version without exposing sensitive details in list views or notifications.
- **F10-AC-008:** Production contains only approved safety rules and copy.

#### F10.8 Minimum tests

- 100% decision-branch coverage for hard block, caution, unknown, and red flag.
- Region/side/severity/rule-version validation.
- Cross-feature exclusion consistency.
- Mid-session pause/stop/partial-save behavior.
- Authorization and cross-user cache/API isolation.
- Offline conflict uses conservative state.
- Content publication gates and retired versions.
- Accessibility: warning announced once, focus moved correctly, stop reachable with VoiceOver/TalkBack.

---

## 12. Cross-feature interaction requirements

Single-feature tests are insufficient. These interactions are mandatory:

| Interaction | Required behavior |
|---|---|
| F02 + F05 + F10 | Warm-up/cooldown contains only equipment-eligible items that pass safety rules. |
| F03 + F04 | Changing guidance level updates cue density without resetting session state. |
| F06 + F02 + F07 | Accepted readiness adaptation changes warm-up, working targets, or rest exactly once and is visible in preview. |
| F05 + F08 + F10 | Every substitute satisfies availability and safety simultaneously. |
| F07 + F08 + F09 | Partial work and substitutions create correctly attributed performance history without inflated volume. |
| F06 + F10 | Pain always invokes safety evaluation; a user cannot override a hard block. |
| F01 + F05 | “I don’t have this” updates temporary availability and refreshes eligible alternatives. |
| F02 + F08 | Replacing a main movement may update not-yet-started specific preparation, but never silently changes completed warm-up. |
| F09 + F03 | Guidance level can change presentation and eligible variation, but progression still needs comparable exact-variation history. |
| All + offline | Restored snapshot uses the same catalog, guidance, safety, and engine versions as when started or explains why safe restoration is impossible. |

Use pairwise generated test cases across guidance level × equipment profile × readiness state × caution state × network state × platform, plus hand-authored safety-critical combinations.

---

## 13. Information architecture and screen map

### 13.1 Existing surfaces to extend

- **Home:** Today card, Start action, curated categories, readiness/adaptation summary when applicable.
- **Activity:** Structured session history, performance detail, progression suggestions, partial/offline-sync state.
- **Calendar / My Plan:** Ordered daily plan, eligibility warnings, target editing, start selected day.
- **Exercise Library:** Search plus category, muscle, difficulty, equipment, level, and caution-aware eligibility.
- **Exercise Detail:** Demonstration, equipment guide, reviewed form content, cautions, alternatives, Add to Plan.
- **Workout Session:** Warm-up/main/cooldown phases, set/rest state, cue, replace/skip, pain/stop, resume and completion review.
- **Profile/Preferences:** Guidance level, units, equipment profiles, cues/audio/haptics, readiness preference, privacy controls.
- **Onboarding:** Continue to collect broad defaults, then allow precise confirmation in settings rather than expanding onboarding excessively.

### 13.2 New logical surfaces

- Pre-workout readiness check.
- Adapted session preview and “What changed and why.”
- Equipment guide.
- Equipment profile editor.
- Replace/skip reason sheet and substitution results.
- Active rest state.
- Resume interrupted workout prompt.
- Session detail with set results and substitution lineage.
- Progression suggestion detail.
- Movement caution profile and in-session pain response.

Use native stack transitions for full tasks and bottom sheets for temporary decisions. A sheet must manage focus, support dismissal policy, and restore focus to its invoking control.

---

## 14. Visual, interaction, and content design contract

### 14.1 Visual continuity

- Reuse tokens in `app/theme/colors.js`; do not create screen-local approximations of brand colors, spacing, radii, shadows, or typography.
- Preserve the current Figma-aligned purple primary, white/cool surfaces, Overpass family, 24px screen gutter, 12px controls, 16px cards, and 56px primary actions unless an approved design-system update changes them globally.
- Keep instructional exercise images neutral and high-clarity. Machines and equipment are appropriate because they teach setup. Avoid color overlays that hide joints, handles, pins, or posture.
- Equipment setup assets should use consistent framing and a quiet cool-neutral background. Decorative hero art and instructional media may use different illustration styles because they serve different purposes.
- Avoid relying only on the current male demonstration set. New content should define a representation strategy and never relabel one model as another.

### 14.2 Mobile hierarchy

- One clear primary action per state.
- Destructive and stop actions remain distinct from performance completion.
- Avoid nested scroll views where possible.
- On screens narrower than 360px, reduce nonessential gaps before type size.
- Primary session controls belong in reachable lower-screen positions, respecting safe areas and keyboard.
- Bottom sheets must remain usable with large text and may expand to full screen.

### 14.3 Motion and feedback

- Motion explains state changes: sheet arrival, progress, set completion, phase transition, substitution.
- Avoid continuous decorative animation during exercise.
- Support reduced motion.
- Haptics are supplementary and failures are ignored safely; they never carry unique meaning.
- Timers use tabular numbers. Screen readers receive milestone announcements, not every-second updates.

### 14.4 Content style

- Short imperative steps: one action per sentence.
- Name the body/equipment precisely but avoid unexplained anatomy jargon for beginners.
- Explain why an adaptation occurred.
- Distinguish required equipment from optional comfort aids.
- Avoid guarantees, diagnosis, fear, shame, or false precision.
- All fitness/safety content includes author/reviewer, source notes where required, version, locale, status, and dates.

---

## 15. Accessibility requirements

- Every interactive element has an accessible name, role, state, and value where relevant.
- Icon-only controls have meaningful labels; decorative images are hidden from accessibility APIs.
- Touch targets are at least 44×44 points.
- Focus moves to a sheet/modal heading on open and returns to the invoking control on close.
- Selected, disabled, busy, expanded, warning, and completion states are conveyed beyond color.
- Dynamic Type/large fonts must not clip primary actions, timers, targets, warning text, or sheet controls.
- Timer announcements are user-controllable and throttled to meaningful milestones.
- Reduced motion removes nonessential transitions.
- RTL layout is supported while ordered numeric steps retain semantic order.
- Web export supports keyboard focus and 200% zoom where the feature is available on web.
- Manual release checks cover VoiceOver on iOS and TalkBack on Android for readiness, active set, rest, substitution, pain stop, and completion.

---

## 16. Content governance and publication

### 16.1 Content lifecycle

```text
draft -> in_review -> approved -> published -> retired
                    -> changes_requested -> draft
```

- Only published, approved content is eligible for new production sessions.
- Safety/contraindication rules require a qualified human reviewer defined by the business.
- Exercise and equipment technique content requires a documented fitness-content reviewer.
- Translation is versioned and must not publish when required safety text is missing.
- Retired content remains resolvable for historical records and restored sessions when policy permits, but is not offered to new sessions.
- Emergency or unsafe content can be remotely disabled if a signed/versioned content delivery mechanism exists; otherwise ship an app update and feature-flag affected guidance.

### 16.2 Minimum content record

- Stable content ID and target exercise/equipment ID.
- Locale.
- Author and reviewer identities/roles.
- Evidence/source note where policy requires.
- Created, reviewed, published, and retired timestamps.
- Semantic version or immutable revision ID.
- Review status and change summary.
- Media ownership/license and alt text.

### 16.3 Content QA checklist

- Correct variation and equipment.
- Correct start/finish and adjustment depiction.
- Required versus optional equipment accurate.
- Instructions ordered and possible to perform.
- Common mistakes and stop conditions do not contradict execution steps.
- No medical claims or guarantees.
- Readable at beginner level and concise in session.
- Localization preserves warning severity.
- Image crop works on supported aspect ratios.
- Offline fallback is meaningful.

---

## 17. Persistence, offline behavior, and synchronization

### 17.1 Storage layers

- **Catalog/guidance:** versioned bundled or cached read-only content.
- **Weekly plan:** server-backed current source with local hydration and optimistic changes as already designed.
- **Active session draft:** user-scoped local durable record, saved atomically after meaningful transitions.
- **Activity/performance history:** local-first append plus authenticated backend sync before F09 launches across devices.
- **Preferences/equipment/cautions:** local hydration with server ownership and version/conflict policy if cross-device support is promised.
- **Outbox:** user-scoped, idempotent pending mutations.

### 17.2 Versioned storage envelope

```ts
type StorageEnvelope<T> = {
  schemaVersion: number;
  userId: string;
  updatedAt: number;
  payload: T;
};
```

Every persisted entity requires a schema version. Migration must be additive where possible, idempotent, and tested with permanent golden fixtures.

### 17.3 Offline rules

- Cached plans and published guidance may start a session offline.
- Active workout, timers, logging, substitutions from cached rules, cooldown, and completion continue offline.
- If candidate or safety metadata is unavailable, fail conservatively and allow skip/end; never generate missing guidance.
- Completed activity saves locally first and enters the outbox.
- Reconnect retries with bounded backoff and idempotency key.
- Server acknowledgement removes only the matching outbox item.
- Active session snapshot is not rewritten when a remote plan changes. Next session receives the new plan.

### 17.4 Conflict policy

- Activity is append-only and deduplicated by session/idempotency ID.
- Plan conflict may use explicit server revision and day-level last-write policy initially, but a user-confirmed future-plan substitution must never silently overwrite unrelated reorder/add changes.
- Safety-profile conflict chooses the more conservative effective outcome until the user reviews differences.
- Preference conflict uses version/timestamp policy and surfaces important changes.

### 17.5 Failure recovery

- Corrupt/truncated local JSON: isolate the record, show a recoverable error, preserve other data, and never overwrite an unknown future version.
- Storage write failure: keep in-memory state, warn the user that resume may not be available, and retry on next material event.
- Sync failure: do not remove local Activity; show pending state and retry.
- Authentication expiry: keep local user-scoped pending data encrypted/protected according to architecture, require sign-in to sync, and prevent another account from seeing it.

---

## 18. API and backend capability contract

Exact endpoint naming may follow existing conventions, but behavior must satisfy this contract.

### 18.1 Required backend capabilities

- Read/update workout preferences and equipment profiles.
- Read/update/delete movement cautions with strict ownership.
- Create/update session drafts only if cross-device resume is promised; local-only draft is acceptable initially.
- Idempotently create completed Activity with set-level results.
- Read paginated activity/performance history by authenticated owner.
- Apply a user-confirmed future target/plan change with revision/conflict detection.
- Submit content reports without exposing other users or internal moderation data.
- Deliver only approved catalog/guidance/rule versions if content is remote.

### 18.2 Response envelope

Follow the project’s established response convention. If no consistent convention exists, use:

```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": { "requestId": "...", "nextCursor": null }
}
```

Errors must include a stable machine code and safe user message. Do not expose stack traces, tokens, database IDs not owned by the user, or validation internals.

### 18.3 Validation and authorization

- Authenticate all plan, session, activity, readiness, equipment-profile, and caution endpoints.
- Derive owner from the authenticated subject. Never trust `userId` in client payload as authorization.
- Validate weekday, identifiers, enums, schema version, timestamps, array limits, text length, numeric bounds, units, set count, result count, and idempotency key.
- Reject unknown/prototype-polluting object shapes.
- Rate-limit mutation and report endpoints appropriately.
- Revalidate safety-critical identifiers and published content status server-side when server behavior depends on them.
- Log request IDs and safe reason codes, never tokens, passwords, body measurements, readiness details, pain notes, or free text.

### 18.4 Suggested activity create semantics

- Client supplies stable `sessionId` as idempotency key.
- First valid request creates the record.
- Exact replay returns the original success.
- Same key with conflicting payload returns a conflict error and does not overwrite.
- Server computes/validates summary counts from items/results rather than trusting duplicated client totals.

---

## 19. Privacy and security requirements

- Treat profile body data, exercise history, readiness, movement cautions, and pain events as sensitive personal data.
- Collect the minimum necessary; prefer fixed reason codes to free text.
- Explain purpose and retention at collection.
- Provide review, correction, export, and deletion paths according to applicable policy/law.
- Scope local keys and in-memory caches by authenticated user and clear visible state before loading another account.
- Use platform-appropriate protected storage for authentication secrets. Do not place tokens in logs or ordinary analytics.
- Encrypt transport using HTTPS outside local development.
- Enforce owner authorization on every backend object operation.
- Analytics must not include detailed readiness responses, body metrics, pain area/severity, free-text notes, or search text by default.
- Notifications must not reveal injury/pain/readiness details on a lock screen.
- Content administration requires role authorization and audit logs.
- Dependency/security audit and secret scan are release gates. Critical/high issues affecting the feature block release.

Threat cases to test include guessed record IDs, user switching with cached state, token expiry during save, replayed session ID, oversized arrays/notes, malicious search/category strings, prototype pollution payloads, corrupt storage, and attempts to publish unapproved content.

---

## 20. Analytics and observability

### 20.1 Product events

Use stable event names and low-sensitivity dimensions:

- `equipment_guide_opened`, `equipment_guide_completed`, `equipment_marked_unavailable`.
- `warmup_previewed`, `warmup_started`, `warmup_skipped`, `cooldown_started`, `cooldown_skipped`.
- `guidance_level_overridden`.
- `form_tip_opened`, `form_tip_dismissed`.
- `equipment_filter_applied`, `equipment_filter_empty_result`.
- `readiness_started`, `readiness_skipped`, `readiness_decision_shown`, `adaptation_accepted`, `adaptation_rejected`.
- `set_completed`, `set_edited`, `rest_started`, `rest_extended`, `rest_skipped`.
- `substitution_requested`, `substitution_selected`, `substitution_no_result`, `exercise_skipped`.
- `progression_shown`, `progression_accepted`, `progression_edited`, `progression_declined`.
- `safety_flow_opened`, `safety_stop_selected`, `content_reported` using only approved broad event/reason codes.
- `session_resume_offered`, `session_resumed`, `session_saved_local`, `session_sync_failed`, `session_synced`.

### 20.2 Forbidden analytics data

- Names, email, tokens, exact user ID where a pseudonymous ID suffices.
- Free-text notes/search.
- Body measurements.
- Pain location, severity, symptoms, clinician restrictions, or injury labels.
- Exact readiness answers or sleep answers.
- Exercise load/reps if not explicitly approved as product analytics; store them only in the user’s functional history.

### 20.3 Operational observability

Monitor aggregate rates for content-resolution failure, invalid legacy record, draft restore failure, timer reconciliation error, duplicate save prevented, sync conflict, rule-version mismatch, and safety content unavailable. Logs must use request/session-safe identifiers and redact sensitive payloads.

---

## 21. Delivery roadmap and dependency order

### Phase 0: Contracts, taxonomy, governance, and flags

Deliver:

- Canonical equipment and movement-pattern taxonomies.
- Exercise guidance v2 schema and validation.
- Versioned session/activity/preferences/caution schemas.
- Pure eligibility/decision interfaces with reason codes.
- Content lifecycle and fixtures.
- Migration plan and feature-flag framework.

Exit gate: catalog integrity and migration tests pass; safety/privacy/content reviewers approve the contracts.

### Phase 1: Honest discovery and education

Deliver F05 equipment filters, F01 equipment guide, F03 guidance presentation, and static reviewed F04 form tips in Detail. Avoid health adaptations.

Exit gate: complete catalog mapping coverage or honest missing-content fallback; library/detail E2E; accessibility review.

### Phase 2: Correct workout execution foundation

Deliver F07 set/rest tracking, timestamp-based timers, draft recovery, structured Activity, backend idempotent history, and sync outbox.

Exit gate: app-kill resume and offline-finish E2E; no duplicate activity; 100% critical state-machine branch coverage.

### Phase 3: Preparation and daily adaptation

Deliver F06 readiness and F02 warm-up/cooldown behind feature flags with preview explanations.

Exit gate: decision table reviewed; all safety stops correct; adaptation never mutates saved plan; full 360px flow passes.

### Phase 4: Workout continuity

Deliver F08 substitutions using equipment, movement, level, and readiness rules. Initially exclude injury-based “safe” claims until F10 governance is approved.

Exit gate: rank/lineage/idempotency tests and equipment-unavailable E2E pass.

### Phase 5: Movement cautions and pain response

Deliver F10 only after qualified safety review, privacy/legal review, copy approval, and production rule publication process exist.

Exit gate: zero continue actions on red-flag paths; 100% safety branch coverage; cross-user isolation and deletion tests pass.

### Phase 6: Progression

Deliver F09 suggestions-only after enough clean structured history exists. Do not auto-apply.

Exit gate: evidence eligibility, unit/equipment increments, suppression rules, and user confirmation are verified with production-like histories.

### 21.1 Feature flags and rollback

Use independent remotely or locally controlled flags for readiness, generated phases, substitutions, pain-aware rules, and progression. A disabled flag must fall back to the last stable flow without invalidating saved sessions/history. Preserve schema readers even when UI is rolled back.

---

## 22. Comprehensive verification strategy

### 22.1 Test layers

- **Pure unit tests:** domain rules, reducers, scoring, filters, conversions, migrations, validation.
- **Data integrity tests:** every published ID resolves; references are acyclic where required; content status/version/media exist.
- **Component tests:** user-visible output and accessible roles/states using an Expo-compatible React Native testing setup.
- **Integration tests:** contexts, local storage, network adapters, outbox, API errors, and account switching.
- **Backend integration tests:** authentication, ownership, validation, idempotency, conflict, pagination, and dev-storage behavior.
- **Native E2E:** critical iOS and Android journeys using a reliable mobile runner.
- **Web E2E:** Playwright for supported web-export behavior.
- **Property tests:** reducer/action sequences, filter sets, unit conversions, ordering invariants, and substitution-cycle termination.
- **Manual tests:** VoiceOver, TalkBack, real device background/lock, haptics/audio, image clarity, and manufacturer variation review.

### 22.2 Coverage gates

- Minimum 80% branches, functions, lines, and statements overall.
- 100% decision-branch coverage for F10 red flags/hard exclusions, F06 readiness boundaries, F07 critical state machine, migrations, F09 unit conversion and eligibility, and sync conflict/idempotency logic.
- No skipped or accepted flaky safety/data-loss tests.
- Mutation testing or equivalent manual mutation audit for the critical reducers/rules is strongly recommended.

### 22.3 Required E2E journeys

1. New beginner, bodyweight-only: plan → readiness → warm-up → two exercises with sets/rest → cooldown → accurate Activity.
2. Experienced gym user: equipment guide → form cue → occupied-equipment substitution → completion → progression eligibility view.
3. Pain response: pause → structured response → red-flag stop; verify no continue path and partial-save choice.
4. Empty today: Start never opens a placeholder; plan a variation, return, and start the correct local weekday queue.
5. Offline recovery: start cached workout, log sets, kill/relaunch, resume exact state, finish offline, reconnect, and create one server record.
6. Cross-user isolation: user A logs out with cached/pending data; user B sees none of it.
7. Migration: legacy family/variation plan and basic activity upgrade without losing weekdays, dates, or identities.
8. Accessibility: complete readiness, pause, rest, skip reason, substitution, pain stop, and summary using VoiceOver and TalkBack.
9. Small-screen stress: 360px width, beginner guidance, low readiness, unavailable equipment, one substitution, one pain skip, rest extension, and final summary remain calm and usable.

### 22.4 Performance and reliability budgets

Confirm budgets with the team before making them hard release gates. Suggested starting targets:

- Filter/recommendation pure computation under 100ms p95 on a reference mid-range device for the production catalog.
- Session control visual feedback under 100ms.
- Timer reconciliation drift no more than one second after a simulated 60-minute background interval.
- Cached session restore content visible within 500ms after screen mount on the reference device.
- No leaked timers/listeners after repeated mount/unmount cycles.
- Lists remain responsive with at least 1,000 synthetic history records and a significantly expanded catalog.

Use trend/tolerance-based CI performance checks, not a fragile single wall-clock assertion.

### 22.5 Test data rules

- Use frozen immutable fixture builders for levels, equipment profiles, readiness boundaries, cautions, rep/time modalities, legacy versions, sync conflicts, and metric/imperial history.
- Use an injectable clock and timezone.
- Expected fixtures must encode product truth and must not reimplement the production algorithm inside the test.
- Property-test failure seeds are saved in CI artifacts.

---

## 23. Requirements traceability and Definition of Done

Maintain a traceability file, recommended at `docs/quality/workout-guidance-traceability.md`, with one row per acceptance criterion:

```text
Requirement ID | Acceptance ID | Risk S1-S4 | Test ID | Layer |
Fixture/precondition | Action | Expected observable result | Platforms |
Offline state | Automation status | Evidence | Owner | Last run/version
```

Test IDs follow `F07-UNIT-001`, `F07-COMP-001`, `F07-INT-001`, `F07-E2E-001`, `F07-PROP-001`, `F07-A11Y-001`, `F07-PERF-001`, `F07-MIG-001`.

Every acceptance criterion maps to at least one automated test unless documented as a manual visual/content/legal check. Safety/data-loss S1 requirements map to unit plus integration plus E2E/manual evidence. Every test maps back to a requirement or is explicitly tagged regression, non-functional, or security.

### 23.1 Definition of Done for each phase

- Approved scope and non-goals are met.
- Requirement IDs are linked to code/tests/review evidence.
- Tests were observed failing before implementation for new behavior.
- Targeted and full suites pass at required coverage.
- Security/privacy and content review issues at critical/high severity are resolved.
- Loading, empty, error, offline, stale, and permission/auth states exist.
- iOS, Android, and supported web behavior is verified proportionately.
- Accessibility checks pass, including real screen readers for critical journeys.
- Expo health check and relevant native/web exports/builds pass.
- No secrets, sensitive logs, fake data, dead controls, or unrelated environment edits.
- Documentation, schema migrations, feature flags, rollout, and rollback are complete.
- Product owner can reproduce the user journey from the acceptance criteria.

---

## 24. Open product decisions and safe defaults

These decisions should be resolved before their related phase. They do not block documenting or building Phase 0.

| Decision | Recommended safe default until approved |
|---|---|
| Library unavailable-equipment behavior | Show all with clear eligibility labels; offer Hide unavailable. |
| Readiness retention | Keep only decision/adaptation with session; detailed answers local and deletable unless sync is explicitly approved. |
| Readiness stale duration | Four hours or any material plan/caution change. |
| Warm-up duration | Offer 3/5/8/10 minutes; default from session length without exceeding available time. |
| Cooldown | Optional and clearly tracked; never required to save workout. |
| Guidance level names | Beginner, Intermediate, Advanced to match onboarding. |
| Mid-session level change | Allowed; applies to future cues/defaults only and preserves recorded work. |
| Rest timer background policy | Continues from absolute deadline; user can pause explicitly. |
| RPE versus RIR | Support schema for both; launch one simple input only after UX/content review. |
| Skip reason persistence | Store fixed reason in session history; never treat one event as permanent preference. |
| Update plan after substitution | Session-only by default; future plan requires separate confirmation. |
| Progression evidence threshold | At least 2-3 comparable successful sessions; exact number reviewed per program. |
| Pain-aware feature public name | Prefer “Movement cautions”/“Pain-aware workout”; user-test before release. |
| Hard-block override | No override in initial release. |
| Safety-content reviewer qualification | Business/legal must define and record it before F10 publication. |
| Activity server retention | Define with privacy/legal before backend history launch. |

---

## 25. Lower-capability AI task prompts

Use these prompts one phase at a time. Paste this entire BRD with the selected prompt so the model has full context.

### 25.1 Planning prompt

```text
You are planning one delivery phase of the MuscleMap Workout Guidance Suite.
Read WORKOUT_GUIDANCE_BRD.md completely. Read AGENTS.md and the current repository files.
Do not write code yet.

Assigned phase: <PHASE NUMBER AND NAME>
Assigned requirement IDs: <LIST>

Produce:
1. Current-state evidence with exact files and current behaviors.
2. A dependency-ordered file-by-file implementation plan.
3. New/changed data contracts and migrations.
4. Pure domain functions and state transitions.
5. Screen/component changes and all UI states.
6. Tests to write first, mapped to acceptance IDs.
7. Security, privacy, safety, accessibility, offline, and rollback risks.
8. Explicit exclusions and unresolved decisions.

Do not assume missing behavior exists. Do not broaden scope. Do not change SDK or environment files.
```

### 25.2 Implementation prompt

```text
Implement only the assigned MuscleMap phase from WORKOUT_GUIDANCE_BRD.md.

Assigned phase: <PHASE NUMBER AND NAME>
Assigned requirement IDs: <LIST>
Approved decisions: <LIST OR NONE>

Mandatory sequence:
1. Verify the repository and working tree; preserve unrelated changes.
2. Recheck the referenced current files and report drift.
3. Write failing tests for each assigned acceptance criterion and run them to prove RED.
4. Implement the smallest complete domain/data behavior with immutable state.
5. Implement every required loading, empty, error, offline, stale, and accessibility state.
6. Run targeted tests, refactor, and run the full phase verification suite.
7. Review for security, privacy, medical-claim wording, sensitive logs, and user ownership.
8. Report implemented behavior, files, tests/results, unverified items, risks, and next phase.

Never fabricate guidance/content. Use approved fixtures only. Do not silently mutate the weekly plan.
Do not call a movement medically safe. Do not add hardcoded secrets, IPs, dates, or user data.
Stop and request a decision only when an unresolved choice would materially change the product contract.
```

### 25.3 Review prompt

```text
Review the implementation against WORKOUT_GUIDANCE_BRD.md, not merely against the diff.

Assigned phase: <PHASE>
Requirement IDs: <LIST>

Check:
- Every acceptance criterion has observable evidence and tests.
- Rules are deterministic, immutable, explainable, and versioned.
- Safety precedence cannot be bypassed.
- Weekly plans are not silently changed by sessions.
- Completed, partial, skipped, replaced, stopped, and unsaved states stay distinct.
- Offline/resume/idempotency/account-switch behavior cannot lose or leak data.
- UI has loading, empty, error, stale, disabled, large-text, screen-reader, and reduced-motion states.
- No unapproved medical claims, generated guidance, secrets, sensitive logs, or analytics payloads.
- Tests cover interactions with already-delivered features.

Return findings first, ordered Critical/High/Medium/Low, with exact file and line evidence.
Then list test gaps, unclear product decisions, and verified strengths. Do not modify code unless asked.
```

### 25.4 QA execution prompt

```text
Create and execute a requirement-traced QA pass for the assigned MuscleMap phase.
Read WORKOUT_GUIDANCE_BRD.md and the implementation diff.

For every acceptance ID, record:
- Test ID and layer.
- Fixture/precondition.
- Exact action.
- Expected observable result.
- Actual result and evidence.
- Platform and network state.

Run relevant unit, data-integrity, component, integration, backend, E2E, accessibility,
performance, migration, Expo health, and export/build checks. Do not say “all good” without evidence.
Do not fix failures unless explicitly asked. Report blockers and reproduction steps precisely.
```

---

## 26. Final program acceptance

The program is complete only when a user can:

1. Define equipment available at a location and browse compatible exercises.
2. Open reviewed equipment setup guidance from Detail and Session.
3. Start today’s actual saved plan and complete a readiness check.
4. Review every generated change and understand why it occurred.
5. Complete or skip a relevant warm-up.
6. Train set by set with accurate rest and background/resume behavior.
7. Read concise variation-specific form guidance at the correct level.
8. Replace an unavailable or unsuitable exercise without losing workout intent or silently altering the plan.
9. Stop immediately on pain/red flags and receive conservative, non-diagnostic guidance.
10. Complete or skip cooldown and see an honest structured summary.
11. Recover the exact workout after interruption and sync one idempotent Activity record.
12. Receive a conservative, explainable next-target suggestion only when sufficient valid evidence exists.
13. Review/delete sensitive readiness/caution data and switch accounts without leakage.
14. Complete the critical flow with large text, reduced motion, VoiceOver, or TalkBack.

The release must contain no known critical/high security issue, cross-user leakage, duplicate activity save, unrecoverable session-data loss, unsafe recommendation path, false completion, unapproved safety content, or dead primary control.

---

## 27. Handoff status

This BRD is ready for architecture/content review and phased implementation. Phase 0 is the correct next engineering step. F10 requires qualified safety/privacy/legal decisions before production behavior, and F09 requires structured history from Phase 2 before meaningful recommendations can launch.
