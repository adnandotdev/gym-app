const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const WorkoutPlan = require('../models/WorkoutPlan');
const { protect } = require('../middleware/authMiddleware');
const devMemoryStore = require('../utils/devMemoryStore');

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Helper to return an empty template
const getEmptyWeek = () => ({
  Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
});

const isDbConnected = () => mongoose.connection.readyState === 1;
const getUserId = (req) => String(req.user._id || req.user.id);

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

    if (!DAYS.includes(day)) {
      return res.status(400).json({ success: false, message: 'Invalid day specified' });
    }

    if (!isDbConnected()) {
      const week = devMemoryStore.setWorkoutPlanDay(getUserId(req), day, exercises);
      return res.status(200).json({ success: true, data: { week }, mode: 'memory' });
    }

    const updatePath = `week.${day}`;
    
    // Atomic update to prevent VersionError during concurrent requests
    const plan = await WorkoutPlan.findOneAndUpdate(
      { userId: req.user._id },
      { 
        $set: { [updatePath]: exercises || [] },
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

    if (!DAYS.includes(day)) {
      return res.status(400).json({ success: false, message: 'Invalid day specified' });
    }
    if (!exercise || !exercise.id) {
      return res.status(400).json({ success: false, message: 'Invalid exercise payload' });
    }

    if (!isDbConnected()) {
      const result = devMemoryStore.addWorkoutExercise(getUserId(req), day, exercise);
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
    const exists = plan.week[day].some(ex => ex.id === exercise.id);
    if (exists) {
      return res.status(400).json({ success: false, message: 'Exercise already in plan for this day' });
    }

    plan.week[day].push(exercise);
    await plan.save();

    res.status(200).json({ success: true, data: plan.week[day] });
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

    if (!DAYS.includes(day)) {
      return res.status(400).json({ success: false, message: 'Invalid day specified' });
    }
    if (!exerciseId) {
      return res.status(400).json({ success: false, message: 'No exerciseId provided' });
    }

    if (!isDbConnected()) {
      const exercises = devMemoryStore.removeWorkoutExercise(getUserId(req), day, exerciseId);
      return res.status(200).json({ success: true, data: exercises, mode: 'memory' });
    }

    let plan = await WorkoutPlan.findOne({ userId: req.user._id });
    
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Workout plan not found' });
    }

    // Filter out the specific exercise
    plan.week[day] = plan.week[day].filter(ex => ex.id !== exerciseId);
    await plan.save();

    res.status(200).json({ success: true, data: plan.week[day] });
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

    if (!DAYS.includes(day)) {
      return res.status(400).json({ success: false, message: 'Invalid day specified' });
    }

    if (!isDbConnected()) {
      devMemoryStore.setWorkoutPlanDay(getUserId(req), day, []);
      return res.status(200).json({ success: true, data: [], mode: 'memory' });
    }

    let plan = await WorkoutPlan.findOne({ userId: req.user._id });
    
    if (plan) {
      plan.week[day] = [];
      await plan.save();
    }

    res.status(200).json({ success: true, data: [] });
  } catch (error) {
    console.error('Clear Day Error:', error);
    res.status(500).json({ success: false, message: 'Failed to clear day' });
  }
});

module.exports = router;
