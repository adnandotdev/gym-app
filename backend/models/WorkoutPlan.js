const mongoose = require('mongoose');

// Define a sub-schema for individual exercises to keep it modular
const exerciseSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  muscleGroup: { type: String, required: true },
  secondaryMuscles: [{ type: String }],
  equipment: { type: String },
  difficulty: { type: String },
  sets: { type: Number },
  reps: { type: String },
  description: { type: String },
  instructions: [{ type: String }],
  muscleGroupKey: { type: String },
  exerciseFamilyId: { type: String },
  exerciseVariantId: { type: String },
  anatomyExerciseId: { type: String },
  variationSummary: { type: String },
  setupCue: { type: String },
  variationGroup: { type: String },
  isDefaultVariation: { type: Boolean, default: false },
  primaryMuscles: [{ type: String }],
  addedAt: { type: Date, default: Date.now },
});

// Define the main WorkoutPlan schema for the user's weekly schedule
const WorkoutPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  week: {
    Monday: [exerciseSchema],
    Tuesday: [exerciseSchema],
    Wednesday: [exerciseSchema],
    Thursday: [exerciseSchema],
    Friday: [exerciseSchema],
    Saturday: [exerciseSchema],
    Sunday: [exerciseSchema],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to update the `updatedAt` field on save
WorkoutPlanSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('WorkoutPlan', WorkoutPlanSchema);
