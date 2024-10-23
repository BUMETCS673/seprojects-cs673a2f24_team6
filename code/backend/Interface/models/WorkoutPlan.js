const express = require('express');
const router = express.Router();
const authController = require('./AuthController');
const SQL = require('./SQL');

// Create new workout plan
router.post("/", (req, res) => {
    if (!req.body.token) {
        return res.status(400).json({ err: "missing token" });
    }

    const user_id = checkToken(req.body.token); // Validate token and get user ID

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

    SQL.runsql(sql, value).then((result) => {
        res.status(200).json(result);
    }, (err) => {
        res.status(400).json(err);
    });
});

// Delete workout plan
router.delete("/", (req, res) => {
    if (!req.query.token) {
        return res.status(400).json({ err: "missing token" });
    }

    const user_id = checkToken(req.query.token);
    const sql = `DELETE FROM workout_plan WHERE user_id = ? AND plan_id = ?`;
    const value = [user_id, req.query.plan_id];

    SQL.runsql(sql, value).then((result) => {
        res.status(200).json(result);
    }, (err) => {
        res.status(400).json(err);
    });
});

// Modify existing workout plan
router.put("/", (req, res) => {
    if (!req.body.token) {
        return res.status(400).json({ err: "missing token" });
    }

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

    SQL.runsql(sql, value).then((result) => {
        res.status(200).json(result);
    }, (err) => {
        res.status(400).json(err);
    });
});

// Get all workout plans for a user
router.get("/", (req, res) => {
    if (!req.query.token) {
        return res.status(400).json({ err: "missing token" });
    }

    const user_id = checkToken(req.query.token);
    const sql = `SELECT * FROM workout_plan WHERE user_id = ?`;
    const value = [user_id];

    SQL.runsql(sql, value).then((result) => {
        res.status(200).json(result);
    }, (err) => {
        res.status(400).json(err);
    });
});

module.exports = router;
