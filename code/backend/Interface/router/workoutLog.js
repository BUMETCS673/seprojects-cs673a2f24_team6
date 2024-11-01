// routes/workoutLog.routes.js
const express = require('express');
const router = express.Router();
const workoutLogController = require('../controllers/WorkoutLogController');
const auth = require('../utils/auth');

// All routes require authentication
router.use(auth);

// Create a new workout log
router.post('/', workoutLogController.createWorkout);

// Get all workouts for the authenticated user
router.get('/', workoutLogController.getUserWorkouts);

// Get workouts by date range
router.get('/range', workoutLogController.getWorkoutsByDateRange);

// Get workouts for a specific day
router.get('/day/:date', workoutLogController.getWorkoutsByDay);

// Get workout statistics
router.get('/stats', workoutLogController.getStats);

// Get a specific workout log
router.get('/:id', workoutLogController.getWorkout);

// Update a workout log
router.put('/:id', workoutLogController.updateWorkout);

// Update workout status
router.patch('/:id/status', workoutLogController.updateWorkoutStatus);

// Delete a workout log
router.delete('/:id', workoutLogController.deleteWorkout);

module.exports = router;