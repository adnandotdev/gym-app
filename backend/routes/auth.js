const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const devMemoryStore = require('../utils/devMemoryStore');

const isDbConnected = () => mongoose.connection.readyState === 1;

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate fields
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter all fields (name, email, password)' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

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
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // 3. Create user (role defaults to "user" in schema)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
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
    const { email, password } = req.body;

    // 1. Validate fields
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter both email and password' });
    }

    if (!isDbConnected()) {
      const user = await devMemoryStore.validateUser({ email, password });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const token = generateToken(user._id);
      return res.status(200).json({ success: true, token, user, mode: 'memory' });
    }

    // 2. Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
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
      const updates = {};
      [
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
      ].forEach((field) => {
        if (req.body[field] !== undefined) updates[field] = req.body[field];
      });

      const updatedUser = devMemoryStore.updateUser(req.user._id || req.user.id, {
        ...updates,
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

    // List of onboarding fields
    const onboardingFields = [
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
      'injuries'
    ];

    // Map body fields to user object
    onboardingFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

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
      const updates = {};
      [
        'name',
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
      ].forEach((field) => {
        if (req.body[field] !== undefined) updates[field] = req.body[field];
      });

      const updatedUser = devMemoryStore.updateUser(req.user._id || req.user.id, updates);

      if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      return res.status(200).json({ success: true, user: updatedUser, mode: 'memory' });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // List of updateable fields
    const allowedFields = [
      'name',
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
      'injuries'
    ];

    // Map body fields to user object
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

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
