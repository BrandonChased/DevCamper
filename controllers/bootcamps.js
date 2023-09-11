const path = require("path");
const express = require("express");
const geocoder = require("../utils/geocoder");
const Bootcamp = require("../models/Bootcamp");
const errorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../models/Course");
const { config } = require("dotenv");
const { FILE } = require("dns");

// @desc        Get all Bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {

    res.status(200).json(res.advancedResults);
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

    res.status(200).json({ success: true, data: bootcamp });
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

    res.status(200).json({ success: true, data: bootcamp });
});

// @desc        Delete Bootcamp
// @route       delete /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const bootcamp = await Bootcamp.findById(id);

    if (!bootcamp) {
        return next(new errorResponse(`Bootcamp not found with id of ${id}`, 400));
    }

    await Course.deleteMany({ bootcamp: id });

    await Bootcamp.deleteOne({ _id: id });

    res.status(200).json({ success: true, data: {} });
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

// @desc        Upload photo for bootcamp
// @route       Put /api/v1/bootcamps/:id/photo
// @access      Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const bootcamp = await Bootcamp.findById(id);

    if (!bootcamp) {
        return next(new errorResponse(`Bootcamp not found with id of ${id}`, 400));
    }

    if (!req.files) {
        return next(new errorResponse(`Please Upload a file`, 400));
    }

    const file = req.files.file;

    // Make sure that image is a photo
    if (!file.mimetype.startsWith("image")) {
        return next(new errorResponse(`Please Upload an image file`, 400));
    }

    // Check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new errorResponse(
                `Please Upload an image less than ${process.env.MAX_FILE_UPLOAD} bytes`,
                400
            )
        );
    }

    // Create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
        if (err) {
            console.error(err);
            return next(new errorResponse(`Problem with with upload`, 500));
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

        res.status(200).json({
            success: true,
            data: file.name
        })
    });
});
