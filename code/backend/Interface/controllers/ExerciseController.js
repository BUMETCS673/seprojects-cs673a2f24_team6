// controllers/workoutLog.controller.js
const WorkoutLog = require('../models/workoutLog.model');

class WorkoutLogController {
    // Create new workout log
    async createWorkout(req, res) {
        try {
            // Validate required fields
            const requiredFields = ['exercise_id', 'log_date'];
            for (const field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(400).json({
                        success: false,
                        message: `Missing required field: ${field}`
                    });
                }
            }

            const workoutData = {
                ...req.body,
                user_id: req.user.id  // From auth middleware
            };

            const result = await WorkoutLog.create(workoutData);
            res.status(201).json({
                success: true,
                message: 'Workout log created successfully',
                data: result.rows
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating workout log',
                error: error.message
            });
        }
    }

    // Get a specific workout log
    async getWorkout(req, res) {
        try {
            const workout = await WorkoutLog.findById(req.params.id);
            if (!workout) {
                return res.status(404).json({
                    success: false,
                    message: 'Workout log not found'
                });
            }

            // Check if the workout belongs to the user
            if (workout.user_id !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            res.json({
                success: true,
                data: workout
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving workout log',
                error: error.message
            });
        }
    }

    // Get all workouts for a user
    async getUserWorkouts(req, res) {
        try {
            const workouts = await WorkoutLog.findByUserId(req.user.id);
            res.json({
                success: true,
                data: workouts
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving user workouts',
                error: error.message
            });
        }
    }

    // Get workouts by date range
    async getWorkoutsByDateRange(req, res) {
        try {
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                return res.status(400).json({
                    success: false,
                    message: 'Start date and end date are required'
                });
            }

            const workouts = await WorkoutLog.findByDateRange(
                req.user.id,
                startDate,
                endDate
            );
            res.json({
                success: true,
                data: workouts
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving workouts',
                error: error.message
            });
        }
    }

    // Get workouts for a specific day
    async getWorkoutsByDay(req, res) {
        try {
            const { date } = req.params;
            if (!date) {
                return res.status(400).json({
                    success: false,
                    message: 'Date parameter is required'
                });
            }

            const workouts = await WorkoutLog.getWorkoutsByDay(req.user.id, date);
            const stats = await WorkoutLog.getDailyStats(req.user.id, date);

            res.json({
                success: true,
                data: {
                    workouts,
                    stats
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving daily workouts',
                error: error.message
            });
        }
    }

    // Update workout log
    async updateWorkout(req, res) {
        try {
            const workout = await WorkoutLog.findById(req.params.id);
            if (!workout) {
                return res.status(404).json({
                    success: false,
                    message: 'Workout log not found'
                });
            }

            // Check if the workout belongs to the user
            if (workout.user_id !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            const result = await WorkoutLog.update(req.params.id, req.body);
            res.json({
                success: true,
                message: 'Workout log updated successfully',
                data: result.rows
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating workout log',
                error: error.message
            });
        }
    }

    // Update workout status
    async updateWorkoutStatus(req, res) {
        try {
            if (!req.body.status) {
                return res.status(400).json({
                    success: false,
                    message: 'Status is required'
                });
            }

            const workout = await WorkoutLog.findById(req.params.id);
            if (!workout || workout.user_id !== req.user.id) {
                return res.status(404).json({
                    success: false,
                    message: 'Workout log not found'
                });
            }

            await WorkoutLog.updateStatus(req.params.id, req.body.status);
            res.json({
                success: true,
                message: 'Workout status updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating workout status',
                error: error.message
            });
        }
    }

    // Delete workout log
    async deleteWorkout(req, res) {
        try {
            const workout = await WorkoutLog.findById(req.params.id);
            if (!workout || workout.user_id !== req.user.id) {
                return res.status(404).json({
                    success: false,
                    message: 'Workout log not found'
                });
            }

            await WorkoutLog.delete(req.params.id);
            res.json({
                success: true,
                message: 'Workout log deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting workout log',
                error: error.message
            });
        }
    }

    // Get workout statistics
    async getStats(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const totalTime = await WorkoutLog.calculateTotalTime(req.user.id);
            let dailyStats = null;

            if (startDate) {
                dailyStats = await WorkoutLog.getDailyStats(req.user.id, startDate);
            }

            res.json({
                success: true,
                data: {
                    totalTime,
                    dailyStats
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving workout statistics',
                error: error.message
            });
        }
    }
}

module.exports = new WorkoutLogController();