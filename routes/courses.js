const express = require("express");


const {
    getCourses,
    getCourse,
    createCourse,
    updatedCourse,
    deleteCourse
} = require("../controllers/courses");
const courseRouter = express.Router({mergeParams: true});
const Course = require("../models/Course");
const advancedResults = require("../middleware/advancedResults");

courseRouter.route("/")
    .get(advancedResults(Course, {
        path: "bootcamp",
        select: "name description",
    }), getCourses)
    .post(createCourse)
    courseRouter.route("/:id")
    .get(getCourse)
    .put(updatedCourse)
    .delete(deleteCourse)
module.exports = courseRouter;