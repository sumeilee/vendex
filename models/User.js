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
    created_at: {
        type: Date,
        default: new Date()
    },
    updated_at: {
        type: String,
        default: new Date()
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;