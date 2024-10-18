const express = require('express');
const router = express.Router();

const user = require('./router/user_account');
router.use('/account',user);

const record = require('./router/user_record');
router.use('/record',record);

module.exports=router;