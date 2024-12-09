// controllers/ExerciseController.js
const Exercise = require('../models/Exercise')

getTypeList = (req, res) => {
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

getAll = (req, res) => {
    Exercise.findAll()
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

getByType = (req, res) => {

    if(!req.query.type){
        res.status(400).json({err:"missing type"});
      }
    
    Exercise.findByType(req.query.type)
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


getByEquipment = (req, res) => {
    if(!req.query.equipment){
        res.status(400).json({err:"missing equipment"});
      }
    
    Exercise.findByEquipment(req.query.equipment)
        .then(
            (exercises) => {
                console.log("success get exercises by equipment");
                res.status(200).json(exercises);
            },
            (err) => {
                console.log("fail get exercises by equipment");
                res.status(400).json({ err: err });
            }
        );
};

getById = (req, res) => {
    if(!req.query.exercise_id){
        res.status(400).json({err:"missing exercise_id"});
      }
    
    Exercise.findById(req.query.exercise_id)
        .then(
            (exercises) => {
                console.log("success get exercises by exercise_id");
                res.status(200).json(exercises);
            },
            (err) => {
                console.log("fail get exercises by exercise_id");
                res.status(400).json({ err: err });
            }
        );
};

create = (req, res) => {
    const user_id = req.user.id;
    if(user_id != 1){
        res.status(400).json({ err: "only Admin account accept" });
    }

    if(!req.body.name){
        res.status(400).json({err:"missing name"});
    }

    Exercise.create(req.body)
        .then(
            (result) => {
                if (result.err){
                    console.log("fail create exercise");
                    return res.status(400).json(result);
                }
                console.log("success create exercise");
                res.status(200).json(result);
            },
            (err) => {
                console.log("fail create exercise");
                res.status(400).json(err);
            }
        );
};

remove = (req, res) => {
    const user_id = req.user.id;
    if(user_id != 1){
        res.status(400).json({ err: "only Admin account accept" });
    }

    if(!req.body.exercise_id){
        res.status(400).json({err:"missing exercise_id"});
    }
    
    Exercise.deleteExercise(req.body.exercise_id)
        .then(
            (result) => {
                if (result.err){
                    console.log("fail delete exercise");
                    return res.status(400).json(result);
                }
                console.log("success delete exercise");
                res.status(200).json(result);
            },
            (err) => {
                console.log("fail delete exercise");
                res.status(400).json(err);
            }
        );
};

module.exports = {
    getTypeList,
    getEquipmentList,
    getAll,
    getByType,
    getByEquipment,
    getById,
    create,
    remove
};