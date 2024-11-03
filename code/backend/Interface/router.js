// router.js
const express = require('express');
const router = express.Router();

// Welcome route for API documentation
router.get('/', (req, res) => {
    res.status(200).json({
        msg: "Welcome to API",
        endpoints: {
            account: '/account',
            exercise: '/exercise',
            plan: '/plan',
            workoutLog: '/workoutLog'
        }
    });
});

// Import routes
const userAccountRoutes = require('./router/user_account');
const workoutPlanRoutes = require('./router/workoutPlan');
const exerciseRoutes = require('./router/exercise');
const workoutLogRoutes = require('./router/workoutLog');

// Mount routes
router.use('/account', userAccountRoutes);
router.use('/plan', workoutPlanRoutes);
router.use('/exercise', exerciseRoutes);
router.use('/workoutLog', workoutLogRoutes);

// Handle 404 for API routes
router.use((req, res) => {
    res.status(404).json({
        err: "Route not found"
    });
});

module.exports = router;