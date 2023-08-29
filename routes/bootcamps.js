const express = require("express");
const bootcampRouter = express.Router();

const {
    getBootcamp,
    getBootcamps,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsinRadius,
    bootcampPhotoUpload
} = require("../controllers/bootcamps");

// Include other resource routers
const courseRouter = require("./courses");

// Re-route into other resource routers
bootcampRouter.use("/:bootcampId/courses", courseRouter);

bootcampRouter.route("/radius/:zipcode/:distance")
    .get(getBootcampsinRadius);

bootcampRouter.route("/:id/photo")
    .put(bootcampPhotoUpload);

bootcampRouter.route("/")
    .get(getBootcamps)
    .post(createBootcamp);

bootcampRouter
    .route("/:id")
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

module.exports = bootcampRouter;
