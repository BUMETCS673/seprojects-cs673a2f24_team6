const express = require('express');
const router = express.Router();

const user = require('./router/user_account');
router.use('/account',user);

const exercise = require('./router/exercise');
router.use('/exercise',exercise)

const record = require('./router/user_record');
router.use('/record',record);

const profile = require('./router/user_profile');
router.use('/profile',profile)

const plan = require('./router/workout_plan');
router.use('/plan',plan)

module.exports=router;