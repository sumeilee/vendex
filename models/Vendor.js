const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
    vendorType: [String],
    companyName: String,
    contactName: String,
    countryCode: String,
    contactNumber: String,
    email: String,
    address: {
        addrLine1: String,
        addrLine2: String,
        postalCode: String,
        city: String,
        state: String,
        country: String
    },
    images: [String],
    url: String,
    facebook: String,
    instagram: String,
    otherUrl: String,
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
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

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;