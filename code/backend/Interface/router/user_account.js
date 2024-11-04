const express = require('express');
const router = express.Router();
const UserAccountController = require('../controllers/UserAccountController')
const auth = require('../utils/auth')


// Create new account
router.post("/",UserAccountController.create);
// Login account
router.get("/",UserAccountController.login)
//Update password
router.put("/",auth,UserAccountController.updatePassword)

module.exports=router;