// controllers/workoutPlan.controller.js
const WorkoutPlan = require('../models/workoutPlan.model');

class WorkoutPlanController {
    async createPlan(req, res) {
        try {
            // Validate required fields
            const requiredFields = ['exercise_id', 'name', 'start_date', 'frequency_type', 'frequency_value'];
            for (const field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(400).json({
                        success: false,
                        message: `Missing required field: ${field}`
                    });
                }
            }

            const planData = {
                ...req.body,
                user_id: req.user.id
            };

            const result = await WorkoutPlan.create(planData);
            res.status(201).json({
                success: true,
                message: 'Workout plan created successfully',
                data: result.rows
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating workout plan',
                error: error.message
            });
        }
    }

    async getPlan(req, res) {
        try {
            const plan = await WorkoutPlan.findById(req.params.id);
            
            if (!plan) {
                return res.status(404).json({
                    success: false,
                    message: 'Workout plan not found'
                });
            }

            if (plan.user_id !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }

            res.json({
                success: true,
                data: plan
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving workout plan',
                error: error.message
            });
        }
    }

    async getUserPlans(req, res) {
        try {
            const plans = await WorkoutPlan.findByUserId(req.user.id);
            res.json({
                success: true,
                data: plans
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving workout plans',
                error: error.message
            });
        }
    }

    async getActivePlans(req, res) {
        try {
            const date = req.query.date || new Date().toISOString().split('T')[0];
            const plans = await WorkoutPlan.findActiveByDate(req.user.id, date);
            res.json({
                success: true,
                data: plans
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving active plans',
                error: error.message
            });
        }
    }

    async updatePlan(req, res) {
        try {
            const plan = await WorkoutPlan.findById(req.params.id);
            
            if (!plan || plan.user_id !== req.user.id) {
                return res.status(404).json({
                    success: false,
                    message: 'Workout plan not found'
                });
            }

            const result = await WorkoutPlan.update(req.params.id, req.body);
            res.json({
                success: true,
                message: 'Workout plan updated successfully',
                data: result.rows
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating workout plan',
                error: error.message
            });
        }
    }

    async updatePlanStatus(req, res) {
        try {
            if (!req.body.status) {
                return res.status(400).json({
                    success: false,
                    message: 'Status is required'
                });
            }

            const plan = await WorkoutPlan.findById(req.params.id);
            if (!plan || plan.user_id !== req.user.id) {
                return res.status(404).json({
                    success: false,
                    message: 'Workout plan not found'
                });
            }

            await WorkoutPlan.updateStatus(req.params.id, req.body.status);
            res.json({
                success: true,
                message: 'Workout plan status updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating workout plan status',
                error: error.message
            });
        }
    }

    async deletePlan(req, res) {
        try {
            const plan = await WorkoutPlan.findById(req.params.id);
            if (!plan || plan.user_id !== req.user.id) {
                return res.status(404).json({
                    success: false,
                    message: 'Workout plan not found'
                });
            }

            await WorkoutPlan.delete(req.params.id);
            res.json({
                success: true,
                message: 'Workout plan deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting workout plan',
                error: error.message
            });
        }
    }

    async getPlansByFrequency(req, res) {
        try {
            const { frequency_type } = req.params;
            if (!['daily', 'weekly', 'monthly', 'custom'].includes(frequency_type)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid frequency type'
                });
            }

            const plans = await WorkoutPlan.findByFrequency(req.user.id, frequency_type);
            res.json({
                success: true,
                data: plans
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving plans by frequency',
                error: error.message
            });
        }
    }
}

module.exports = new WorkoutPlanController();