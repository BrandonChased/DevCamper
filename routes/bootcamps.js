const express = require("express");
const bootcampRouter = express.Router();

const {
    getBootcamp,
    getBootcamps,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
} = require("../controllers/bootcamps");

bootcampRouter.route("/").get(getBootcamps).post(createBootcamp);

bootcampRouter
    .route("/:id")
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

module.exports = bootcampRouter;
