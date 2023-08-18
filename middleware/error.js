const errorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
    let error = { ...err };

    error.message = err.message

    // Mongoose bad ObjectId
    console.log(err.stack);

    if (err.name == "CastError") {
        const message = `Bootcamp not found with the id ${err.value}`;
        error = new errorResponse(message,404)
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server Error",
    });
};

module.exports = errorHandler;