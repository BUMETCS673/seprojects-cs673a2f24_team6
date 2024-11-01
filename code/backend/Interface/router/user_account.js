const express = require('express');
const router = express.Router();
const SQL = require('./SQLoperate')
const UserAccountController = require('../controllers/UserAccountController')

// Create new account
router.post("/",UserAccountController.create);


// Login account
router.post("/login",UserAccountController.login)


module.exports=router;