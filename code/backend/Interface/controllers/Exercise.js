const Exercise = require('../models/Exercise');

async function createExercise(req, res) {
    const { name, type, duration, userId } = req.body;

    if (!name || !type || !userId) {
        return res.status(400).json({ error: "Name, type, and userId are required." });
    }

    try {
        const exercise = await Exercise.create({ name, type, duration, userId });
        res.status(201).json({ message: "Exercise created successfully.", exercise });
    } catch (error) {
        console.error("Error creating exercise:", error);
        res.status(500).json({ error: "Server error." });
    }
}

async function getAllExercises(req, res) {
    const { userId } = req.params;

    try {
        const exercises = await Exercise.findAll(userId);
        res.status(200).json(exercises);
    } catch (error) {
        console.error("Error retrieving exercises:", error);
        res.status(500).json({ error: "Server error." });
    }
}

async function getExerciseById(req, res) {
    const { id } = req.params;

    try {
        const exercise = await Exercise.findById(id);
        if (!exercise) {
            return res.status(404).json({ error: "Exercise not found." });
        }
        res.status(200).json(exercise);
    } catch (error) {
        console.error("Error retrieving exercise:", error);
        res.status(500).json({ error: "Server error." });
    }
}

async function deleteExercise(req, res) {
    const { id } = req.params;

    try {
        await Exercise.delete(id);
        res.status(200).json({ message: "Exercise deleted successfully." });
    } catch (error) {
        console.error("Error deleting exercise:", error);
        res.status(500).json({ error: "Server error." });
    }
}
// Exercise Controller
module.exports = {
    createExercise,
    getAllExercises,
    getExerciseById,
    deleteExercise
};
