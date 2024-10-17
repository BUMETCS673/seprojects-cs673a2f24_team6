const mongoose = require('mongoose');

// Define the schema for a user
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,    // Ensures that the email is unique
  },
  name: {
    type: String,
    required: true,
    unique: true,    // Ensures that the username is unique
  },
  password: {
    type: String,
    required: true,  // This will store the hashed password
  },
  createdAt: {
    type: Date,
    default: Date.now,  // Automatically sets the creation date
  },
  workoutLogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkoutLog'
  }]
});

// Create and export the model
module.exports = mongoose.model('User', UserSchema);
