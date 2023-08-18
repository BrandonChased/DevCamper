const mongoose = require("mongoose");

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Please enter a name"],
        unique: true,
        trim: true,
        maxLength: [50, "Name cannot be more than 50 Characters"],
    },
    slug: String,
    description: {
        type: String,
        require: [true, "Please enter a description"],
        unique: true,
        trim: true,
        maxLength: [500, "Name cannot be more than 50 description"],
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            "Please use a valid URL with https",
        ],
    },
    phone: {
        type: String,
        maxLength: [20, "Phone Number can not be longer then 20 characters"]
    },
    email: {
        type: String,
        match: [/^[A-Za-z0-9+_.-]+@(.+)$/, "Please use a vaild email address"],
    },
    address: {
        type: String,
        require: [true, "Please add an address"],
    },
    location: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ["Point"], // 'location.type' must be 'Point'
            required: false,
        },
        coordinates: {
            type: [Number],
            required: false,
            index: "2dsphere",
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
    },
    careers: {
        type: [String],
        require: true,
        enum: [
            "Web Development",
            "Mobile Development",
            "UI/UX",
            "Data Science",
            "Business",
            "Other",
        ],
    },
    averageRating: {
        type: Number,
        min: [1, "Rating must be at  least 1"],
        max: [1, "Rating cannot be more than 10"],
    },
    averageCost: {
        photo: {
            type: String,
            default: "no-photo-jpb",
        },
    },
    housing: {
        type: Boolean,
        default: false,
    },
    jobAssistance: {
        type: Boolean,
        default: false,
    },
    jobGuarantee: {
        type: Boolean,
        default: false,
    },
    acceptGi: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Bootcamp", BootcampSchema);
