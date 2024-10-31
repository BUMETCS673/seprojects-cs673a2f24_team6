// models/workoutLog.model.js
const { runsql } = require('../utils/SQL');

class WorkoutLog {
    static async create(workoutData) {
        const sql = `INSERT INTO workout_log 
            (user_id, exercise_id, description, number_of_set, status, priority, start_time, end_time, total_time) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [
            workoutData.user_id,
            workoutData.exercise_id,
            workoutData.description,
            workoutData.number_of_set,
            workoutData.status || 'Todo',
            workoutData.priority,
            workoutData.start_time,
            workoutData.end_time,
            workoutData.total_time
        ];
        return await runsql(sql, values);
    }

    static async findById(recordId) {
        const sql = `
            SELECT w.*, e.name as exercise_name, e.type as exercise_type
            FROM workout_log w
            JOIN exercises e ON w.exercise_id = e.exercise_id
            WHERE w.record_id = ?`;
        const result = await runsql(sql, [recordId]);
        return result.rows[0];
    }

    static async findByUserId(userId) {
        const sql = `
            SELECT w.*, e.name as exercise_name, e.type as exercise_type
            FROM workout_log w
            JOIN exercises e ON w.exercise_id = e.exercise_id
            WHERE w.user_id = ? 
            ORDER BY w.priority DESC, w.start_time DESC`;
        const result = await runsql(sql, [userId]);
        return result.rows;
    }

    static async update(recordId, updateData) {
        const sql = `UPDATE workout_log SET 
            exercise_id = ?,
            description = ?,
            number_of_set = ?,
            status = ?,
            priority = ?,
            start_time = ?,
            end_time = ?,
            total_time = ?
            WHERE record_id = ?`;
        const values = [
            updateData.exercise_id,
            updateData.description,
            updateData.number_of_set,
            updateData.status,
            updateData.priority,
            updateData.start_time,
            updateData.end_time,
            updateData.total_time,
            recordId
        ];
        return await runsql(sql, values);
    }

    static async updateStatus(recordId, status) {
        const sql = 'UPDATE workout_log SET status = ? WHERE record_id = ?';
        return await runsql(sql, [status, recordId]);
    }

    static async delete(recordId) {
        const sql = 'DELETE FROM workout_log WHERE record_id = ?';
        return await runsql(sql, [recordId]);
    }

    static async findByStatus(userId, status) {
        const sql = `
            SELECT w.*, e.name as exercise_name, e.type as exercise_type
            FROM workout_log w
            JOIN exercises e ON w.exercise_id = e.exercise_id
            WHERE w.user_id = ? AND w.status = ? 
            ORDER BY w.priority DESC`;
        const result = await runsql(sql, [userId, status]);
        return result.rows;
    }

    static async calculateTotalTime(userId) {
        const sql = 'SELECT SUM(total_time) as total_time FROM workout_log WHERE user_id = ? AND status = "Done"';
        const result = await runsql(sql, [userId]);
        return result.rows[0].total_time || 0;
    }
}

module.exports = WorkoutLog;