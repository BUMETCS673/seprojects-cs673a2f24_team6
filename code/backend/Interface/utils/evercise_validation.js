const validateExercise = (req, res, next) => {
    const { name, type } = req.body;

    if (!name || !type) {
        return res.status(400).json({
            success: false,
            message: "Name and type are required"
        });
    }

    // Validate exercise type
    const validTypes = ['strength', 'cardio', 'flexibility', 'balance', 'sports'];
    if (!validTypes.includes(type.toLowerCase())) {
        return res.status(400).json({
            success: false,
            message: "Invalid exercise type",
            validTypes
        });
    }

    // Validate numbers if provided
    if (req.body.sets && (!Number.isInteger(req.body.sets) || req.body.sets < 0)) {
        console.log("Invalid sets value:", sets);
        return res.status(400).json({
            success: false,
            message: "Sets must be a positive integer"
        });
    }

    if (req.body.reps && (!Number.isInteger(req.body.reps) || req.body.reps < 0)) {
        console.log("Invalid reps value:", reps);
        return res.status(400).json({
            success: false,
            message: "Reps must be a positive integer"
        });
    }

    if (req.body.duration && (!Number.isInteger(req.body.duration) || req.body.duration < 0)) {
        console.log("Invalid duration value:", duration);
        return res.status(400).json({
            success: false,
            message: "Duration must be a positive integer"
        });
    }

    next();
};

module.exports = { validateExercise };