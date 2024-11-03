// controllers/WorkoutLogController.js
const WorkoutLog = require('../models/WorkoutLog')

createWorkout = (req, res) => {
    const workoutData = {
        ...req.body,
        user_id: req.user.id
    };

    WorkoutLog.create(workoutData)
        .then(
            (result) => {
                console.log("success create workout");
                res.status(200).json({
                    msg: "Workout created successfully",
                    data: result.rows
                });
            },
            (err) => {
                console.log("fail create workout");
                res.status(400).json({ err: err });
            }
        );
};

getWorkout = (req, res) => {
    WorkoutLog.findWorkoutById(req.params.id)
        .then(
            (workout) => {
                console.log("success get workout");
                if (!workout) {
                    return res.status(404).json({ err: "Workout not found" });
                }
                res.status(200).json(workout);
            },
            (err) => {
                console.log("fail get workout");
                res.status(400).json({ err: err });
            }
        );
};

getUserWorkouts = (req, res) => {
    WorkoutLog.findWorkoutsByUserId(req.params.userId)
        .then(
            (workouts) => {
                console.log("success get user workouts");
                res.status(200).json(workouts);
            },
            (err) => {
                console.log("fail get user workouts");
                res.status(400).json({ err: err });
            }
        );
};

updateWorkout = (req, res) => {
    WorkoutLog.update(req.params.id, req.body)
        .then(
            (result) => {
                console.log("success update workout");
                if (result.rows.affectedRows === 0) {
                    return res.status(404).json({ err: "Workout not found" });
                }
                res.status(200).json({ msg: "Workout updated successfully" });
            },
            (err) => {
                console.log("fail update workout");
                res.status(400).json({ err: err });
            }
        );
};

updateWorkoutStatus = (req, res) => {
    if (!req.body.status) {
        return res.status(400).json({ err: "Status is required" });
    }

    WorkoutLog.updateStatus(req.params.id, req.body.status)
        .then(
            (result) => {
                console.log("success update workout status");
                if (result.rows.affectedRows === 0) {
                    return res.status(404).json({ err: "Workout not found" });
                }
                res.status(200).json({ msg: "Status updated successfully" });
            },
            (err) => {
                console.log("fail update workout status");
                res.status(400).json({ err: err });
            }
        );
};

deleteWorkout = (req, res) => {
    WorkoutLog.delete(req.params.id)
        .then(
            (result) => {
                console.log("success delete workout");
                if (result.rows.affectedRows === 0) {
                    return res.status(404).json({ err: "Workout not found" });
                }
                res.status(200).json({ msg: "Workout deleted successfully" });
            },
            (err) => {
                console.log("fail delete workout");
                res.status(400).json({ err: err });
            }
        );
};

getWorkoutsByStatus = (req, res) => {
    WorkoutLog.findWorkoutsByStatus(req.params.userId, req.params.status)
        .then(
            (workouts) => {
                console.log("success get workouts by status");
                res.status(200).json(workouts);
            },
            (err) => {
                console.log("fail get workouts by status");
                res.status(400).json({ err: err });
            }
        );
};

module.exports = {
    createWorkout,
    getWorkout,
    getUserWorkouts,
    updateWorkout,
    updateWorkoutStatus,
    deleteWorkout,
    getWorkoutsByStatus
};