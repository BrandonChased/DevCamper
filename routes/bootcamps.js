const express = require("express");
const bootcampRouter = express.Router();

const {
    getBootcamp,
    getBootcamps,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsinRadius,
} = require("../controllers/bootcamps");

bootcampRouter.route("/radius/:zipcode/:distance")
    .get(getBootcampsinRadius);

bootcampRouter.route("/")
    .get(getBootcamps)
    .post(createBootcamp);

bootcampRouter
    .route("/:id")
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

module.exports = bootcampRouter;
