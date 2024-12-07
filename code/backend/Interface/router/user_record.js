const express = require('express');
const router = express.Router();
const UserRecordController = require('../controllers/UserRecordControllers');
const auth = require('../utils/auth')

// Create new record
router.post("/",auth,UserRecordController.createRecord);

// Delete record
router.delete("/",auth,UserRecordController.deleteRecord);

// Modify record
router.put("/",auth,UserRecordController.updateRecord);

// Search record
router.get("/",auth,UserRecordController.searchRecord);

module.exports=router;