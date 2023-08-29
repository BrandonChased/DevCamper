const express = require("express");

const {
    getCourses,
    getCourse,
    createCourse,
    updatedCourse,
    deleteCourse
} = require("../controllers/courses");
const courseRouter = express.Router({mergeParams: true});

courseRouter.route("/")
    .get(getCourses)
    .post(createCourse)
    courseRouter.route("/:id")
    .get(getCourse)
    .put(updatedCourse)
    .delete(deleteCourse)
module.exports = courseRouter;