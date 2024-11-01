const { runsql } = require('../utils/SQL');

class WorkoutLog {
    static async create(workoutData) {
        const sql = `INSERT INTO workout_log 
            (user_id, exercise_id, log_date, description, number_of_set, status, priority, start_time, end_time, total_time) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [
            workoutData.user_id,
            workoutData.exercise_id,
            workoutData.log_date,
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
            ORDER BY w.log_date DESC, w.priority DESC, w.start_time DESC`;
        const result = await runsql(sql, [userId]);
        return result.rows;
    }

    static async findByDateRange(userId, startDate, endDate) {
        const sql = `
            SELECT w.*, e.name as exercise_name, e.type as exercise_type
            FROM workout_log w
            JOIN exercises e ON w.exercise_id = e.exercise_id
            WHERE w.user_id = ? 
            AND w.log_date BETWEEN ? AND ?
            ORDER BY w.log_date DESC, w.priority DESC`;
        const result = await runsql(sql, [userId, startDate, endDate]);
        return result.rows;
    }

    static async update(recordId, updateData) {
        const sql = `UPDATE workout_log SET 
            exercise_id = ?,
            log_date = ?,
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
            updateData.log_date,
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
            ORDER BY w.log_date DESC, w.priority DESC`;
        const result = await runsql(sql, [userId, status]);
        return result.rows;
    }

    static async calculateTotalTime(userId) {
        const sql = 'SELECT SUM(total_time) as total_time FROM workout_log WHERE user_id = ? AND status = "Done"';
        const result = await runsql(sql, [userId]);
        return result.rows[0].total_time || 0;
    }

    static async getWorkoutsByDay(userId, date) {
        const sql = `
            SELECT w.*, e.name as exercise_name, e.type as exercise_type
            FROM workout_log w
            JOIN exercises e ON w.exercise_id = e.exercise_id
            WHERE w.user_id = ? AND w.log_date = ?
            ORDER BY w.priority DESC, w.start_time ASC`;
        const result = await runsql(sql, [userId, date]);
        return result.rows;
    }

    static async getDailyStats(userId, date) {
        const sql = `
            SELECT 
                COUNT(*) as total_workouts,
                SUM(total_time) as total_time,
                COUNT(CASE WHEN status = 'Done' THEN 1 END) as completed_workouts
            FROM workout_log
            WHERE user_id = ? AND log_date = ?`;
        const result = await runsql(sql, [userId, date]);
        return result.rows[0];
    }
}

module.exports = WorkoutLog;