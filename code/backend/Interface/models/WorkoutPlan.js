// models/WorkoutPlan.js
const SQL = require('../utils/SQL')

create = (planData) => {
    const sql = `INSERT INTO workout_plan 
        (user_id, exercise_id, title, description, frequency_type, days_of_month, 
        days_of_week, custom_day, time_of_day, priority, status, reminder_enabled) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        planData.user_id,
        planData.exercise_id,
        planData.title, 
        planData.description,
        planData.frequency_type,
        planData.days_of_month,
        planData.days_of_week,
        planData.custom_day,
        planData.time_of_day,
        planData.priority,
        planData.status,
        planData.reminder_enabled
    ];

    return SQL.runsql(sql, values)
            .then((result)=>{
                if(result.rows.affectedRows == 0){
                    return {"err":"Plan upload fail"};
                }
                return {"massage":"Plan upload successfully"};
            },(err) => {
                console.log(err);
                if(err.errno == 1452){
                    return {"err":"No such execise id"};
                }
                return {"err":"some error happen"};
            });
};


findPlansByUserId = (userId) => {
    const sql = `
        SELECT 
            plan_id, 
            exercise_id, 
            title, 
            description, 
            frequency_type, 
            days_of_month, 
            days_of_week, 
            custom_day, 
            time_of_day, 
            priority, 
            status, 
            reminder_enabled 
        FROM workout_plan
        WHERE user_id = ?`;
    
    return SQL.runsql(sql, [userId])
        .then(
            (result) => result,
            (err) => {
                console.log(err);
                return {"err":"some error happen"};
              }
        );
};

update = (userId, updateData) => {
    const sql = `UPDATE workout_plan SET 
        exercise_id = ?,
        title = ?,
        description = ?,
        frequency_type = ?,
        days_of_month = ?,
        days_of_week = ?,
        custom_day = ?,
        time_of_day = ?,
        priority = ?,
        status = ?,
        reminder_enabled = ?
        WHERE plan_id = ? AND user_id = ?`;

    const values = [
        updateData.exercise_id,
        updateData.title,
        updateData.description,
        updateData.frequency_type,
        updateData.days_of_month,
        updateData.days_of_week,
        updateData.custom_day,
        updateData.time_of_day,
        updateData.priority,
        updateData.status,
        updateData.reminder_enabled,
        updateData.plan_id,
        userId
    ];

    return SQL.runsql(sql, values)
            .then((result)=>{
                if(result.rows.affectedRows == 0){
                    return {"err":"Plan updated fail"};
                }
                return {"massage":"Plan updated successfully"};
            },(err) => {
                console.log(err);
                if(err.errno == 1452){
                    return {"err":"No such execise id"};
                }
                return {"err":"some error happen"};
            });
};


remove = (planId, userId) => {
    const sql = 'DELETE FROM workout_plan WHERE plan_id = ? AND user_id = ?';
    const values = [planId, userId]
    return SQL.runsql(sql, values)
        .then((result)=>{
        if(result.rows.affectedRows == 0){
            return {"err":"Plan delete fail"};
        }
        return {"massage":"Plan delete successfully"};
        },(err) => {
        console.log(err);
        return {"err":"some error happen"};
        });
};


module.exports = {
    create,
    findPlansByUserId,
    update,
    delete: remove
};