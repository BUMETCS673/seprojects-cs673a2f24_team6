// controllers/exercise.controller.js
const Exercise = require('../models/Exercise');

class ExerciseController {
    // Create new exercise
    async createExercise(req, res) {
        try {
            // Validate required fields
            const requiredFields = ['name', 'type'];
            for (const field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(400).json({
                        success: false,
                        message: `Missing required field: ${field}`
                    });
                }
            }

            // Add user_id for custom exercises, null for system exercises
            const exerciseData = {
                ...req.body,
                user_id: req.body.is_system ? null : req.user.id
            };

            const result = await Exercise.create(exerciseData);
            res.status(201).json({
                success: true,
                message: 'Exercise created successfully',
                data: result.rows
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating exercise',
                error: error.message
            });
        }
    }

    // Get a specific exercise
    async getExercise(req, res) {
        try {
            const exercise = await Exercise.findById(req.params.id);
            if (!exercise) {
                return res.status(404).json({
                    success: false,
                    message: 'Exercise not found'
                });
            }

            // If it's a user-created exercise, check ownership
            if (exercise.user_id && exercise.user_id !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            res.json({
                success: true,
                data: exercise
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving exercise',
                error: error.message
            });
        }
    }

    // Get all exercises (including system exercises and user's custom exercises)
    async getAllExercises(req, res) {
        try {
            const exercises = await Exercise.findAll(req.user.id);
            res.json({
                success: true,
                data: exercises
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving exercises',
                error: error.message
            });
        }
    }

    // Get exercises by type
    async getExercisesByType(req, res) {
        try {
            const exercises = await Exercise.findByType(req.params.type, req.user.id);
            res.json({
                success: true,
                data: exercises
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving exercises by type',
                error: error.message
            });
        }
    }

    // Get user's custom exercises
    async getUserExercises(req, res) {
        try {
            const exercises = await Exercise.findByUserId(req.user.id);
            res.json({
                success: true,
                data: exercises
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving user exercises',
                error: error.message
            });
        }
    }

    // Update exercise
    async updateExercise(req, res) {
        try {
            const exercise = await Exercise.findById(req.params.id);

            if (!exercise) {
                return res.status(404).json({
                    success: false,
                    message: 'Exercise not found'
                });
            }

            // Only allow updating user's own exercises
            if (exercise.user_id !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'Cannot modify system or other users\' exercises'
                });
            }

            const result = await Exercise.update(req.params.id, req.body);
            res.json({
                success: true,
                message: 'Exercise updated successfully',
                data: result.rows
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating exercise',
                error: error.message
            });
        }
    }

    // Delete exercise
    async deleteExercise(req, res) {
        try {
            const exercise = await Exercise.findById(req.params.id);

            if (!exercise) {
                return res.status(404).json({
                    success: false,
                    message: 'Exercise not found'
                });
            }

            // Only allow deleting user's own exercises
            if (exercise.user_id !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'Cannot delete system or other users\' exercises'
                });
            }

            await Exercise.delete(req.params.id);
            res.json({
                success: true,
                message: 'Exercise deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting exercise',
                error: error.message
            });
        }
    }

    // Search exercises
    async searchExercises(req, res) {
        try {
            const { query, type, equipment } = req.query;
            const exercises = await Exercise.search(query, type, equipment, req.user.id);
            res.json({
                success: true,
                data: exercises
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error searching exercises',
                error: error.message
            });
        }
    }

    // Clone system exercise to user's custom exercises
    async cloneExercise(req, res) {
        try {
            const exercise = await Exercise.findById(req.params.id);

            if (!exercise) {
                return res.status(404).json({
                    success: false,
                    message: 'Exercise not found'
                });
            }

            // Create a new exercise based on the existing one
            const clonedExercise = {
                name: `${exercise.name} (Custom)`,
                description: exercise.description,
                equipment: exercise.equipment,
                type: exercise.type,
                sets: exercise.sets,
                reps: exercise.reps,
                duration: exercise.duration,
                user_id: req.user.id
            };

            const result = await Exercise.create(clonedExercise);
            res.status(201).json({
                success: true,
                message: 'Exercise cloned successfully',
                data: result.rows
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error cloning exercise',
                error: error.message
            });
        }
    }
}

module.exports = new ExerciseController();