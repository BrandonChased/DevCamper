const express = require("express");
const userRouter = express.Router();
const {
    getUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
} = require("../controllers/users");

userRouter.route("/")
    .get(getUsers)
    .post(createUser);

userRouter.route("/:id")
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

module.exports = userRouter;
