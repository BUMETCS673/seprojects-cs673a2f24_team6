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

// Get active workout plans
router.get('/active', PlanController.getActivePlans);

// Get plans by frequency type
router.get('/frequency/:frequency_type', PlanController.getPlansByFrequency);

// Get a specific workout plan
router.get('/:id', PlanController.getPlan);

// Update a workout plan
router.put('/:id', PlanController.updatePlan);

// Update workout plan status
router.patch('/:id/status', PlanController.updatePlanStatus);

// Delete a workout plan
router.delete('/:id', PlanController.deletePlan);

module.exports = router;