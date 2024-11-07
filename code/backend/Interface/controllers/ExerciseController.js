// controllers/ExerciseController.js
const Exercise = require('../models/Exercise')

create = (req, res) => {
    const { name, type } = req.body;
    
    if (!name || !type) {
        return res.status(400).json({ err: "Missing required fields" });
    }

    Exercise.create({
        ...req.body,
        user_id: req.body.is_system ? null : req.user.id
    })
    .then(
        (result) => {
            console.log("success create exercise");
            res.status(200).json({
                msg: "Exercise created successfully",
                data: result.rows
            });
        },
        (err) => {
            console.log("fail create exercise");
            res.status(400).json({ err: err });
        }
    );
};

getTypes = (req, res) => {
    Exercise.getTypes()
        .then(
            (types) => {
                console.log("success get types");
                res.status(200).json(types);
            },
            (err) => {
                console.log("fail get types");
                res.status(400).json({ err: err });
            }
        );
};

getEquipmentList = (req, res) => {
    Exercise.getEquipmentList()
        .then(
            (equipment) => {
                console.log("success get equipment");
                res.status(200).json(equipment);
            },
            (err) => {
                console.log("fail get equipment");
                res.status(400).json({ err: err });
            }
        );
};

getExercise = (req, res) => {
    Exercise.findById(req.params.id)
        .then(
            (exercise) => {
                console.log("success get exercise");
                if (!exercise) {
                    return res.status(404).json({ err: "Exercise not found" });
                }
                res.status(200).json(exercise);
            },
            (err) => {
                console.log("fail get exercise");
                res.status(400).json({ err: err });
            }
        );
};

getAll = (req, res) => {
    Exercise.findAll(req.user.id)
        .then(
            (exercises) => {
                console.log("success get all exercises");
                res.status(200).json(exercises);
            },
            (err) => {
                console.log("fail get all exercises");
                res.status(400).json({ err: err });
            }
        );
};

search = (req, res) => {
    Exercise.search(req.query.q, req.query.type, req.query.equipment, req.user.id)
        .then(
            (exercises) => {
                console.log("success search exercises");
                res.status(200).json(exercises);
            },
            (err) => {
                console.log("fail search exercises");
                res.status(400).json({ err: err });
            }
        );
};

getByType = (req, res) => {
    Exercise.findByType(req.params.type, req.user.id)
        .then(
            (exercises) => {
                console.log("success get exercises by type");
                res.status(200).json(exercises);
            },
            (err) => {
                console.log("fail get exercises by type");
                res.status(400).json({ err: err });
            }
        );
};

getUserExercises = (req, res) => {
    Exercise.findByUserId(req.user.id)
        .then(
            (exercises) => {
                console.log("success get user exercises");
                res.status(200).json(exercises);
            },
            (err) => {
                console.log("fail get user exercises");
                res.status(400).json({ err: err });
            }
        );
};

update = (req, res) => {
    Exercise.findById(req.params.id)
        .then(
            (exercise) => {
                if (!exercise) {
                    return Promise.reject({ status: 404, message: 'Exercise not found' });
                }
                if (exercise.user_id != req.user.id) {
                    return Promise.reject({ status: 403, message: 'Cannot modify system exercises' });
                }
                return Exercise.update(req.params.id, req.body);
            }
        )
        .then(
            (result) => {
                console.log("success update exercise");
                res.status(200).json({ msg: "Exercise updated successfully" });
            }
        )
        .catch(error => {
            console.log("fail update exercise", error);
            const status = error.status || 400;
            const message = error.message || error;
            res.status(status).json({ err: message });
        });
};

remove = (req, res) => {
    Exercise.findById(req.params.id)
        .then(
            (exercise) => {
                if (!exercise) {
                    return res.status(404).json({ err: "Exercise not found" });
                }
                if (exercise.user_id != req.user.id) {
                    return res.status(403).json({ err: "Cannot delete system exercises" });
                }
                return Exercise.delete(req.params.id);
            }
        )
        .then(
            (result) => {
                console.log("success delete exercise");
                res.status(200).json({ msg: "Exercise deleted successfully" });
            },
            (err) => {
                console.log("fail delete exercise");
                res.status(400).json({ err: err });
            }
        );
};

clone = (req, res) => {
    Exercise.findById(req.params.id)
        .then(
            (exercise) => {
                if (!exercise) {
                    return res.status(404).json({ err: "Exercise not found" });
                }

                const clonedExercise = {
                    name: `${exercise.name} (Custom)`,
                    description: exercise.description,
                    equipment: exercise.equipment,
                    type: exercise.type,
                    reps: exercise.reps,
                    sets: exercise.sets,
                    duration: exercise.duration,
                    user_id: req.user.id
                };

                return Exercise.create(clonedExercise);
            }
        )
        .then(
            (result) => {
                console.log("success clone exercise");
                res.status(200).json({
                    msg: "Exercise cloned successfully",
                    data: result.rows
                });
            },
            (err) => {
                console.log("fail clone exercise");
                res.status(400).json({ err: err });
            }
        );
};

module.exports = {
    create,
    getTypes,
    getEquipmentList,
    getExercise,
    getAll,
    search,
    getByType,
    getUserExercises,
    update,
    remove,
    clone
};