// models/workoutPlan.model.js
const { runsql } = require('../utils/SQL');

class WorkoutPlan {
    static async create(planData) {
        const sql = `INSERT INTO workout_plan 
            (user_id, exercise_id, name, description, start_date, end_date, 
            target_sets, target_reps, target_duration, frequency_type, 
            frequency_value, days_of_week, preferred_time, priority, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        const values = [
            planData.user_id,
            planData.exercise_id,
            planData.name,
            planData.description,
            planData.start_date,
            planData.end_date,
            planData.target_sets,
            planData.target_reps,
            planData.target_duration,
            planData.frequency_type,
            planData.frequency_value,
            planData.days_of_week,
            planData.preferred_time,
            planData.priority,
            planData.status || 'active'
        ];
        
        return await runsql(sql, values);
    }

    static async findById(planId) {
        const sql = `
            SELECT p.*, e.name as exercise_name, e.type as exercise_type
            FROM workout_plan p
            JOIN exercises e ON p.exercise_id = e.exercise_id
            WHERE p.plan_id = ?`;
        const result = await runsql(sql, [planId]);
        return result.rows[0];
    }

    static async findByUserId(userId) {
        const sql = `
            SELECT p.*, e.name as exercise_name, e.type as exercise_type
            FROM workout_plan p
            JOIN exercises e ON p.exercise_id = e.exercise_id
            WHERE p.user_id = ?
            ORDER BY p.status = 'active' DESC, p.priority DESC, p.start_date ASC`;
        const result = await runsql(sql, [userId]);
        return result.rows;
    }

    static async update(planId, updateData) {
        const sql = `UPDATE workout_plan SET 
            exercise_id = ?,
            name = ?,
            description = ?,
            start_date = ?,
            end_date = ?,
            target_sets = ?,
            target_reps = ?,
            target_duration = ?,
            frequency_type = ?,
            frequency_value = ?,
            days_of_week = ?,
            preferred_time = ?,
            priority = ?,
            status = ?,
            reminder_enabled = ?
            WHERE plan_id = ?`;

        const values = [
            updateData.exercise_id,
            updateData.name,
            updateData.description,
            updateData.start_date,
            updateData.end_date,
            updateData.target_sets,
            updateData.target_reps,
            updateData.target_duration,
            updateData.frequency_type,
            updateData.frequency_value,
            updateData.days_of_week,
            updateData.preferred_time,
            updateData.priority,
            updateData.status,
            updateData.reminder_enabled,
            planId
        ];

        return await runsql(sql, values);
    }

    static async updateStatus(planId, status) {
        const sql = 'UPDATE workout_plan SET status = ? WHERE plan_id = ?';
        return await runsql(sql, [status, planId]);
    }

    static async delete(planId) {
        const sql = 'DELETE FROM workout_plan WHERE plan_id = ?';
        return await runsql(sql, [planId]);
    }

    static async findActiveByDate(userId, date) {
        const sql = `
            SELECT p.*, e.name as exercise_name, e.type as exercise_type
            FROM workout_plan p
            JOIN exercises e ON p.exercise_id = e.exercise_id
            WHERE p.user_id = ?
            AND p.status = 'active'
            AND p.start_date <= ?
            AND (p.end_date IS NULL OR p.end_date >= ?)
            ORDER BY p.priority DESC`;
        const result = await runsql(sql, [userId, date, date]);
        return result.rows;
    }

    static async findByFrequency(userId, frequencyType) {
        const sql = `
            SELECT p.*, e.name as exercise_name, e.type as exercise_type
            FROM workout_plan p
            JOIN exercises e ON p.exercise_id = e.exercise_id
            WHERE p.user_id = ? AND p.frequency_type = ? AND p.status = 'active'
            ORDER BY p.priority DESC`;
        const result = await runsql(sql, [userId, frequencyType]);
        return result.rows;
    }
}

module.exports = WorkoutPlan;