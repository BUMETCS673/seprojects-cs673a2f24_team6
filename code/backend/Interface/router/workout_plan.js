const express = require('express');
const router = express.Router();
const PlanController = require('../controllers/PlanController');
const auth = require('../utils/auth');

// All routes require authentication
router.use(auth);

// Create a new workout plan
router.post('/', PlanController.createPlan);

// Get all workout plans for the authenticated user
router.get('/', PlanController.getUserPlans);

// Update a workout plan
router.put('/', PlanController.updatePlan);

// Delete a workout plan
router.delete('/', PlanController.deletePlan);

module.exports = router;