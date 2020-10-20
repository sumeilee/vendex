const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: String,
        default: new Date()
    },
    vendors: [{
        type: mongoose.Schema.ObjectId,
        ref: "Vendor"
    }],
    // watchList: [{
    //     type: mongoose.Schema.ObjectId,
    //     ref: "Vendor"
    // }],
    friends: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }]
});

const User = mongoose.model("User", userSchema);

module.exports = User;