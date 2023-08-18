const express = require("express");
const Bootcamp = require("../models/Bootcamp");
const errorResponse = require("../utils/errorResponse");

// @desc        Get all Bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();

        res
            .status(200)
            .json({ succes: true, count: bootcamps.length, data: bootcamps });
    } catch (error) {
        next(error)
    }
};

// @desc        Get single Bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Public
exports.getBootcamp = async (req, res, next) => {
    const { id } = req.params;
    try {
        const bootcamp = await Bootcamp.findById(id);

        if (!bootcamp) {
            return next(new errorResponse(`Bootcamp not found with id of ${id}`, 400));
        }

        res.status(200).json({ succes: true, data: bootcamp });
    } catch (error) {
        // res.status(400).json({ succes: false });
        next(error);
    }
};

// @desc        Create new Bootcamp
// @route       Post /api/v1/bootcamps
// @access      Private
exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body);

        res.status(201).json({
            success: true,
            data: bootcamp,
        });
    } catch(err) {
        next(err)
    }
};

// @desc        Update Bootcamp
// @route       Put /api/v1/bootcamps/:id
// @access      Private
exports.updateBootcamp = async (req, res, next) => {
    try {
        const { id } = req.params;
        const bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
            runValidators: true,
        });

        if (!bootcamp) {
            return next(new errorResponse(`Bootcamp not found with id of ${id}`, 400));
        }

        res.status(200).json({ succes: true, data: bootcamp });
    } catch (error) {
        next(error)
    }
};

// @desc        Delete Bootcamp
// @route       delete /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const { id } = req.params;
        const bootcamp = await Bootcamp.findByIdAndDelete(id);

        if (!bootcamp) {
            return next(new errorResponse(`Bootcamp not found with id of ${id}`, 400));
        }

        res.status(200).json({ succes: true, data: {} });
    } catch (error) {
        next(error)
    }
};
