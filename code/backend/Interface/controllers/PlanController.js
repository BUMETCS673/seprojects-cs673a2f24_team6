const WorkoutPlan = require('../models/WorkoutPlan')

createPlan = (req, res) => {
    // Validate required fields
    const requiredFields = ['exercise_id', 'name', 'start_date', 'frequency_type', 'frequency_value'];
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
                console.log("success create plan");
                res.status(200).json({
                    msg: "Plan created successfully",
                    data: result.rows
                });
            },
            (err) => {
                console.log("fail create plan");
                res.status(400).json({ err: err });
            }
        );
};

getPlan = (req, res) => {
    WorkoutPlan.findPlanById(req.params.id)
        .then(
            (plan) => {
                console.log("success get plan");
                if (!plan) {
                    return res.status(404).json({ err: "Plan not found" });
                }
                if (plan.user_id != req.user.id) {
                    return res.status(403).json({ err: "Access denied" });
                }
                res.status(200).json(plan);
            },
            (err) => {
                console.log("fail get plan");
                res.status(400).json({ err: err });
            }
        );
};

getUserPlans = (req, res) => {
    WorkoutPlan.findPlansByUserId(req.user.id)
        .then(
            (plans) => {
                console.log("success get user plans");
                res.status(200).json(plans);
            },
            (err) => {
                console.log("fail get user plans");
                res.status(400).json({ err: err });
            }
        );
};

getActivePlans = (req, res) => {
    const date = req.query.date || new Date().toISOString().split('T')[0];

    WorkoutPlan.findActivePlans(req.user.id, date)
        .then(
            (plans) => {
                console.log("success get active plans");
                res.status(200).json(plans);
            },
            (err) => {
                console.log("fail get active plans");
                res.status(400).json({ err: err });
            }
        );
};

updatePlan = (req, res) => {
    WorkoutPlan.findPlanById(req.params.id)
        .then(
            (plan) => {
                if (!plan || plan.user_id != req.user.id) {
                    return res.status(404).json({ err: "Plan not found" });
                }
                return WorkoutPlan.update(req.params.id, req.body);
            }
        )
        .then(
            (result) => {
                console.log("success update plan");
                res.status(200).json({ msg: "Plan updated successfully" });
            },
            (err) => {
                console.log("fail update plan");
                res.status(400).json({ err: err });
            }
        );
};

updatePlanStatus = (req, res) => {
    if (!req.body.status) {
        return res.status(400).json({ err: "Status is required" });
    }

    WorkoutPlan.findPlanById(req.params.id)
        .then(
            (plan) => {
                if (!plan || plan.user_id != req.user.id) {
                    return res.status(404).json({ err: "Plan not found" });
                }
                return WorkoutPlan.updateStatus(req.params.id, req.body.status);
            }
        )
        .then(
            (result) => {
                console.log("success update plan status");
                res.status(200).json({ msg: "Plan status updated successfully" });
            },
            (err) => {
                console.log("fail update plan status");
                res.status(400).json({ err: err });
            }
        );
};

deletePlan = (req, res) => {
    WorkoutPlan.findPlanById(req.params.id)
        .then(
            (plan) => {
                if (!plan || plan.user_id != req.user.id) {
                    return res.status(404).json({ err: "Plan not found" });
                }
                return WorkoutPlan.delete(req.params.id);
            }
        )
        .then(
            (result) => {
                console.log("success delete plan");
                res.status(200).json({ msg: "Plan deleted successfully" });
            },
            (err) => {
                console.log("fail delete plan");
                res.status(400).json({ err: err });
            }
        );
};

getPlansByFrequency = (req, res) => {
    const { frequency_type } = req.params;
    if (!['daily', 'weekly', 'monthly', 'custom'].includes(frequency_type)) {
        return res.status(400).json({ err: "Invalid frequency type" });
    }

    WorkoutPlan.findPlansByFrequency(req.user.id, frequency_type)
        .then(
            (plans) => {
                console.log("success get plans by frequency");
                res.status(200).json(plans);
            },
            (err) => {
                console.log("fail get plans by frequency");
                res.status(400).json({ err: err });
            }
        );
};

module.exports = {
    createPlan,
    getPlan,
    getUserPlans,
    getActivePlans,
    updatePlan,
    updatePlanStatus,
    deletePlan,
    getPlansByFrequency
};