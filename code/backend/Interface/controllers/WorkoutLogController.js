// controllers/workoutLog.controller.js
const WorkoutLog = require('../models/workoutLog.model');

class WorkoutLogController {
    async createWorkout(req, res) {
        try {
            const result = await WorkoutLog.create(req.body);
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

    async getWorkout(req, res) {
        try {
            const workout = await WorkoutLog.findById(req.params.id);
            if (!workout) {
                return res.status(404).json({
                    success: false,
                    message: 'Workout log not found'
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

    async getUserWorkouts(req, res) {
        try {
            const workouts = await WorkoutLog.findByUserId(req.params.userId);
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

    async updateWorkout(req, res) {
        try {
            const result = await WorkoutLog.update(req.params.id, req.body);
            if (result.rows.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Workout log not found'
                });
            }
            res.json({
                success: true,
                message: 'Workout log updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating workout log',
                error: error.message
            });
        }
    }

    async updateWorkoutStatus(req, res) {
        try {
            const result = await WorkoutLog.updateStatus(req.params.id, req.body.status);
            if (result.rows.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Workout log not found'
                });
            }
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

    async deleteWorkout(req, res) {
        try {
            const result = await WorkoutLog.delete(req.params.id);
            if (result.rows.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Workout log not found'
                });
            }
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

    async getWorkoutsByStatus(req, res) {
        try {
            const workouts = await WorkoutLog.findByStatus(req.params.userId, req.params.status);
            res.json({
                success: true,
                data: workouts
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving workouts by status',
                error: error.message
            });
        }
    }

    async getTotalWorkoutTime(req, res) {
        try {
            const totalTime = await WorkoutLog.calculateTotalTime(req.params.userId);
            res.json({
                success: true,
                data: { totalTime }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error calculating total workout time',
                error: error.message
            });
        }
    }
}

module.exports = new WorkoutLogController();