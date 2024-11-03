const express = require('express');
const router = express.Router();
const UserAccountController = require('../controllers/UserAccountController')

// Create new account
router.post("/",UserAccountController.create);


// Login account
router.get("/",UserAccountController.login)


module.exports=router;