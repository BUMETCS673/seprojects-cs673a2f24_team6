const WorkoutLog = require('../models/WorkoutLog');

// Define the functions first

// Function to create a workout log
async function createLog(req, res) {
    const { exerciseId, userId, date, reps, sets, weight, duration, distance } = req.body;

    if (!exerciseId || !userId || !date) {
        return res.status(400).json({ error: "Exercise ID, User ID, and Date are required." });
    }

    try {
        const log = await WorkoutLog.createLog({ exerciseId, userId, date, reps, sets, weight, duration, distance });
        res.status(201).json({ message: "Workout log created successfully.", log });
    } catch (error) {
        console.error("Error creating workout log:", error);
        res.status(500).json({ error: "Server error." });
    }
}

// Function to get all workout logs for a user
async function getAllLogs(req, res) {
    const { userId } = req.params;

    try {
        const logs = await WorkoutLog.findAllLogs(userId);
        res.status(200).json(logs);
    } catch (error) {
        console.error("Error retrieving workout logs:", error);
        res.status(500).json({ error: "Server error." });
    }
}

// Function to get a specific workout log by ID
async function getLogById(req, res) {
    const { id } = req.params;

    try {
        const log = await WorkoutLog.findLogById(id);
        if (!log) {
            return res.status(404).json({ error: "Workout log not found." });
        }
        res.status(200).json(log);
    } catch (error) {
        console.error("Error retrieving workout log:", error);
        res.status(500).json({ error: "Server error." });
    }
}

// Function to delete a workout log by ID
async function deleteLog(req, res) {
    const { id } = req.params;

    try {
        await WorkoutLog.deleteLog(id);
        res.status(200).json({ message: "Workout log deleted successfully." });
    } catch (error) {
        console.error("Error deleting workout log:", error);
        res.status(500).json({ error: "Server error." });
    }
}

// Export the functions
module.exports = {
    createLog,
    getAllLogs,
    getLogById,
    deleteLog
};
