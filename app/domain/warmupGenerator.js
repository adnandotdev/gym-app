const WARMUP_CATALOG = [
  { id: 'wu-1', name: 'Arm Circles', primaryMuscles: ['Shoulders', 'Chest', 'Arms'], sets: 1, reps: 15, equipment: 'Bodyweight' },
  { id: 'wu-2', name: 'Jumping Jacks', primaryMuscles: ['Legs', 'Full Body'], sets: 1, reps: 30, equipment: 'Bodyweight' },
  { id: 'wu-3', name: 'Bodyweight Squats', primaryMuscles: ['Legs', 'Glutes'], sets: 1, reps: 15, equipment: 'Bodyweight' },
  { id: 'wu-4', name: 'Torso Twists', primaryMuscles: ['Abs', 'Back'], sets: 1, reps: 20, equipment: 'Bodyweight' },
  { id: 'wu-5', name: 'Cat-Cow', primaryMuscles: ['Back', 'Abs'], sets: 1, reps: 10, equipment: 'Bodyweight' },
  { id: 'wu-6', name: 'High Knees', primaryMuscles: ['Legs', 'Full Body'], sets: 1, reps: 20, equipment: 'Bodyweight' },
];

/**
 * Generates an adaptive warm-up sequence based on the target muscles
 * of the planned workout.
 */
const generateWarmup = (plan) => {
  if (!plan || !Array.isArray(plan.items) || plan.items.length === 0) {
    return [];
  }

  // 1. Identify all targeted muscles in the workout
  const targetMuscles = new Set();
  for (const item of plan.items) {
    if (Array.isArray(item.primaryMuscles)) {
      item.primaryMuscles.forEach(m => targetMuscles.add(m));
    }
  }

  // 2. Find matching warmups
  const selectedWarmups = [];
  const addedIds = new Set();

  // Always include a general full-body warmup first (if not blocked)
  const fullBody = WARMUP_CATALOG.find(w => w.primaryMuscles.includes('Full Body'));
  if (fullBody) {
    selectedWarmups.push({ ...fullBody, isWarmup: true });
    addedIds.add(fullBody.id);
  }

  // Add muscle-specific warmups
  for (const muscle of targetMuscles) {
    if (selectedWarmups.length >= 3) break; // Limit to 3 items for a quick warmup

    const match = WARMUP_CATALOG.find(w =>
      !addedIds.has(w.id) && w.primaryMuscles.includes(muscle)
    );

    if (match) {
      selectedWarmups.push({ ...match, isWarmup: true });
      addedIds.add(match.id);
    }
  }

  // Generate identities for the session queue
  return selectedWarmups.map(w => ({
    ...w,
    exerciseVariantId: w.id, // For session identity
    phase: 'warmup',
  }));
};

const generateCooldown = (plan, exercises, budgetMinutes = 3) => {
  const generated = [];
  if (!plan || plan.length === 0) return generated;

  // Extract all primary muscles used in the session
  const targetMuscles = new Set();
  plan.forEach(ex => {
    if (ex.primaryMuscles) {
      ex.primaryMuscles.forEach(m => targetMuscles.add(m));
    }
  });

  // Find stretching or mobility exercises
  const cooldownCandidates = exercises.filter(ex =>
    ex.cooldownTags && ex.cooldownTags.length > 0 &&
    ex.primaryMuscles?.some(m => targetMuscles.has(m))
  );

  // Pick up to 2 items depending on budget
  const maxItems = budgetMinutes >= 5 ? 2 : 1;
  const selected = cooldownCandidates.slice(0, maxItems);

  selected.forEach(item => {
    generated.push({
      ...item,
      phase: 'cooldown',
      sets: 1,
      reps: '30s', // Cooldowns are typically duration based
    });
  });

  return generated;
};

module.exports = {
  WARMUP_CATALOG,
  generateWarmup,
  generateCooldown,
};
