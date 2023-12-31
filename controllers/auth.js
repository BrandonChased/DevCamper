const express = require("express");
const errorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

// @ desc        Get all users
// @route       GET /api/v1/auth/register
// @access      Public
exports.register = asyncHandler(async (req, res,next) => {
    res.status(200).json({success:true})
})