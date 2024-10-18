const express = require('express');
const router = express.Router();

const controller = require('../controllers/UserAccountController');



// Create new account
router.post("/", controller.post);


// Login account
router.get("/", controller.get);
router.refreshToken("/refreshToken", controller.refreshToken);
module.exports = router;