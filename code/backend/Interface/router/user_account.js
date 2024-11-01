// routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserAccountController');
const auth = require('../utils/auth');
const upload = require('../utils/upload');

// Public routes
router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/refresh-token', userController.refreshToken);

// Protected routes
router.get('/me', auth, userController.getBasicInfo);
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.patch('/profile/avatar', auth, upload.single('avatar'), userController.updateAvatar);

module.exports = router;