const mongoose = require('mongoose');

// Define the schema for a workout log
const WorkoutLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,  // The user who performed the workout
  },
  exercises: [{
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
      required: true,  // The exercise performed
    },
    sets: {
      type: Number,
      required: true,  // Number of sets performed
    },
    reps: {
      type: Number,
      required: true,  // Number of repetitions per set
    },
    weight: Number,    // Optional: Weight used, if applicable
  }],
  workoutDate: {
    type: Date,
    default: Date.now,  // The date of the workout
  },
  duration: Number,      // Optional: Duration of the workout in minutes
});

// Create and export the model
module.exports = mongoose.model('WorkoutLog', WorkoutLogSchema);
