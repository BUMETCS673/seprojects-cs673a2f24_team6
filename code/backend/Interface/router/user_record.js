const express = require('express');
const router = express.Router();
const UserRecordController = require('../controllers/UserRecordControllers');

// Create new record
router.post("/",UserRecordController.createRecord);

// Delete record
router.delete("/",UserRecordController.deleteRecord);

// Modify record
router.put("/",UserRecordController.updateRecord);

// Search record
router.get("/",UserRecordController.searchRecord);

module.exports=router;