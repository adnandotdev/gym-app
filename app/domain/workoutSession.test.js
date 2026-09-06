const test = require('node:test');
const assert = require('node:assert/strict');

const {
  createWorkoutSession,
  getCurrentExercise,
  getRecordsForDate,
  getRecordDateKey,
  getSessionSummary,
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
  const initial = createWorkoutSession({ day: 'Monday', exercises: plan });
  const ticked = workoutSessionReducer(initial, { type: 'TICK' });
  const paused = workoutSessionReducer(ticked, { type: 'TOGGLE_PAUSE' });
  const pausedTick = workoutSessionReducer(paused, { type: 'TICK' });
  const resumed = workoutSessionReducer(paused, { type: 'TOGGLE_PAUSE' });

  assert.equal(ticked.totalElapsedSeconds, 1);
  assert.equal(ticked.queue[0].elapsedSeconds, 1);
  assert.equal(paused.status, 'paused');
  assert.equal(pausedTick, paused);
  assert.equal(resumed.status, 'active');
  assert.notEqual(ticked, initial);
  assert.equal(initial.totalElapsedSeconds, 0);
});

test('reset current timer leaves total session time and prior results intact', () => {
  let state = createWorkoutSession({ day: 'Monday', exercises: plan });
  state = workoutSessionReducer(state, { type: 'TICK' });
  state = workoutSessionReducer(state, { type: 'TICK' });
  const reset = workoutSessionReducer(state, { type: 'RESET_CURRENT_TIMER' });

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
