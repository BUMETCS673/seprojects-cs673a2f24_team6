// models/WorkoutLog.js
const SQL = require('../utils/SQL')

create = (workoutData) => {
    const sql = `INSERT INTO workout_log 
        (user_id, exercise_id, log_date, description, number_of_set, 
        status, priority, start_time, end_time, total_time) 
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

    return SQL.runsql(sql, values);
};

findWorkoutById = (recordId) => {
    const sql = `
        SELECT w.*, e.name as exercise_name, e.type as exercise_type
        FROM workout_log w
        JOIN exercises e ON w.exercise_id = e.exercise_id
        WHERE w.record_id = ?`;
    
    return SQL.runsql(sql, [recordId])
        .then(
            (result) => result.rows[0],
            (err) => err
        );
};

findWorkoutsByUserId = (userId) => {
    const sql = `
        SELECT w.*, e.name as exercise_name, e.type as exercise_type
        FROM workout_log w
        JOIN exercises e ON w.exercise_id = e.exercise_id
        WHERE w.user_id = ? 
        ORDER BY w.log_date DESC, w.priority DESC, w.start_time DESC`;
    
    return SQL.runsql(sql, [userId])
        .then(
            (result) => result.rows,
            (err) => err
        );
};

update = (recordId, updateData) => {
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
    
    return SQL.runsql(sql, values);
};

updateStatus = (recordId, status) => {
    const sql = 'UPDATE workout_log SET status = ? WHERE record_id = ?';
    return SQL.runsql(sql, [status, recordId]);
};

remove = (recordId) => {
    const sql = 'DELETE FROM workout_log WHERE record_id = ?';
    return SQL.runsql(sql, [recordId]);
};

findWorkoutsByStatus = (userId, status) => {
    const sql = `
        SELECT w.*, e.name as exercise_name, e.type as exercise_type
        FROM workout_log w
        JOIN exercises e ON w.exercise_id = e.exercise_id
        WHERE w.user_id = ? AND w.status = ? 
        ORDER BY w.log_date DESC, w.priority DESC`;
        
    return SQL.runsql(sql, [userId, status])
        .then(
            (result) => result.rows,
            (err) => err
        );
};

calculateTotalTime = (userId) => {
    const sql = 'SELECT SUM(total_time) as total_time FROM workout_log WHERE user_id = ? AND status = "Done"';
    return SQL.runsql(sql, [userId])
        .then(
            (result) => result.rows[0].total_time || 0,
            (err) => err
        );
};

module.exports = {
    create,
    findWorkoutById,
    findWorkoutsByUserId,
    update,
    updateStatus,
    delete: remove,
    findWorkoutsByStatus,
    calculateTotalTime
};