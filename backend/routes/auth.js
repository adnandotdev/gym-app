const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const devMemoryStore = require('../utils/devMemoryStore');
const { validateAuthPayload, validateProfileUpdates } = require('../utils/validation');
const { getJwtSignOptions } = require('../config/jwt');

const isDbConnected = () => mongoose.connection.readyState === 1;

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, getJwtSignOptions(process.env));
};

const ONBOARDING_FIELDS = [
  'fitnessGoal',
  'gender',
  'fitnessLevel',
  'age',
  'height',
  'heightUnit',
  'currentWeight',
  'targetWeight',
  'weightUnit',
  'bmi',
  'currentBodyShape',
  'desiredBodyShape',
  'focusAreas',
  'trainingDays',
  'trainingReminder',
  'equipment',
  'injuries',
];

const PROFILE_FIELDS = ['name', ...ONBOARDING_FIELDS];

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const payload = validateAuthPayload(req.body, true);
    if (!payload.ok) return res.status(400).json({ success: false, message: payload.message });
    const { name, email, password } = payload.value;

    if (!isDbConnected()) {
      const existingUser = devMemoryStore.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      const user = await devMemoryStore.createUser({ name, email, password });
      const token = generateToken(user._id);
      return res.status(201).json({ success: true, token, user, mode: 'memory' });
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // 3. Create user (role defaults to "user" in schema)
    const user = await User.create({
      name,
      email,
      password,
    });

    // 4. Generate JWT
    const token = generateToken(user._id);

    // 5. Respond with token and user details (excluding password)
    const userResponse = { ...user._doc };
    delete userResponse.password;

    res.status(201).json({
      success: true,
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const payload = validateAuthPayload(req.body, false);
    if (!payload.ok) return res.status(400).json({ success: false, message: payload.message });
    const { email, password } = payload.value;

    if (!isDbConnected()) {
      const user = await devMemoryStore.validateUser({ email, password });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const token = generateToken(user._id);
      return res.status(200).json({ success: true, token, user, mode: 'memory' });
    }

    // 2. Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // 3. Check password using instance method matchPassword
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // 4. Generate JWT
    const token = generateToken(user._id);

    // 5. Respond with token and user details (excluding password)
    const userResponse = { ...user._doc };
    delete userResponse.password;

    res.status(200).json({
      success: true,
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    // req.user is attached by the protect middleware (excluding password)
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error('Fetch Profile Error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching user profile' });
  }
});

// @route   PUT /api/auth/onboarding
// @desc    Save user onboarding responses and mark onboardingComplete as true
// @access  Private
router.put('/onboarding', protect, async (req, res) => {
  try {
    if (!isDbConnected()) {
      const payload = validateProfileUpdates(req.body, ONBOARDING_FIELDS);
      if (!payload.ok) return res.status(400).json({ success: false, message: payload.message });

      const updatedUser = devMemoryStore.updateUser(req.user._id || req.user.id, {
        ...payload.value,
        onboardingComplete: true,
      });

      if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      return res.status(200).json({ success: true, user: updatedUser, mode: 'memory' });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const payload = validateProfileUpdates(req.body, ONBOARDING_FIELDS);
    if (!payload.ok) return res.status(400).json({ success: false, message: payload.message });

    user.set(payload.value);

    user.onboardingComplete = true;

    // Save changes
    const updatedUser = await user.save();

    // Respond with updated user details (excluding password)
    res.status(200).json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        onboardingComplete: updatedUser.onboardingComplete,
        fitnessGoal: updatedUser.fitnessGoal,
        gender: updatedUser.gender,
        fitnessLevel: updatedUser.fitnessLevel,
        age: updatedUser.age,
        height: updatedUser.height,
        heightUnit: updatedUser.heightUnit,
        currentWeight: updatedUser.currentWeight,
        targetWeight: updatedUser.targetWeight,
        weightUnit: updatedUser.weightUnit,
        bmi: updatedUser.bmi,
        currentBodyShape: updatedUser.currentBodyShape,
        desiredBodyShape: updatedUser.desiredBodyShape,
        focusAreas: updatedUser.focusAreas,
        trainingDays: updatedUser.trainingDays,
        trainingReminder: updatedUser.trainingReminder,
        equipment: updatedUser.equipment,
        injuries: updatedUser.injuries
      }
    });
  } catch (error) {
    console.error('Onboarding Submission Error:', error);
    res.status(500).json({ success: false, message: 'Server error during onboarding submission' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile data (name + physical stats)
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    if (!isDbConnected()) {
      const payload = validateProfileUpdates(req.body, PROFILE_FIELDS);
      if (!payload.ok) return res.status(400).json({ success: false, message: payload.message });

      const updatedUser = devMemoryStore.updateUser(req.user._id || req.user.id, payload.value);

      if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      return res.status(200).json({ success: true, user: updatedUser, mode: 'memory' });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const payload = validateProfileUpdates(req.body, PROFILE_FIELDS);
    if (!payload.ok) return res.status(400).json({ success: false, message: payload.message });

    user.set(payload.value);

    // Save changes
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        onboardingComplete: updatedUser.onboardingComplete,
        fitnessGoal: updatedUser.fitnessGoal,
        gender: updatedUser.gender,
        fitnessLevel: updatedUser.fitnessLevel,
        age: updatedUser.age,
        height: updatedUser.height,
        heightUnit: updatedUser.heightUnit,
        currentWeight: updatedUser.currentWeight,
        targetWeight: updatedUser.targetWeight,
        weightUnit: updatedUser.weightUnit,
        bmi: updatedUser.bmi,
        currentBodyShape: updatedUser.currentBodyShape,
        desiredBodyShape: updatedUser.desiredBodyShape,
        focusAreas: updatedUser.focusAreas,
        trainingDays: updatedUser.trainingDays,
        trainingReminder: updatedUser.trainingReminder,
        equipment: updatedUser.equipment,
        injuries: updatedUser.injuries
      }
    });
  } catch (error) {
    console.error('Profile Update Error:', error);
    res.status(500).json({ success: false, message: 'Server error during profile update' });
  }
});

module.exports = router;
