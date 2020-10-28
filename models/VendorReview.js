const mongoose = require("mongoose");

const vendorReviewSchema = new mongoose.Schema({
    reviewer: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    vendor: {
        type: mongoose.Schema.ObjectId,
        ref: "Vendor"
    },
    services: [String],
    locations: [String],
    comments: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    avgCost: {
        type: Number,
        min: 0
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        default: new Date()
    }
});

const VendorReview = mongoose.model("VendorReview", vendorReviewSchema);

module.exports = VendorReview;