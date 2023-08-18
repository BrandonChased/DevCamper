const express = require("express");
const Bootcamp = require("../models/Bootcamp");
const errorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc        Get all Bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamps = await Bootcamp.find();

    res
        .status(200)
        .json({ succes: true, count: bootcamps.length, data: bootcamps });
});

// @desc        Get single Bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const bootcamp = await Bootcamp.findById(id);

    if (!bootcamp) {
        return next(new errorResponse(`Bootcamp not found with id of ${id}`, 400));
    }

    res.status(200).json({ succes: true, data: bootcamp });
});

// @desc        Create new Bootcamp
// @route       Post /api/v1/bootcamps
// @access      Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
        success: true,
        data: bootcamp,
    });
});

// @desc        Update Bootcamp
// @route       Put /api/v1/bootcamps/:id
// @access      Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {

    const { id } = req.params;
    const bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
        runValidators: true,
    });

    if (!bootcamp) {
        return next(
            new errorResponse(`Bootcamp not found with id of ${id}`, 400)
        );
    }

    res.status(200).json({ succes: true, data: bootcamp });
});

// @desc        Delete Bootcamp
// @route       delete /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {

    const { id } = req.params;
    const bootcamp = await Bootcamp.findByIdAndDelete(id);

    if (!bootcamp) {
        return next(
            new errorResponse(`Bootcamp not found with id of ${id}`, 400)
        );
    }

    res.status(200).json({ succes: true, data: {} });

});
