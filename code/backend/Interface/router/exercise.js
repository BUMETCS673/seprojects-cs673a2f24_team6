const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise');

// Create a new exercise
router.post("/exercise", async (req, res) => {
  const { name, category, equipment, description, muscleGroups } = req.body;

  if (!name || !category) {
    return res.status(400).json({ err: "Missing required fields" });
  }

  try {
    const newExercise = new Exercise({ name, category, equipment, description, muscleGroups });
    await newExercise.save();
    res.status(201).json(newExercise);
  } catch (err) {
    res.status(500).json({ err: "Failed to create exercise" });
  }
});

// Get all exercises
router.get("/exercises", async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.status(200).json(exercises);
  } catch (err) {
    res.status(500).json({ err: "Failed to fetch exercises" });
  }
});

module.exports = router;
