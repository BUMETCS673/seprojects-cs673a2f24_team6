const express = require('express');
const router = express.Router();
const ExerciseController = require('../controllers/ExerciseController');

// Route to create an exercise
router.post('/create', ExerciseController.createExercise);

// Route to get all exercises for a user
router.get('/:userId', ExerciseController.getAllExercises);

// Route to get a specific exercise by ID
router.get('/:id', ExerciseController.getExerciseById);

// Route to delete an exercise by ID
router.delete('/:id', ExerciseController.deleteExercise);

module.exports = router;
