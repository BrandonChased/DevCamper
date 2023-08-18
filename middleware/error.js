const errorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
    let error = { ...err };

    error.message = err.message

    // Mongoose bad ObjectId
    console.log(err.errors);

    if (err.name == "CastError") {
        const message = `Bootcamp not found with the id ${err.value}`;
        error = new errorResponse(message,404)
    }

    // Mongoose duiplicate key 
    if (err.code == 11000) {
        const message = 'Duplicate field value entered'
        error = new errorResponse(message, 400);
    }
    
    // Mongoose validation error
    if(err.name ==='ValidationError') {
        message = (Object.values(err.errors).map(val => val.message));
        error = new errorResponse(message, 400)
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server Error",
    });
};

module.exports = errorHandler;
