const mongoose = require('mongoose');

// Define the schema for an exercise
const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,  // Name of the exercise, e.g., "Bench Press"
  },
  category: {
    type: String,
    required: true,  // e.g., "Strength", "Cardio"
  },
  equipment: {
    type: String,    // Equipment used, e.g., "Dumbbell", "Kettlebell"
  },
  description: {
    type: String,    // Short description of the exercise
  },
  muscleGroups: [String], // List of muscle groups targeted, e.g., ["Chest", "Triceps"]
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Create and export the model
module.exports = mongoose.model('Exercise', ExerciseSchema);
