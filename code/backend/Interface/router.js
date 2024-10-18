const express = require('express');
const router = express.Router();

const userAccountRoutes = require('./router/user_account');
const userRecordRoutes = require('./router/user_record');
const exerciseRoutes = require('./router/exercise');
const exerciseLogRoutes = require('./router/workoutLog');
router.use('/account', userAccountRoutes);
router.use('/record', userRecordRoutes);
router.use('/exercise', exerciseRoutes);
router.use('./workoutLog', exerciseLogRoutes);

module.exports = router;