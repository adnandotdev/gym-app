const DAY_NAMES = Object.freeze([
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]);

const getExerciseIdentity = (exercise) => exercise?.exerciseVariantId || exercise?.id || null;

const isValidExercise = (exercise) => (
  exercise
  && typeof getExerciseIdentity(exercise) === 'string'
  && getExerciseIdentity(exercise).trim().length > 0
  && typeof exercise.name === 'string'
  && exercise.name.trim().length > 0
);

const createQueue = (exercises) => {
  const seen = new Set();
  const source = Array.isArray(exercises) ? exercises : [];

  return source.reduce((queue, exercise) => {
    if (!isValidExercise(exercise)) return queue;
    const identity = getExerciseIdentity(exercise).trim();
    if (seen.has(identity)) return queue;
    seen.add(identity);

    return [
      ...queue,
      {
        identity,
        exercise: {
          ...exercise,
          secondaryMuscles: [...(exercise.secondaryMuscles || [])],
          instructions: [...(exercise.instructions || [])],
          primaryMuscles: [...(exercise.primaryMuscles || [])],
        },
        status: 'pending',
        elapsedSeconds: 0,
      },
    ];
  }, []);
};

const createWorkoutSession = ({ day, exercises, startedAt = Date.now() } = {}) => {
  const queue = createQueue(exercises);
  const sourceCount = Array.isArray(exercises) ? exercises.length : 0;

  return {
    id: `workout-${startedAt}`,
    day: DAY_NAMES.includes(day) ? day : null,
    startedAt,
    completedAt: null,
    status: queue.length > 0 ? 'active' : 'empty',
    currentIndex: queue.length > 0 ? 0 : -1,
    queue,
    totalElapsedSeconds: 0,
    lastSkippedIndex: null,
    rejectedCount: Math.max(0, sourceCount - queue.length),
  };
};

const getCurrentQueueItem = (state) => {
  if (!state || !['active', 'paused'].includes(state.status)) return null;
  return state.queue[state.currentIndex] || null;
};

const getCurrentExercise = (state) => getCurrentQueueItem(state)?.exercise || null;

const updateQueueItem = (queue, index, update) => queue.map((item, itemIndex) => (
  itemIndex === index ? { ...item, ...update } : item
));

const advanceFromCurrent = (state, status) => {
  const updatedQueue = updateQueueItem(state.queue, state.currentIndex, { status });
  const nextIndex = updatedQueue.findIndex((item, index) => (
    index > state.currentIndex && item.status === 'pending'
  ));

  if (nextIndex === -1) {
    return {
      ...state,
      queue: updatedQueue,
      currentIndex: -1,
      status: 'completed',
      completedAt: Date.now(),
      lastSkippedIndex: status === 'skipped' ? state.currentIndex : null,
    };
  }

  return {
    ...state,
    queue: updatedQueue,
    currentIndex: nextIndex,
    status: 'active',
    lastSkippedIndex: status === 'skipped' ? state.currentIndex : null,
  };
};

const workoutSessionReducer = (state, action) => {
  if (!state || !action?.type) return state;

  if (action.type === 'TICK') {
    if (state.status !== 'active') return state;
    const current = getCurrentQueueItem(state);
    if (!current) return state;
    return {
      ...state,
      queue: updateQueueItem(state.queue, state.currentIndex, {
        elapsedSeconds: current.elapsedSeconds + 1,
      }),
      totalElapsedSeconds: state.totalElapsedSeconds + 1,
    };
  }

  if (action.type === 'TOGGLE_PAUSE') {
    if (state.status === 'active') return { ...state, status: 'paused' };
    if (state.status === 'paused') return { ...state, status: 'active' };
    return state;
  }

  if (action.type === 'RESET_CURRENT_TIMER') {
    if (!['active', 'paused'].includes(state.status)) return state;
    return {
      ...state,
      status: 'active',
      queue: updateQueueItem(state.queue, state.currentIndex, { elapsedSeconds: 0 }),
    };
  }

  if (action.type === 'COMPLETE_CURRENT') {
    if (!['active', 'paused'].includes(state.status)) return state;
    return advanceFromCurrent(state, 'completed');
  }

  if (action.type === 'SKIP_CURRENT') {
    if (!['active', 'paused'].includes(state.status)) return state;
    return advanceFromCurrent(state, 'skipped');
  }

  if (action.type === 'UNDO_LAST_SKIP') {
    if (!Number.isInteger(state.lastSkippedIndex)) return state;
    const skippedItem = state.queue[state.lastSkippedIndex];
    if (!skippedItem || skippedItem.status !== 'skipped') return state;

    return {
      ...state,
      queue: updateQueueItem(state.queue, state.lastSkippedIndex, { status: 'pending' }),
      currentIndex: state.lastSkippedIndex,
      status: 'active',
      completedAt: null,
      lastSkippedIndex: null,
    };
  }

  return state;
};

const getSessionSummary = (state) => {
  const queue = Array.isArray(state?.queue) ? state.queue : [];
  const completed = queue.filter((item) => item.status === 'completed').length;
  const skipped = queue.filter((item) => item.status === 'skipped').length;

  return {
    total: queue.length,
    completed,
    skipped,
    elapsedSeconds: state?.totalElapsedSeconds || 0,
    didCompleteAny: completed > 0,
  };
};

const getWorkoutSessionProgress = (state) => {
  const total = Array.isArray(state?.queue) ? state.queue.length : 0;
  if (total === 0) {
    return { currentLabel: 0, total: 0, percent: 0 };
  }

  const handled = state.queue.filter((item) => item.status !== 'pending').length;
  const currentLabel = state.currentIndex >= 0
    ? Math.min(state.currentIndex + 1, total)
    : handled;
  const rawPercent = state.currentIndex >= 0
    ? ((state.currentIndex + 1) / total) * 100
    : (handled / total) * 100;

  return {
    currentLabel,
    total,
    percent: Math.max(0, Math.min(100, rawPercent)),
  };
};

const getTodayName = (date = new Date()) => DAY_NAMES[date.getDay()];

const getRecordDateKey = (recordOrDate = new Date()) => {
  const source = recordOrDate instanceof Date
    ? recordOrDate
    : new Date(recordOrDate?.completedAt || recordOrDate?.startedAt);

  if (Number.isNaN(source.getTime())) return null;

  const year = source.getFullYear();
  const month = String(source.getMonth() + 1).padStart(2, '0');
  const day = String(source.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getRecordsForDate = (history, date = new Date()) => {
  const targetDateKey = getRecordDateKey(date);
  if (!targetDateKey || !Array.isArray(history)) return [];
  return history.filter((record) => getRecordDateKey(record) === targetDateKey);
};

module.exports = {
  DAY_NAMES,
  createWorkoutSession,
  getCurrentExercise,
  getRecordDateKey,
  getRecordsForDate,
  getSessionSummary,
  getTodayName,
  getWorkoutSessionProgress,
  workoutSessionReducer,
};
