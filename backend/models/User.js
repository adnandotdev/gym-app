const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 8,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  onboardingComplete: {
    type: Boolean,
    default: false,
  },
  fitnessGoal: {
    type: String,
  },
  gender: {
    type: String,
  },
  fitnessLevel: {
    type: String,
  },
  age: {
    type: Number,
  },
  height: {
    type: Number,
  },
  heightUnit: {
    type: String,
    default: 'cm',
  },
  currentWeight: {
    type: Number,
  },
  targetWeight: {
    type: Number,
  },
  weightUnit: {
    type: String,
    default: 'kg',
  },
  bmi: {
    type: Number,
  },
  currentBodyShape: {
    type: Number,
  },
  desiredBodyShape: {
    type: Number,
  },
  focusAreas: [{
    type: String,
  }],
  trainingDays: [{
    type: String,
  }],
  trainingReminder: {
    type: Boolean,
    default: false,
  },
  equipment: {
    type: String,
  },
  injuries: [{
    type: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware to hash the password before saving to the database
UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
