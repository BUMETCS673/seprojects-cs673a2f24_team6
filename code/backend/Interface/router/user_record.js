const express = require('express');
const router = express.Router();
const UserRecordController = require('../controllers/UserRecordController');
const authMiddleware = require('../utils/authMiddleware');  // JWT middleware to validate tokens

// Create a new record
router.post('/', authMiddleware, UserRecordController.createRecord);

// Delete a record
router.delete('/', authMiddleware, UserRecordController.deleteRecord);

// Update a record
router.put('/', authMiddleware, UserRecordController.updateRecord);

// Search records for a user
router.get('/', authMiddleware, UserRecordController.searchRecords);

module.exports = router;
