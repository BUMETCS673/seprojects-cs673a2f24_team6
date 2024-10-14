const express = require('express');
const router = express.Router();

const basic = require('./router/basic_sample');
router.use('/basic',basic);

const database = require('./router/database_sample');
router.use('/database',database);

const file = require('./router/file_sample');
router.use('/file',file);

const user = require('./router/user_account');
router.use('/api',user);

module.exports=router;