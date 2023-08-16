const express = require("express");

// @desc        Get all Bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({ succes: true, msg: "Show all bootcamps" });
}

// @desc        Get single Bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Public
exports.getBootcamp = (req, res, next) => {
    const {id} = req.params;
    res.status(200).json({ succes: true, msg: `Get bootcamp ${id}` })
}

// @desc        Create new Bootcamp
// @route       Post /api/v1/bootcamps
// @access      Private
exports.createBootcamp = (req, res, next) => {
    res.status(200).json({ succes: true, msg: "Create new bootcamps" });
}

// @desc        Update Bootcamp
// @route       Put /api/v1/bootcamps/:id
// @access      Private
exports.updateBootcamp = (req, res, next) => {
    const {id} = req.params;
    res.status(200).json({ succes: true, msg: `Update bootcamp ${id}` });
}

// @desc        Delete Bootcamp
// @route       delete /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = (req, res, next) => {
    const {id} = req.params;
    res.status(200).json({ succes: true, msg: `Delete bootcamp ${id}` });
}