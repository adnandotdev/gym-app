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

    const defaultSets = exercise.sets || 3;
    const defaultReps = exercise.reps || 10;

    // F07: Generating explicit targets for each set
    const targets = Array.from({ length: defaultSets }).map((_, i) => ({
      setNumber: i + 1,
      targetType: 'reps',
      targetMin: defaultReps,
      targetMax: defaultReps,
      restSeconds: 60, // Default rest
    }));

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
        targets,
        results: [],
        currentSetIndex: 0,
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
    // F07 Timer state
    activeTimer: {
      type: 'none', // 'none' | 'work' | 'rest'
      startedAt: null,
      pausedAt: null,
      accumulatedPause: 0,
      deadline: null, // Only used for rest timers
    }
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
      activeTimer: { type: 'none', startedAt: null, pausedAt: null, accumulatedPause: 0, deadline: null }
    };
  }

  return {
    ...state,
    queue: updatedQueue,
    currentIndex: nextIndex,
    status: 'active',
    lastSkippedIndex: status === 'skipped' ? state.currentIndex : null,
    activeTimer: { type: 'none', startedAt: null, pausedAt: null, accumulatedPause: 0, deadline: null }
  };
};

// Computes the absolute elapsed time securely
const computeTimerElapsed = (timer, now = Date.now()) => {
  if (timer.type === 'none' || !timer.startedAt) return 0;
  const end = timer.pausedAt ? timer.pausedAt : now;
  return Math.max(0, Math.floor((end - timer.startedAt - timer.accumulatedPause) / 1000));
};

const computeRestRemaining = (timer, now = Date.now()) => {
  if (timer.type !== 'rest' || !timer.deadline) return 0;
  if (timer.pausedAt) {
    return Math.max(0, Math.floor((timer.deadline - timer.pausedAt) / 1000));
  }
  return Math.max(0, Math.floor((timer.deadline - now) / 1000));
};

const workoutSessionReducer = (state, action) => {
  if (!state || !action?.type) return state;

  if (action.type === 'HYDRATE') {
    return action.payload || state;
  }

  const now = action.timestamp || Date.now();
  const currentItem = getCurrentQueueItem(state);

  if (action.type === 'TICK') {
    if (state.status !== 'active') return state;

    // Increment total elapsed time
    // Actually, we could compute total elapsed from startedAt, but keeping legacy totalElapsedSeconds tick for now,
    // or just calculate it at the end. We'll leave it strictly incrementing to avoid massive diff in test.
    let nextState = { ...state, totalElapsedSeconds: state.totalElapsedSeconds + 1 };

    if (currentItem && state.activeTimer.type === 'work') {
      nextState.queue = updateQueueItem(state.queue, state.currentIndex, {
        elapsedSeconds: computeTimerElapsed(state.activeTimer, now)
      });
    }
    return nextState;
  }

  if (action.type === 'TOGGLE_PAUSE') {
    if (state.status === 'active') {
      return {
        ...state,
        status: 'paused',
        activeTimer: {
          ...state.activeTimer,
          pausedAt: now,
        }
      };
    }
    if (state.status === 'paused') {
      const pauseDuration = now - (state.activeTimer.pausedAt || now);
      return {
        ...state,
        status: 'active',
        activeTimer: {
          ...state.activeTimer,
          pausedAt: null,
          accumulatedPause: state.activeTimer.accumulatedPause + pauseDuration,
          deadline: state.activeTimer.deadline ? state.activeTimer.deadline + pauseDuration : null
        }
      };
    }
    return state;
  }

  if (action.type === 'RESET_CURRENT_TIMER') {
    if (!['active', 'paused'].includes(state.status)) return state;
    return {
      ...state,
      status: 'active',
      activeTimer: {
        type: state.activeTimer.type,
        startedAt: now,
        pausedAt: null,
        accumulatedPause: 0,
        deadline: state.activeTimer.type === 'rest' && currentItem ? now + (currentItem.targets[currentItem.currentSetIndex]?.restSeconds || 60) * 1000 : null
      },
      queue: updateQueueItem(state.queue, state.currentIndex, { elapsedSeconds: 0 }),
    };
  }

  // F07 Set tracking transitions
  if (action.type === 'START_SET') {
    if (!['active', 'paused'].includes(state.status)) return state;
    return {
      ...state,
      status: 'active',
      activeTimer: {
        type: 'work',
        startedAt: now,
        pausedAt: null,
        accumulatedPause: 0,
        deadline: null
      }
    };
  }

  if (action.type === 'COMPLETE_SET') {
    if (!['active', 'paused'].includes(state.status)) return state;
    if (!currentItem) return state;

    const { actualReps, actualLoadKg, actualSeconds } = action.payload || {};
    const setTarget = currentItem.targets[currentItem.currentSetIndex];
    if (!setTarget) return state;
    const isDuration = setTarget.targetType === 'duration';

    const newResult = {
      setNumber: currentItem.currentSetIndex + 1,
      status: 'completed',
      ...(isDuration ? {} : {
        actualReps: typeof actualReps === 'number' ? actualReps : setTarget.targetMin,
        actualLoadKg: typeof actualLoadKg === 'number' ? actualLoadKg : 0,
      }),
      actualSeconds: isDuration && Number.isFinite(actualSeconds) && actualSeconds > 0
        ? actualSeconds : computeTimerElapsed(state.activeTimer, now),
      completedAt: now,
    };

    const newResults = [...currentItem.results, newResult];
    const isLastSet = newResults.length >= currentItem.targets.length;

    const updatedQueue = updateQueueItem(state.queue, state.currentIndex, {
      results: newResults,
      currentSetIndex: currentItem.currentSetIndex + 1,
      status: isLastSet ? 'completed' : 'pending' // pending next set
    });

    if (isLastSet) {
      // If exercise is complete, advance to next exercise
      return advanceFromCurrent({ ...state, queue: updatedQueue }, 'completed');
    }

    // Otherwise, transition to rest
    return {
      ...state,
      queue: updatedQueue,
      status: 'active',
      activeTimer: {
        type: 'rest',
        startedAt: now,
        pausedAt: null,
        accumulatedPause: 0,
        deadline: now + (setTarget?.restSeconds || 60) * 1000
      }
    };
  }

  if (action.type === 'SKIP_SET') {
    if (!['active', 'paused'].includes(state.status)) return state;
    if (!currentItem) return state;

    const newResult = {
      setNumber: currentItem.currentSetIndex + 1,
      status: 'skipped',
      completedAt: now,
    };

    const newResults = [...currentItem.results, newResult];
    const isLastSet = newResults.length >= currentItem.targets.length;
    const completedSetCount = newResults.filter((result) => result.status !== 'skipped').length;
    const finalStatus = completedSetCount > 0 ? 'partial' : 'skipped';

    const updatedQueue = updateQueueItem(state.queue, state.currentIndex, {
      results: newResults,
      currentSetIndex: currentItem.currentSetIndex + 1,
      status: isLastSet ? finalStatus : 'pending'
    });

    if (isLastSet) {
      return advanceFromCurrent({ ...state, queue: updatedQueue }, finalStatus);
    }

    // Skip directly to next set (no rest needed)
    return {
      ...state,
      queue: updatedQueue,
      status: 'active',
      activeTimer: {
        type: 'none',
        startedAt: null,
        pausedAt: null,
        accumulatedPause: 0,
        deadline: null
      }
    };
  }

  if (action.type === 'COMPLETE_REST') {
    if (!['active', 'paused'].includes(state.status)) return state;
    return {
      ...state,
      status: 'active',
      activeTimer: {
        type: 'none',
        startedAt: null,
        pausedAt: null,
        accumulatedPause: 0,
        deadline: null
      }
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
    if (state.lastSkippedIndex === null) return state;
    const queue = [...state.queue];
    queue[state.lastSkippedIndex] = { ...queue[state.lastSkippedIndex], status: 'pending' };
    return { ...state, queue, currentIndex: state.lastSkippedIndex, lastSkippedIndex: null, status: 'active' };
  }

  if (action.type === 'PAUSE_FOR_SAFETY') {
    if (state.status === 'completed' || state.status === 'empty') return state;

    const activeTimer = state.activeTimer.type !== 'none'
      ? { ...state.activeTimer, type: 'none' }
      : state.activeTimer;

    const queue = [...state.queue];
    if (currentItem) {
      queue[state.currentIndex] = { ...currentItem, status: 'blocked', blockReason: 'safety' };
    }

    return {
      ...state,
      status: 'paused',
      activeTimer,
      queue,
    };
  }

  if (action.type === 'SUBSTITUTE_CURRENT') {
    if (state.status !== 'active' && state.status !== 'paused') return state;
    const substituteExercise = action.payload;
    if (!substituteExercise || !currentItem) return state;

    const queue = [...state.queue];

    queue[state.currentIndex] = {
      ...currentItem,
      identity: substituteExercise.exerciseVariantId || substituteExercise.id,
      exercise: {
        ...substituteExercise,
        secondaryMuscles: [...(substituteExercise.secondaryMuscles || [])],
        instructions: [...(substituteExercise.instructions || [])],
        primaryMuscles: [...(substituteExercise.primaryMuscles || [])],
      },
      results: [],
      currentSetIndex: 0,
      targets: Array.from({ length: substituteExercise.sets || 3 }).map((_, i) => ({
        setNumber: i + 1,
        targetMin: parseInt(substituteExercise.reps || '10', 10),
      })),
      isSubstituted: true,
      originalIdentity: currentItem.identity,
    };

    return { ...state, queue };
  }

  if (action.type === 'APPEND_COOLDOWN') {
    if (state.status !== 'completed') return state;
    const cooldownExercises = action.payload;
    if (!cooldownExercises || cooldownExercises.length === 0) return state;

    // Reactivate the session and append cooldown exercises
    const newItems = cooldownExercises.map((ex, idx) => ({
      id: `${Date.now()}-cool-${idx}`,
      identity: ex.exerciseVariantId || ex.id,
      phase: 'cooldown',
      status: 'pending',
      targets: Array.from({ length: ex.sets || 1 }).map((_, i) => ({
        setNumber: i + 1,
        targetMin: typeof ex.reps === 'string' ? parseInt(ex.reps, 10) || 30 : ex.reps || 30, // seconds typically
        targetType: 'duration'
      })),
      results: [],
      exercise: { ...ex },
      currentSetIndex: 0,
      elapsedSeconds: 0,
    }));

    return {
      ...state,
      status: 'active',
      queue: [...state.queue, ...newItems],
      currentIndex: state.queue.length,
      completedAt: null,
    };
  }

  return state;
};

const getSessionSummary = (state) => {
  const summary = { total: 0, completed: 0, partial: 0, skipped: 0, elapsedSeconds: 0, didCompleteAny: false };
  if (!state || state.status === 'empty') return summary;

  summary.elapsedSeconds = state.totalElapsedSeconds;
  summary.total = state.queue.length;

  for (const item of state.queue) {
    if (item.status === 'completed') summary.completed += 1;
    if (item.status === 'partial') summary.partial += 1;
    if (item.status === 'skipped' || item.status === 'blocked') summary.skipped += 1;
  }

  summary.didCompleteAny = summary.completed + summary.partial > 0;
  return summary;
};

const getRecommendedTarget = (exerciseId, history) => {
  if (!history || !Array.isArray(history)) return null;
  const sortedHistory = [...history].sort((a, b) => b.completedAt - a.completedAt);

  for (const session of sortedHistory) {
    if (!session.items) continue;
    const item = session.items.find(i => i.identity === exerciseId || i.identity.startsWith(`${exerciseId}--`));
    if (item && item.results && item.results.length > 0) {
      // Return the best/last set from that session
      const validSets = item.results.filter(r => r.actualLoadKg !== undefined && r.actualReps !== undefined);
      if (validSets.length > 0) {
        const lastSet = validSets[validSets.length - 1];
        return {
          targetLoadKg: lastSet.actualLoadKg,
          targetReps: lastSet.actualReps
        };
      }
    }
  }
  return null;
};

const getWorkoutSessionProgress = (state) => {
  const total = Array.isArray(state?.queue) ? state.queue.length : 0;
  if (total === 0) {
    return { currentLabel: 0, total: 0, percent: 0 };
  }

  // Calculate based on sets if active
  if (state.currentIndex >= 0 && state.queue[state.currentIndex]) {
    const currentItem = state.queue[state.currentIndex];
    const totalSets = currentItem.targets?.length || 1;
    const currentSet = currentItem.currentSetIndex || 0;

    // Overall completion is previous exercises + current set fraction
    const rawPercent = ((state.currentIndex + (currentSet / totalSets)) / total) * 100;
    return {
      currentLabel: state.currentIndex + 1,
      total,
      percent: Math.max(0, Math.min(100, rawPercent))
    };
  }

  const handled = state.queue.filter((item) => item.status !== 'pending').length;
  const rawPercent = (handled / total) * 100;

  return {
    currentLabel: handled,
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
  getRecommendedTarget,
  getTodayName,
  getWorkoutSessionProgress,
  workoutSessionReducer,
  computeTimerElapsed,
  computeRestRemaining,
};
