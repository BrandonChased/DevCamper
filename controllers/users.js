const express = require("express");
const errorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

// @ desc        Get all users
// @route       GET /api/v1/users
// @access      Public
exports.getUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        count: users.length,
        data: users,
    });
});

// @ desc       Get single users
// @route       GET /api/v1/users
// @access      private
exports.getUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
        return next(new errorResponse("User not found", 400));
    }

    res.status(200).json({
        success: true,
        data: user,
    });
});

// @ desc       Create new User
// @route       Post /api/v1/users
// @access      private
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body); 

    res.status(201).json({
        success: true,
        data: user,
    });
});

// @ desc       Update User
// @route       Put /api/v1/users/:id
// @access      private
exports.updateUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params; 

    const user = await User.findByIdAndUpdate(id, req.body, {
        runValidators: true
    });

    if (!user) {
        return next(new errorResponse("User not found", 400));
    }

    res.status(201).json({
        success: true,
        data: user,
    });
});

// @desc       Delete User
// @route      Delete /api/v1/users/:id
// @access     private
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params; 

    const user = await User.findByIdAndDelete(id);

    if (!user) {
        return next(new errorResponse(`User not found with id of ${id}`, 400));
    }

    res.status(200).json({
        success: true,
        data: {},
    });
});


