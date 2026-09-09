const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const WorkoutPlan = require('../models/WorkoutPlan');
const { protect } = require('../middleware/authMiddleware');
const devMemoryStore = require('../utils/devMemoryStore');
const { validateExercise, validateExercises, validateWorkoutDay } = require('../utils/validation');

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Helper to return an empty template
const getEmptyWeek = () => ({
  Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
});

const isDbConnected = () => mongoose.connection.readyState === 1;
const getUserId = (req) => String(req.user._id || req.user.id);
const getExerciseIdentity = (exercise) => {
  if (exercise.exerciseVariantId) return exercise.exerciseVariantId;
  return exercise.id;
};
const isSamePlannedExercise = (existingExercise, incomingExercise) =>
  getExerciseIdentity(existingExercise) === getExerciseIdentity(incomingExercise) ||
  (incomingExercise.isDefaultVariation === true &&
    existingExercise.id === incomingExercise.exerciseFamilyId) ||
  (existingExercise.isDefaultVariation === true &&
    incomingExercise.id === existingExercise.exerciseFamilyId);

// @route   GET /api/workout-plan
// @desc    Get user's complete weekly workout plan
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        data: devMemoryStore.getWorkoutPlan(getUserId(req)),
        mode: 'memory',
      });
    }

    let plan = await WorkoutPlan.findOne({ userId: req.user._id });
    
    if (!plan) {
      return res.status(200).json({ success: true, data: getEmptyWeek() });
    }

    res.status(200).json({ success: true, data: plan.week });
  } catch (error) {
    console.error('Fetch Workout Plan Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch workout plan' });
  }
});

// @route   PUT /api/workout-plan/day
// @desc    Replace the entire exercise array for a specific day (used primarily for migrations)
// @access  Private
router.put('/day', protect, async (req, res) => {
  try {
    const { day, exercises } = req.body;

    const dayPayload = validateWorkoutDay(day, DAYS);
    if (!dayPayload.ok) return res.status(400).json({ success: false, message: dayPayload.message });
    const exercisesPayload = validateExercises(exercises || []);
    if (!exercisesPayload.ok) return res.status(400).json({ success: false, message: exercisesPayload.message });

    if (!isDbConnected()) {
      const week = devMemoryStore.setWorkoutPlanDay(getUserId(req), dayPayload.value, exercisesPayload.value);
      return res.status(200).json({ success: true, data: { week }, mode: 'memory' });
    }

    const updatePath = `week.${dayPayload.value}`;
    
    // Atomic update to prevent VersionError during concurrent requests
    const plan = await WorkoutPlan.findOneAndUpdate(
      { userId: req.user._id },
      { 
        $set: { [updatePath]: exercisesPayload.value },
        $setOnInsert: { createdAt: new Date() }
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    console.error('Update Day Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update day exercises' });
  }
});

// @route   POST /api/workout-plan/add-exercise
// @desc    Add a single exercise to a specific day
// @access  Private
router.post('/add-exercise', protect, async (req, res) => {
  try {
    const { day, exercise } = req.body;

    const dayPayload = validateWorkoutDay(day, DAYS);
    if (!dayPayload.ok) return res.status(400).json({ success: false, message: dayPayload.message });
    const exercisePayload = validateExercise(exercise);
    if (!exercisePayload.ok) return res.status(400).json({ success: false, message: exercisePayload.message });

    if (!isDbConnected()) {
      const result = devMemoryStore.addWorkoutExercise(getUserId(req), dayPayload.value, exercisePayload.value);
      if (result.duplicate) {
        return res.status(400).json({ success: false, message: 'Exercise already in plan for this day' });
      }

      return res.status(200).json({ success: true, data: result.exercises, mode: 'memory' });
    }

    let plan = await WorkoutPlan.findOne({ userId: req.user._id });
    
    if (!plan) {
      plan = new WorkoutPlan({
        userId: req.user._id,
        week: getEmptyWeek()
      });
    }

    // Check for duplicate exercise in that day
    const exists = plan.week[dayPayload.value].some(
      (existingExercise) => isSamePlannedExercise(existingExercise, exercisePayload.value)
    );
    if (exists) {
      return res.status(400).json({ success: false, message: 'Exercise already in plan for this day' });
    }

    plan.week[dayPayload.value] = [...plan.week[dayPayload.value], exercisePayload.value];
    await plan.save();

    res.status(200).json({ success: true, data: plan.week[dayPayload.value] });
  } catch (error) {
    console.error('Add Exercise Error:', error);
    res.status(500).json({ success: false, message: 'Failed to add exercise to plan' });
  }
});

// @route   DELETE /api/workout-plan/remove-exercise
// @desc    Remove a single exercise from a specific day by its ID
// @access  Private
router.delete('/remove-exercise', protect, async (req, res) => {
  try {
    const { day, exerciseId } = req.body;
    const normalizedExerciseId = typeof exerciseId === 'string' ? exerciseId.trim() : '';

    const dayPayload = validateWorkoutDay(day, DAYS);
    if (!dayPayload.ok) return res.status(400).json({ success: false, message: dayPayload.message });
    if (normalizedExerciseId.length === 0) {
      return res.status(400).json({ success: false, message: 'No exerciseId provided' });
    }

    if (!isDbConnected()) {
      const exercises = devMemoryStore.removeWorkoutExercise(getUserId(req), dayPayload.value, normalizedExerciseId);
      return res.status(200).json({ success: true, data: exercises, mode: 'memory' });
    }

    let plan = await WorkoutPlan.findOne({ userId: req.user._id });
    
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Workout plan not found' });
    }

    // Filter out the specific exercise
    plan.week[dayPayload.value] = plan.week[dayPayload.value].filter(
      (ex) => getExerciseIdentity(ex) !== normalizedExerciseId
    );
    await plan.save();

    res.status(200).json({ success: true, data: plan.week[dayPayload.value] });
  } catch (error) {
    console.error('Remove Exercise Error:', error);
    res.status(500).json({ success: false, message: 'Failed to remove exercise from plan' });
  }
});

// @route   DELETE /api/workout-plan/clear-day
// @desc    Wipe all exercises from a specific day
// @access  Private
router.delete('/clear-day', protect, async (req, res) => {
  try {
    const { day } = req.body;

    const dayPayload = validateWorkoutDay(day, DAYS);
    if (!dayPayload.ok) return res.status(400).json({ success: false, message: dayPayload.message });

    if (!isDbConnected()) {
      devMemoryStore.setWorkoutPlanDay(getUserId(req), dayPayload.value, []);
      return res.status(200).json({ success: true, data: [], mode: 'memory' });
    }

    let plan = await WorkoutPlan.findOne({ userId: req.user._id });
    
    if (plan) {
      plan.week[dayPayload.value] = [];
      await plan.save();
    }

    res.status(200).json({ success: true, data: [] });
  } catch (error) {
    console.error('Clear Day Error:', error);
    res.status(500).json({ success: false, message: 'Failed to clear day' });
  }
});

module.exports = router;
