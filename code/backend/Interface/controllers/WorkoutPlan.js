const SQL = require('../utils/SQL');

// Create a new workout plan
async function createWorkoutPlan(req, res) {
    const user_id = checkToken(req.body.token);
    const {
        plan_name,
        exercise_id,
        planned_reps,
        planned_sets,
        planned_weight,
        planned_duration,
        additional_info
    } = req.body;

    const sql = `
      INSERT INTO workout_plan (user_id, plan_name, exercise_id, planned_reps, planned_sets, planned_weight, planned_duration, additional_info)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const value = [
        user_id, plan_name, exercise_id, planned_reps, planned_sets, planned_weight || null, planned_duration || null, additional_info || null
    ];

    try {
        const result = await SQL.runsql(sql, value);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json(err);
    }
}

// Delete a workout plan
async function deleteWorkoutPlan(req, res) {
    const user_id = checkToken(req.query.token);
    const sql = `DELETE FROM workout_plan WHERE user_id = ? AND plan_id = ?`;
    const value = [user_id, req.query.plan_id];

    try {
        const result = await SQL.runsql(sql, value);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json(err);
    }
}

// Update a workout plan
async function updateWorkoutPlan(req, res) {
    const user_id = checkToken(req.body.token);
    const {
        plan_id,
        plan_name,
        exercise_id,
        planned_reps,
        planned_sets,
        planned_weight,
        planned_duration,
        additional_info
    } = req.body;

    const sql = `
      UPDATE workout_plan
      SET plan_name = ?, exercise_id = ?, planned_reps = ?, planned_sets = ?, planned_weight = ?, planned_duration = ?, additional_info = ?
      WHERE user_id = ? AND plan_id = ?
    `;
    const value = [
        plan_name, exercise_id, planned_reps, planned_sets, planned_weight, planned_duration, additional_info, user_id, plan_id
    ];

    try {
        const result = await SQL.runsql(sql, value);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json(err);
    }
}

// Get all workout plans for a user
async function getWorkoutPlans(req, res) {
    const user_id = checkToken(req.query.token);
    const sql = `SELECT * FROM workout_plan WHERE user_id = ?`;
    const value = [user_id];

    try {
        const result = await SQL.runsql(sql, value);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json(err);
    }
}

module.exports = {
    createWorkoutPlan,
    deleteWorkoutPlan,
    updateWorkoutPlan,
    getWorkoutPlans
};
