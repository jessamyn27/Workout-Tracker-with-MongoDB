const router = require('express').Router();
const path = require("path");
const Workout = require("../../models");
const mongoose = require("mongoose");

// get all workouts (use aggregate to sum duration values AND add to new field: total duration)
router.get("/workouts", (req, res) => {
    Workout.aggregate([{
            $addFields: {
                totalDuration: {
                    $sum: "$exercises.duration",
                },
            },
        }, ])
        .then((workout) => {
            res.json(workout);
        })
        .catch((err) => {
            res.json(err);
        });
});

// create new workout that adds to workouts db in the collection for exercise
router.post("/workouts", (req, res) => {
    Workout.create(req.body)
        .then((workout) => {
            res.json(workout);
        })
        .catch((err) => {
            res.json(err);
        });

    // add exercise to collection
    router.put("/workouts/:id", ({ params, body }, res) => {
        Workout.findOneAndUpdate({ _id: params.id }, { $push: { exercises: body } }, { new: true })
            .then((workout) => {
                res.json(workout);
            })
            .catch((err) => {
                res.json(err);
            });
    });

    // get workout range (limit to seven days)
    router.get("/workouts/range", (req, res) => {
        Workout.aggregate([{
                $addFields: {
                    totalDuration: {
                        $sum: "$exercises.duration",
                    },
                },
            }, ])
            .sort({ _id: -1 })
            .limit(7)
            .then((workout) => {
                console.log(workout);
                res.json(workout);
            })
            .catch((err) => {
                res.json(err);
            });
    });

});

module.exports = router;