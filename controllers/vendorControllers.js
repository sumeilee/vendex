const User = require("../models/User");
const { createVendorObj } = require("../scripts/utils");
const Vendor = require("./../models/Vendor");
const VendorReview = require('./../models/VendorReview');

const formatVendorData = (data) => {
    const doc = {};
    const vendorType = [];
    const address = {};

    for (key in data) {
        if (key.startsWith("address--")) {
            const field = key.split("--")[1];
            address[field] = data[key];
        } else if (key.startsWith("vendor--")) {
            vendorType.push(data[key]);
        } else {
            doc[key] = data[key];
        }
    }

    doc["vendorType"] = vendorType;
    doc["address"] = address;

    return doc;
}

const anyServiceReviewData = (data) => {
    let anyData = false;

    for (key in data) {
        if (key.startsWith("location--")) {
            anyData = true;
        }
    }

    const fields = ["services", "rating", "avgCost", "comments"];

    fields.forEach(field => {
        if (data[field]) {
            anyData = true;
        }
    });

    return anyData;
};

const formatVendorServiceReviewData = (data) => {
    const doc = {};
    const locations = [];

    if (!anyServiceReviewData(data)) {
        return null;
    }

    for (key in data) {
        if (key.startsWith("location--")) {
            anyData = true;
            locations.push(data[key]);
        }
    }

    doc["locations"] = locations;
    doc["services"] = data["services"];

    if (data["rating"]) {
        doc["rating"] = parseInt(data["rating"]);
    }

    doc["comments"] = data["comments"];

    if (data["avgCost"]) {
        doc["avgCost"] = parseFloat(data["avgCost"]);
    }

    return doc;
}

const isValidSubmission = (data) => {
    let isValid = false;

    const contactInfo = [
        "contactNumber",
        "email",
        "url",
        "facebook",
        "instagram",
        "otherUrl",
        "address--addrLine1",
        "address--addrLine2"
    ];

    if (Object.keys(data).some(field => field.includes("vendor--"))) {
        if (data.companyName || data.contactName) {
            contactInfo.forEach(info => {
                if (data[info]) {
                    isValid = true;
                }
            });
        }
    }

    return isValid;
}

exports.showNewVendorForm = (req, res) => {
    res.render("./vendors/new");
}

exports.createVendor = async (req, res) => {
    try {
        const _id = req.session.user._id;
        const data = req.body;

        if (!isValidSubmission(data)) {
            console.log("insufficient vendor data submitted");
            res.redirect("/users/me/vendors");
            return;
        }

        // create vendor with contact info
        const vendorObj = formatVendorData(data);
        console.log(vendorObj);

        const vendor = await Vendor.create({
            ...vendorObj,
            createdBy: _id
        });

        const user = await User.findOne({ _id });
        user.vendors.push(vendor._id);
        await user.save();

        // add vendor service & review info
        const serviceReviewObj = formatVendorServiceReviewData(data);

        if (serviceReviewObj) {
            const review = await VendorReview.create({
                ...serviceReviewObj,
                reviewer: _id,
                vendor: vendor._id
            });
        }

        res.redirect("/users/me/vendors");
    } catch (err) {
        console.log(err);
        res.redirect("/users/me/vendors");
    }
}

exports.showVendorProfile = async (req, res) => {
    const _id = req.params.id;

    try {
        const vendor = (await Vendor.findOne({ _id })).toObject();
        const vendorReviews = await VendorReview.find({ vendor: _id });
        let serviceReview = null;

        if (vendorReviews && vendorReviews.length > 0) {

            const locations = [];
            const reviews = [];
            let numRatings = 0;
            let totalRating = 0;
            let numCosts = 0;
            let totalCost = 0;

            vendorReviews.map(review => {
                review.locations.map(loc => {
                    if (!locations.includes(loc)) {
                        locations.push(loc);
                    }
                });
                reviews.push({
                    cost: review.avgCost,
                    rating: review.rating,
                    comments: review.comments
                });

                if (review.rating) {
                    numRatings++;
                    totalRating += review.rating;
                }

                if (review.avgCost) {
                    numCosts++;
                    totalCost += review.avgCost;
                }
            });

            serviceReview = {
                locations,
                reviews,
                avgCost: totalCost / numCosts,
                avgRating: totalRating / numRatings
            };
        }

        res.render("./vendors/show", {
            vendor,
            serviceReview
        })
    } catch (err) {
        console.log(err);
        res.redirect("/users/me/vendors");
    }
}

exports.showEditVendorForm = async (req, res) => {
    const reviewer = req.session.user._id;
    const _id = req.params.id;

    try {
        let vendor = await Vendor.findOne({ _id });
        const vendorReview = await VendorReview.findOne({ reviewer, vendor: _id });

        if (vendorReview) {
            vendor = {
                ...vendor.toObject(),
                ...vendorReview.toObject(),
                _id: vendor._id // ensure id is vendor's not vendorReview
            };
        }
        // console.log(vendor);

        res.render("./vendors/edit", {
            vendor
        });
    } catch (err) {
        console.log(err);
        res.redirect("/users/me/vendors");
    }
}

exports.updateVendor = async (req, res) => {
    try {
        const _id = req.params.id;
        const reviewer = req.session.user._id;
        const data = req.body;

        if (!isValidSubmission(data)) {
            console.log("insufficient vendor data submitted");
            res.redirect("/users/me/vendors");
            return;
        }

        // update vendor contact
        const vendorObj = formatVendorData(data);
        const vendor = await Vendor.findOne({ _id });

        // console.log(_id);
        // console.log(vendor);
        for (key in vendorObj) {
            vendor[key] = vendorObj[key];
        }

        vendor.updatedAt = new Date();
        await vendor.save();

        // update vendor review
        const serviceReviewObj = formatVendorServiceReviewData(data);
        const vendorReview = await VendorReview.findOne({ reviewer, vendor: _id });
        console.log(serviceReviewObj);
        if (!vendorReview) {
            // console.log("creating new review");
            await VendorReview.create({
                ...serviceReviewObj,
                reviewer,
                vendor: _id
            });
        } else {
            // console.log("editing review");
            for (key in serviceReviewObj) {
                vendorReview[key] = serviceReviewObj[key];
            }

            vendorReview.updatedAt = new Date();
            await vendorReview.save();
        }

        res.redirect(`/vendors/${_id}`);
        // res.redirect("/users/me/vendors");
    } catch (err) {
        console.log(err);
        res.redirect("/users/me/vendors");
    }
}

exports.showVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find();
        const vendorObj = createVendorObj(vendors);

        res.render("./vendors/index", {
            vendorObj
        });
    } catch (err) {
        console.log(err);
        res.redirect("/");
    }
}