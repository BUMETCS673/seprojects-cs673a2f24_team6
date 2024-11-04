// router/workoutPlan.js
const express = require('express');
const router = express.Router();
const workoutPlanController = require('../controllers/WorkoutPlanController');
const auth = require('../utils/auth');

// router.use(auth);

router.post('/', workoutPlanController.createPlan);
router.get('/', workoutPlanController.getUserPlans);
router.get('/active', workoutPlanController.getActivePlans);
router.get('/frequency/:frequency_type', workoutPlanController.getPlansByFrequency);
router.get('/:id', workoutPlanController.getPlan);
router.put('/:id', workoutPlanController.updatePlan);
router.patch('/:id/status', workoutPlanController.updatePlanStatus);
router.delete('/:id', workoutPlanController.deletePlan);

module.exports = router;