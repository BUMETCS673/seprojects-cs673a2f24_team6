// router/user_account.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserAccountController');
const auth = require('../utils/auth');
const upload = require('../utils/upload');

// Public routes
router.post('/login', userController.login);
router.post('/register', userController.create);

// Protected routes
// router.use(auth);

// Profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

// Avatar upload route
router.post('/avatar', upload.uploadSingle('avatar'), userController.updateAvatar);

module.exports = router;