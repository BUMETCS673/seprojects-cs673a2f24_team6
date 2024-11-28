const WorkoutPlan = require('../models/WorkoutPlan')

createPlan = (req, res) => {
    // Validate required fields
    const requiredFields = ['status'];
    for (const field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).json({ err: `Missing required field: ${field}` });
        }
    }

    const planData = {
        ...req.body,
        user_id: req.user.id
    };

    WorkoutPlan.create(planData)
        .then(
            (result) => {
                if (result.err){
                    return res.status(400).json(result);
                } 
                console.log("success create plan");
                res.status(200).json(result);
            },
            (err) => {
                console.log("fail create plan");
                res.status(400).json(err);
            }
        );
};

getUserPlans = (req, res) => {
    WorkoutPlan.findPlansByUserId(req.user.id)
        .then(
            (result) => {
                if (result.err){
                    return res.status(400).json(result);
                } 
                console.log("success get user plans");
                res.status(200).json(result);
            },
            (err) => {
                console.log("fail get user plans");
                res.status(400).json(err);
            }
        );
};

updatePlan = (req, res) => {
    const requiredFields = ['status','plan_id'];
    for (const field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).json({ err: `Missing required field: ${field}` });
        }
    }

    WorkoutPlan.update(req.user.id, req.body)
        .then(
            (result) => {
                if (result.err){
                    return res.status(400).json(result);
                } 
                console.log("success update plan");
                res.status(200).json(result);
            },
            (err) => {
                console.log("fail update plan");
                res.status(400).json(err);
            }
        );
};

deletePlan = (req, res) => {
    const requiredFields = ['plan_id'];
    for (const field of requiredFields) {
        if (!req.query[field]) {
            return res.status(400).json({ err: `Missing required field: ${field}` });
        }
    }

    WorkoutPlan.delete(req.query.plan_id, req.user.id)
        .then(
            (result) => {
                if (result.err){
                    return res.status(400).json(result);
                } 
                console.log("success delete plan");
                res.status(200).json(result);
            },
            (err) => {
                console.log("fail delete plan");
                res.status(400).json(err);
            }
        );
};


module.exports = {
    createPlan,
    getUserPlans,
    updatePlan,
    deletePlan
};