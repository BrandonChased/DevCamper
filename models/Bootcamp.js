const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter a name"],
        unique: true,
        trim: true,
        maxLength: [50, "Name cannot be more than 50 Characters"],
    },
    slug: String,
    description: {
        type: String,
        required: [true, "Please enter a description"],
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
        maxLength: [20, "Phone Number can not be longer then 20 characters"],
    },
    email: {
        type: String,
        match: [/^[A-Za-z0-9+_.-]+@(.+)$/, "Please use a vaild email address"],
    },
    address: {
        type: String,
        required: [true, "Please add an address"],
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
        required: true,
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
        type: Number,
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

// Create bootcamp slug from the name

BootcampSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower: true});
    next();
});

// Geocode & create location field
BootcampSchema.pre('save', async function(next) {
    const loc = await geocoder.geocode(this.address);
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode,
    }
    
    // Do not save address in db
    this.address = undefined; 
    next();
})

module.exports = mongoose.model("Bootcamp", BootcampSchema);
