// router/exercise.js
const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/ExerciseController');
const auth = require('../utils/auth');

// Get all type or equipment
router.get('/typelist', exerciseController.getTypeList);  
router.get('/equipmentlist', exerciseController.getEquipmentList);

// Get all exercises
router.get('/', exerciseController.getAll);                   
// Get exercises by type
router.get('/type', exerciseController.getByType);     
// Get exercises by equipment
router.get('/equipment', exerciseController.getByEquipment);  
// Get exercises by id
router.get('/id', exerciseController.getById);

//require auth
router.post('/', auth, exerciseController.create);
router.delete('/', auth, exerciseController.remove); 

module.exports = router;