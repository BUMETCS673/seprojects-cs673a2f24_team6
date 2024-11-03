const express = require('express');
const router = express.Router();
const UserProfileController = require('../controllers/UserProfileControllers')

// update user profile
router.post("/",UserProfileController.updateProfile);

// get user profile
router.get("/",UserProfileController.getProfile);

// update user Avatar
router.post("/avatar",UserProfileController.updateAvatar);

// get user Avatar
router.get("/avatar",UserProfileController.getAvatar);


module.exports=router;