const test = require('node:test');
const assert = require('node:assert/strict');

const {
  createWorkoutSession,
  getCurrentExercise,
  getRecordsForDate,
  getRecordDateKey,
  getSessionSummary,
  getRecommendedTarget,
  getTodayName,
  getWorkoutSessionProgress,
  workoutSessionReducer,
} = require('./workoutSession');

const plan = [
  { id: 'one', name: 'First move', sets: 3, reps: '10' },
  { id: 'two', name: 'Second move', exerciseVariantId: 'two--a', sets: 2, reps: '12' },
  { id: 'three', name: 'Third move', sets: 1, reps: '20' },
];

test('creates an ordered session snapshot from valid planned exercises', () => {
  const source = plan.map((exercise) => Object.freeze({ ...exercise }));
  const session = createWorkoutSession({ day: 'Monday', exercises: source, startedAt: 100 });

  assert.equal(session.status, 'active');
  assert.deepEqual(session.queue.map((item) => item.identity), ['one', 'two--a', 'three']);
  assert.equal(getCurrentExercise(session).name, 'First move');
  assert.notEqual(session.queue[0].exercise, source[0]);
});

test('rejects invalid records and removes duplicate identities without mutating input', () => {
  const source = Object.freeze([
    Object.freeze({ id: 'one', name: 'First move' }),
    Object.freeze({ id: 'one', name: 'Duplicate' }),
    null,
    Object.freeze({ id: '', name: 'Blank id' }),
  ]);

  const session = createWorkoutSession({ day: 'Tuesday', exercises: source });

  assert.equal(session.queue.length, 1);
  assert.equal(session.rejectedCount, 3);
  assert.equal(source.length, 4);
});

test('empty sessions remain safe no-ops', () => {
  const session = createWorkoutSession({ day: 'Wednesday', exercises: null });
  assert.equal(session.status, 'empty');
  assert.equal(getCurrentExercise(session), null);
  assert.equal(workoutSessionReducer(session, { type: 'SKIP_CURRENT' }), session);
});

test('ticks only while active and pause/resume is immutable', () => {
  const initial = createWorkoutSession({ day: 'Monday', exercises: plan, startedAt: 1000 });

  // Need to start a set to make the exercise timer tick
  let state = workoutSessionReducer(initial, { type: 'START_SET', timestamp: 1000 });

  const ticked = workoutSessionReducer(state, { type: 'TICK', timestamp: 2000 });
  const paused = workoutSessionReducer(ticked, { type: 'TOGGLE_PAUSE', timestamp: 2000 });
  const pausedTick = workoutSessionReducer(paused, { type: 'TICK', timestamp: 3000 });
  const resumed = workoutSessionReducer(paused, { type: 'TOGGLE_PAUSE', timestamp: 3000 });

  assert.equal(ticked.totalElapsedSeconds, 1); // Total session tick increments naively
  assert.equal(ticked.queue[0].elapsedSeconds, 1); // Exercise tick uses timestamps
  assert.equal(paused.status, 'paused');
  assert.equal(pausedTick.queue[0].elapsedSeconds, 1); // Paused tick doesn't increase elapsed
  assert.equal(resumed.status, 'active');
  assert.notEqual(ticked, initial);
  assert.equal(initial.totalElapsedSeconds, 0);
});

test('reset current timer leaves total session time and prior results intact', () => {
  let state = createWorkoutSession({ day: 'Monday', exercises: plan, startedAt: 1000 });
  state = workoutSessionReducer(state, { type: 'START_SET', timestamp: 1000 });
  state = workoutSessionReducer(state, { type: 'TICK', timestamp: 2000 });
  state = workoutSessionReducer(state, { type: 'TICK', timestamp: 3000 });
  const reset = workoutSessionReducer(state, { type: 'RESET_CURRENT_TIMER', timestamp: 4000 });

  assert.equal(reset.totalElapsedSeconds, 2);
  assert.equal(reset.queue[0].elapsedSeconds, 0);
  assert.equal(reset.status, 'active');
});

test('complete advances to the next exercise and preserves saved order', () => {
  const initial = createWorkoutSession({ day: 'Monday', exercises: plan });
  const next = workoutSessionReducer(initial, { type: 'COMPLETE_CURRENT' });

  assert.equal(next.currentIndex, 1);
  assert.equal(next.queue[0].status, 'completed');
  assert.equal(next.queue[1].status, 'pending');
  assert.equal(getCurrentExercise(next).name, 'Second move');
});

test('skip advances, records skipped separately, and can be undone', () => {
  const initial = createWorkoutSession({ day: 'Monday', exercises: plan });
  const skipped = workoutSessionReducer(initial, { type: 'SKIP_CURRENT' });

  assert.equal(skipped.currentIndex, 1);
  assert.equal(skipped.queue[0].status, 'skipped');
  assert.equal(skipped.lastSkippedIndex, 0);

  const undone = workoutSessionReducer(skipped, { type: 'UNDO_LAST_SKIP' });
  assert.equal(undone.currentIndex, 0);
  assert.equal(undone.queue[0].status, 'pending');
  assert.equal(undone.lastSkippedIndex, null);
});

test('last action completes the workout and repeated actions are idempotent', () => {
  let state = createWorkoutSession({ day: 'Monday', exercises: plan.slice(0, 2) });
  state = workoutSessionReducer(state, { type: 'COMPLETE_CURRENT' });
  state = workoutSessionReducer(state, { type: 'SKIP_CURRENT' });

  assert.equal(state.status, 'completed');
  assert.equal(getCurrentExercise(state), null);
  assert.equal(workoutSessionReducer(state, { type: 'SKIP_CURRENT' }), state);
  assert.deepEqual(getSessionSummary(state), {
    total: 2,
    completed: 1,
    partial: 0,
    skipped: 1,
    elapsedSeconds: 0,
    didCompleteAny: true,
  });
});

test('progress display stays full when the completion sheet is showing', () => {
  let state = createWorkoutSession({ day: 'Monday', exercises: plan.slice(0, 2) });
  state = workoutSessionReducer(state, { type: 'COMPLETE_CURRENT' });
  state = workoutSessionReducer(state, { type: 'SKIP_CURRENT' });

  assert.deepEqual(getWorkoutSessionProgress(state), {
    currentLabel: 2,
    total: 2,
    percent: 100,
  });
});

test('all-skipped summary never reports successful completion', () => {
  let state = createWorkoutSession({ day: 'Monday', exercises: plan.slice(0, 1) });
  state = workoutSessionReducer(state, { type: 'SKIP_CURRENT' });
  assert.equal(getSessionSummary(state).didCompleteAny, false);
});

test('maps JavaScript weekday indexes correctly including Sunday', () => {
  assert.equal(getTodayName(new Date('2026-09-06T12:00:00Z')), 'Sunday');
  assert.equal(getTodayName(new Date('2026-09-07T12:00:00Z')), 'Monday');
});

test('filters activity history by the actual local calendar date', () => {
  const today = new Date(2026, 8, 7, 12, 0, 0);
  const sameDayEarlier = new Date(2026, 8, 7, 6, 0, 0).getTime();
  const previousWeekSameWeekday = new Date(2026, 7, 31, 12, 0, 0).getTime();
  const history = [
    { id: 'today', day: 'Monday', completedAt: sameDayEarlier },
    { id: 'old-monday', day: 'Monday', completedAt: previousWeekSameWeekday },
    { id: 'invalid', day: 'Monday', completedAt: Number.NaN },
  ];

  assert.equal(getRecordDateKey(history[0]), '2026-09-07');
  assert.deepEqual(getRecordsForDate(history, today).map((record) => record.id), ['today']);
});

test('F07 Set Lifecycle: START_SET -> COMPLETE_SET (transitions to rest and tracks reps)', () => {
  let state = createWorkoutSession({ day: 'Monday', exercises: plan, startedAt: 1000 });

  // 1. Start Set
  state = workoutSessionReducer(state, { type: 'START_SET', timestamp: 2000 });
  assert.equal(state.activeTimer.type, 'work');
  assert.equal(state.activeTimer.startedAt, 2000);

  // 2. Complete Set
  state = workoutSessionReducer(state, {
    type: 'COMPLETE_SET',
    timestamp: 4000,
    payload: { actualReps: 8, actualLoadKg: 50 }
  });

  // Should transition to rest
  assert.equal(state.activeTimer.type, 'rest');
  assert.equal(state.queue[0].currentSetIndex, 1);
  assert.equal(state.queue[0].results.length, 1);

  const res = state.queue[0].results[0];
  assert.equal(res.actualReps, 8);
  assert.equal(res.actualLoadKg, 50);
  assert.equal(res.actualSeconds, 2); // 4000 - 2000
});

test('F07 Set Lifecycle: SKIP_SET (transitions immediately to next set)', () => {
  let state = createWorkoutSession({ day: 'Monday', exercises: plan, startedAt: 1000 });

  state = workoutSessionReducer(state, { type: 'SKIP_SET', timestamp: 1000 });
  assert.equal(state.activeTimer.type, 'none'); // No rest needed if skipped
  assert.equal(state.queue[0].currentSetIndex, 1);
  assert.equal(state.queue[0].results[0].status, 'skipped');
});

test('skipping every set records the exercise as skipped in the session summary', () => {
  let state = createWorkoutSession({ day: 'Monday', exercises: [plan[2]], startedAt: 1000 });
  state = workoutSessionReducer(state, { type: 'SKIP_SET', timestamp: 2000 });

  assert.equal(state.status, 'completed');
  assert.equal(state.queue[0].status, 'skipped');
  assert.equal(getSessionSummary(state).skipped, 1);
  assert.equal(getSessionSummary(state).didCompleteAny, false);
});

test('completing some sets and skipping the rest records a partial exercise', () => {
  let state = createWorkoutSession({ day: 'Monday', exercises: [plan[1]], startedAt: 1000 });
  state = workoutSessionReducer(state, { type: 'COMPLETE_SET', timestamp: 2000, payload: { actualReps: 12, actualLoadKg: 20 } });
  state = workoutSessionReducer(state, { type: 'SKIP_SET', timestamp: 3000 });

  const summary = getSessionSummary(state);
  assert.equal(state.queue[0].status, 'partial');
  assert.equal(summary.partial, 1);
  assert.equal(summary.didCompleteAny, true);
});

test('F07 Set Lifecycle: Final COMPLETE_SET advances exercise', () => {
  // 'three' has 1 set
  let state = createWorkoutSession({ day: 'Monday', exercises: [plan[2]], startedAt: 1000 });
  state = workoutSessionReducer(state, { type: 'START_SET', timestamp: 1000 });
  state = workoutSessionReducer(state, { type: 'COMPLETE_SET', timestamp: 2000 });

  // 1 set complete -> exercise complete -> workout complete
  assert.equal(state.status, 'completed');
  assert.equal(state.queue[0].status, 'completed');
});

test('F09 Progressive Overload: getRecommendedTarget returns last completed set load and reps', () => {
  const history = [
    {
      completedAt: 1000,
      items: [
        { identity: 'one', results: [{ actualLoadKg: 20, actualReps: 10 }, { actualLoadKg: 22.5, actualReps: 8 }] }
      ]
    },
    {
      completedAt: 500,
      items: [
        { identity: 'one', results: [{ actualLoadKg: 15, actualReps: 12 }] }
      ]
    }
  ];

  const target = getRecommendedTarget('one', history);
  assert.deepEqual(target, { targetLoadKg: 22.5, targetReps: 8 });
});

test('F08 Smart Substitution: SUBSTITUTE_CURRENT replaces exercise in place', () => {
  let state = createWorkoutSession({ day: 'Monday', exercises: plan });
  const substitute = { id: 'alt-one', name: 'Alternative First Move', sets: 2, reps: '15' };

  state = workoutSessionReducer(state, { type: 'SUBSTITUTE_CURRENT', payload: substitute });

  assert.equal(state.queue[0].identity, 'alt-one');
  assert.equal(state.queue[0].isSubstituted, true);
  assert.equal(state.queue[0].originalIdentity, 'one');
  assert.equal(state.queue[0].targets.length, 2);
  assert.equal(state.queue[0].targets[0].targetMin, 15);
  assert.equal(state.currentIndex, 0); // Still on the first item
});

test('F10 Safety Pause: PAUSE_FOR_SAFETY blocks item and pauses timer', () => {
  let state = createWorkoutSession({ day: 'Monday', exercises: plan });
  state = workoutSessionReducer(state, { type: 'START_SET', timestamp: 1000 });
  state = workoutSessionReducer(state, { type: 'PAUSE_FOR_SAFETY' });

  assert.equal(state.status, 'paused');
  assert.equal(state.queue[0].status, 'blocked');
  assert.equal(state.queue[0].blockReason, 'safety');
  assert.equal(state.activeTimer.type, 'none'); // Timer halted
});

test('skipping a safety-blocked exercise continues with the next exercise active', () => {
  let state = createWorkoutSession({ day: 'Monday', exercises: plan.slice(0, 2) });
  state = workoutSessionReducer(state, { type: 'PAUSE_FOR_SAFETY' });
  state = workoutSessionReducer(state, { type: 'SKIP_CURRENT' });

  assert.equal(state.status, 'active');
  assert.equal(state.currentIndex, 1);
  assert.equal(state.queue[0].status, 'skipped');
});

test('F02 Cooldown: APPEND_COOLDOWN reactivates completed session', () => {
  let state = createWorkoutSession({ day: 'Monday', exercises: [plan[0]] }); // Just one exercise
  state = workoutSessionReducer(state, { type: 'SKIP_CURRENT' }); // completed
  assert.equal(state.status, 'completed');

  const cooldownExercise = { id: 'stretch-1', name: 'Static Stretch', sets: 1, reps: '30s' };
  state = workoutSessionReducer(state, { type: 'APPEND_COOLDOWN', payload: [cooldownExercise] });

  assert.equal(state.status, 'active');
  assert.equal(state.queue.length, 2);
  assert.equal(state.queue[1].phase, 'cooldown');
  assert.equal(state.currentIndex, 1);
});
