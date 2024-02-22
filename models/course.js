const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            Required: true,
        },
        email: {
            type: String,
            Required: true,
        },
        phone: {
            type: String,
            Required: true,
        },
        dob: {
            type: String,
            Required: true,
        },
        address: {
            type: String,
            Required: true,
        },
        gender: {
            type: String,
            Required: true,
        },
        education: {
            type: String,
            Required: true,
        },
        course: {
            type: String,
            Required: true,
        },
        user_id: {
            type: String,
            Required: true,
        },
        status: {
            type: String,
            default: 'Pending',
        },
        comment: {
            type: String,
            default: 'Pending',
        }
    },
    { timestamps: true }
);

const CourseModel = mongoose.model("course", CourseSchema);

module.exports = CourseModel;
