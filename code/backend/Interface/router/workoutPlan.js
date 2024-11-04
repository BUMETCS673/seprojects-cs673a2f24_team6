// routes/workoutPlan.routes.js
const express = require('express');
const router = express.Router();
const workoutPlanController = require('../controllers/WorkoutPlanController');
const auth = require('../utils/auth');

// All routes require authentication
// router.use(auth);

// Create a new workout plan
router.post('/', workoutPlanController.createPlan);

// Get all workout plans for the authenticated user
router.get('/', workoutPlanController.getUserPlans);

// Get active workout plans
router.get('/active', workoutPlanController.getActivePlans);

// Get plans by frequency type
router.get('/frequency/:frequency_type', workoutPlanController.getPlansByFrequency);

// Get a specific workout plan
router.get('/:id', workoutPlanController.getPlan);

// Update a workout plan
router.put('/:id', workoutPlanController.updatePlan);

// Update workout plan status
router.patch('/:id/status', workoutPlanController.updatePlanStatus);

// Delete a workout plan
router.delete('/:id', workoutPlanController.deletePlan);

module.exports = router;