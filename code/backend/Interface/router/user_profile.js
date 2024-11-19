const express = require('express');
const router = express.Router();
const UserProfileController = require('../controllers/UserProfileControllers')
const upload = require('../utils/upload');
const auth = require('../utils/auth')

// update user profile
router.post("/",auth,UserProfileController.updateProfile);

// get user profile
router.get("/",auth,UserProfileController.getProfile);

// update user Avatar
router.post("/avatar",auth,upload.uploadSingle('avatar'), UserProfileController.updateAvatar);

// get user Avatar
router.get("/avatar",auth,UserProfileController.getAvatar);


module.exports=router;