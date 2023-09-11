const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema({
    title: {
        type: String,
    },
    text: {
        type: String,
    },
    rating: {
        type: Number,
        min: 1,
        max: 10
    }
})

module.exports = mongoose.model("Review", ReviewSchema);