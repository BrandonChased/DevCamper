const express = require("express");
const errorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");

// @desc        Get all course
// @route       GET /api/v1/courses
// @route       GET /api/v1/:bootcampId/courses
// @access      Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const courses = await Course.find({ bootcamp: req.params.bootcampId });

        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        })
    } else {
        res.status(200).json(res.advancedResults);
    }
});

// @desc        Get single course
// @route       GET /api/v1/courses/:id
// @access      Public
exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: "bootcamp",
        select: "name description",
    });

    if (!course) {
        return next(
            new errorResponse(`No course with the id of ${req.params.id}`),
            404
        );
    }

    res.status(200).json({
        success: true,
        data: course,
    });
});

// @desc        Add course
// @route       POST /api/v1/bootcamps/:bootcampId/courses
// @access      Private
exports.createCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
        return next(
            new errorResponse(`No bootcamp with the id of ${req.params.bootcampId}`),
            404
        );
    }

    const course = await Course.create(req.body);

    res.status(200).json({
        success: true,
        data: course,
    });
});

// @desc        Update course
// @route       POST /api/v1/courses/:id
// @access      Private
exports.updatedCourse = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    let course = await Course.findById(id);

    if (!course) {
        return next(
            new errorResponse(`No course with the id of ${req.params.id}`),
            404
        );
    }

    course = await Course.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: course,
    });
});

// @desc        Delete course
// @route       POST /api/v1/courses/:id
// @access      Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    let course = await Course.findByIdAndDelete(id);

    if (!course) {
        return next(
            new errorResponse(`No course with the id of ${req.params.id}`),
            404
        );
    }

    res.status(200).json({
        success: true,
        data: course,
    });
});
