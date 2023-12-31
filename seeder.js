const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Load models
const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");
const User = require("./models/User");
const Review = require("./models/Review");

// Connect to DB

mongoose.connect("mongodb://127.0.0.1:27017/DevCamper", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true,
});

// Read JSON files
const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

const courses = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);

const users = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
)

// Import into Db
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        await User.create(users);

        console.log("Data imported...".green.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
    }
};

// Delete data
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await User.deleteMany();

        console.log("Data detroyed...".red.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
    }
};

if (process.argv[2] === "-i") {
    importData();
} else if (process.argv[2] === "-d") {
    deleteData();
} else {
    process.exit();
}
