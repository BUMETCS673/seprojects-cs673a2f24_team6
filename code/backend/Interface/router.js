const express = require('express');
const router = express.Router();

const userAccountRoutes = require('./router/user_account');
const workoutPlanRoutes = require('./router/workoutPlan');
const exerciseRoutes = require('./router/exercise');
const exerciseLogRoutes = require('./router/workoutLog');
router.use('/account', userAccountRoutes);
router.use('/plan', workoutPlanRoutes);
router.use('/exercise', exerciseRoutes);
router.use('/workoutLog', exerciseLogRoutes);

module.exports = router;