// routes/exercise.routes.js
const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/ExerciseController');
const auth = require('../utils/auth');
const { validateExercise } = require('../utils/exerciseValidation');

// Public routes
router.get('/types', exerciseController.getExerciseTypes);
router.get('/equipment', exerciseController.getEquipmentList);

// Protected routes
router.use(auth);

// Create new exercise
router.post('/', validateExercise, exerciseController.createExercise);

// Get all exercises (system + user's)
router.get('/', exerciseController.getAllExercises);

// Search exercises
router.get('/search', exerciseController.searchExercises);

// Get exercises by type
router.get('/type/:type', exerciseController.getExercisesByType);

// Get user's custom exercises
router.get('/custom', exerciseController.getUserExercises);

// Clone system exercise to user's custom exercises
router.post('/:id/clone', exerciseController.cloneExercise);

// Get specific exercise
router.get('/:id', exerciseController.getExercise);

// Update exercise (only user's custom exercises)
router.put('/:id', validateExercise, exerciseController.updateExercise);

// Delete exercise (only user's custom exercises)
router.delete('/:id', exerciseController.deleteExercise);

module.exports = router;