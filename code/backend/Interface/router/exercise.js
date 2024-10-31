// routes/exercise.routes.js
const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exercise.controller');
const auth = require('../middleware/auth');

// Public routes
router.get('/', exerciseController.getAllExercises);
router.get('/search', exerciseController.searchExercises);
router.get('/type/:type', exerciseController.getExercisesByType);
router.get('/duration', exerciseController.getExercisesByDuration);
router.get('/:id', exerciseController.getExercise);

// Protected routes - add validation middleware
router.post('/', auth, exerciseController.validateExerciseData, exerciseController.createExercise);
router.put('/:id', auth, exerciseController.validateExerciseData, exerciseController.updateExercise);
router.delete('/:id', auth, exerciseController.deleteExercise);
router.get('/user/:userId', auth, exerciseController.getUserExercises);

module.exports = router;