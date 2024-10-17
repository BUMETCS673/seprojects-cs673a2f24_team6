const express = require('express');
const router = express.Router();

const userAccountRoutes = require('./router/user_account');
const userRecordRouts = require('./router/user_record');
router.use('/account', userAccountRoutes);
router.use('/record', userRecordRouts);

module.exports = router;