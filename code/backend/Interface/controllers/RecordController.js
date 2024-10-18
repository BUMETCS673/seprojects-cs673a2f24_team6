const UserRecord = require('../models/UserRecord');

// Create a new record
async function createRecord(req, res) {
    const user_id = req.user.id;
    const {
        exercise_name, description, number_of_set, status, priority, start_time, end_time, total_time
    } = req.body;

    if (!exercise_name || !number_of_set || !start_time || !end_time) {
        return res.status(400).json({ error: "Required fields are missing." });
    }

    try {
        const result = await UserRecord.createRecord({
            user_id, exercise_name, description, number_of_set, status, priority, start_time, end_time, total_time
        });
        res.status(201).json({ message: "Record created successfully", recordId: result.insertId });
    } catch (error) {
        console.error("Error creating record:", error);
        res.status(500).json({ error: "Server error." });
    }
}

// Delete a record
async function deleteRecord(req, res) {
    const user_id = req.user.id;
    const { record_id } = req.query;

    if (!record_id) {
        return res.status(400).json({ error: "Missing record ID." });
    }

    try {
        await UserRecord.deleteRecord(user_id, record_id);
        res.status(200).json({ message: "Record deleted successfully." });
    } catch (error) {
        console.error("Error deleting record:", error);
        res.status(500).json({ error: "Server error." });
    }
}

// Update a record
async function updateRecord(req, res) {
    const user_id = req.user.id;
    const {
        record_id, exercise_name, description, number_of_set, status, priority, start_time, end_time, total_time
    } = req.body;

    if (!record_id || !exercise_name || !number_of_set || !start_time || !end_time) {
        return res.status(400).json({ error: "Required fields are missing." });
    }

    try {
        await UserRecord.updateRecord({
            record_id, exercise_name, description, number_of_set, status, priority, start_time, end_time, total_time, user_id
        });
        res.status(200).json({ message: "Record updated successfully." });
    } catch (error) {
        console.error("Error updating record:", error);
        res.status(500).json({ error: "Server error." });
    }
}

// Search records for a user
async function searchRecords(req, res) {
    const user_id = req.user.id;

    try {
        const records = await UserRecord.searchRecords(user_id);
        res.status(200).json(records);
    } catch (error) {
        console.error("Error searching records:", error);
        res.status(500).json({ error: "Server error." });
    }
}

// Export all functions
module.exports = {
    createRecord,
    deleteRecord,
    updateRecord,
    searchRecords
};
