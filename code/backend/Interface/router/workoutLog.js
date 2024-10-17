const express = require('express');
const router = express.Router();
const WorkoutLog = require('../models/WorkoutLog');

// Record a new workout log
router.post("/workout-log", async (req, res) => {
  const { user, exercises, workoutDate, duration } = req.body;

  if (!user || !exercises || exercises.length === 0) {
    return res.status(400).json({ err: "Missing required fields" });
  }

  try {
    const newWorkoutLog = new WorkoutLog({ user, exercises, workoutDate, duration });
    await newWorkoutLog.save();
    res.status(201).json(newWorkoutLog);
  } catch (err) {
    res.status(500).json({ err: "Failed to record workout log" });
  }
});

// Get workout logs for a user
router.get("/workout-logs/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const logs = await WorkoutLog.find({ user: userId }).populate('exercises.exercise');
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ err: "Failed to fetch workout logs" });
  }
});

module.exports = router;
