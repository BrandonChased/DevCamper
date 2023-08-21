const express = require("express");
const geocoder = require("../utils/geocoder");
const Bootcamp = require("../models/Bootcamp");
const errorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc        Get all Bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query;

    // Copy of req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ["select", "sort", "page", "limit"];

    // Loop over removefields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // Query String
    let queryStr = JSON.stringify(reqQuery);

    // Allowing operators in the queryStr
    queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
    );

    console.log(queryStr);

    // Finding resourse
    query = Bootcamp.find(JSON.parse(queryStr));

    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields);
    }

    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
    } else {
        query = query.sort("-createAt");
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalDocs = await Bootcamp.countDocuments();

    query.skip(startIndex).limit(limit);

    // Executing query
    const bootcamps = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < totalDocs) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        };
    }

    res
        .status(200)
        .json({ succes: true, count: bootcamps.length, pagination, data: bootcamps });
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
        return next(new errorResponse(`Bootcamp not found with id of ${id}`, 400));
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
        return next(new errorResponse(`Bootcamp not found with id of ${id}`, 400));
    }

    res.status(200).json({ succes: true, data: {} });
});

// @desc        GET Bootcamps within a radius
// @route       GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access      Private
exports.getBootcampsinRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide distance by radius of Earth
    // Earth Radius = 3,963 mi | 6,378 km
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: {
            $geoWithin: { $centerSphere: [[lng, lat], radius] },
        },
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps,
    });
});
