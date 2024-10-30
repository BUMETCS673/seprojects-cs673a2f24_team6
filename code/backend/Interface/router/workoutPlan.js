const express = require('express');
const router = express.Router();
const WorkoutPlanController = require('../controllers/WorkoutPlanController');

// Route for creating a new workout plan
router.post("/", WorkoutPlanController.createWorkoutPlan);

// Route for deleting a workout plan
router.delete("/", WorkoutPlanController.deleteWorkoutPlan);

// Route for updating an existing workout plan
router.put("/", WorkoutPlanController.updateWorkoutPlan);

// Route for getting all workout plans for a user
router.get("/", WorkoutPlanController.getWorkoutPlans);

module.exports = router;
