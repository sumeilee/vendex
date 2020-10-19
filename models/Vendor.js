const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
    vendor_type: [String],
    company_name: String,
    contact_name: String,
    country_code: String,
    contact_number: String,
    email: String,
    address: {
        addr_line_1: String,
        addr_line_2: String,
        postal_code: String,
        city: String,
        state: String,
        country: String
    },
    images: [String],
    url: String,
    facebook: String,
    instagram: String,
    other_url: String
});

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;