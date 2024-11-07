// router/exercise.js
const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/ExerciseController');
const auth = require('../utils/auth');
const { validateExercise } = require('../utils/evercise_validation');

// Public routes
router.get('/types', exerciseController.getTypes);            // Changed from getExerciseTypes
router.get('/equipment', exerciseController.getEquipmentList);

// Protected routes
router.use(auth);

// Create new exercise
router.post('/', validateExercise, exerciseController.create);  // Changed from createExercise

// Get all exercises
router.get('/', exerciseController.getAll);                    // Changed from getAllExercises

// Search exercises
router.get('/search', exerciseController.search);              // Changed from searchExercises

// Get exercises by type
router.get('/type/:type', exerciseController.getByType);      // Changed from getExercisesByType

// Get user's custom exercises
router.get('/custom', exerciseController.getUserExercises);

// Get specific exercise
router.get('/:id', exerciseController.getExercise);

// Update exercise
router.put('/:id', validateExercise, exerciseController.update); // Changed from updateExercise

// Delete exercise
router.delete('/:id', exerciseController.remove);              // Changed from deleteExercise

// Clone exercise
router.post('/:id/clone', exerciseController.clone);          // Changed from cloneExercise

module.exports = router;