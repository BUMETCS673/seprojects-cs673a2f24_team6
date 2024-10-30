const express = require('express');
const router = express.Router();
const WorkoutLogController = require('../controllers/WorkoutLogController');

// Route to create a workout log
router.post('/create', WorkoutLogController.createLog);

// Route to get all workout logs for a user
router.get('/:userId', WorkoutLogController.getAllLogs);

// Route to get a specific workout log by ID
router.get('/:id', WorkoutLogController.getLogById);

// Route to delete a workout log by ID
router.delete('/:id', WorkoutLogController.deleteLog);

module.exports = router;
