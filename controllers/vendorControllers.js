const User = require("../models/User");
const { createVendorObj } = require("../scripts/utils");
const Vendor = require("./../models/Vendor");

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

exports.showEditVendorForm = async (req, res) => {
    const _id = req.params.id;

    try {
        const vendor = await Vendor.findOne({ _id });
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
        const data = req.body;

        if (!isValidSubmission(data)) {
            console.log("insufficient vendor data submitted");
            res.redirect("/users/me/vendors");
            return;
        }

        const vendorObj = formatVendorData(data);

        const vendor = await Vendor.findOne({ _id });

        for (key in vendorObj) {
            vendor[key] = vendorObj[key];
        }

        vendor.updatedAt = new Date();

        vendor.save();

        res.redirect("/users/me/vendors");
    } catch (err) {
        console.log(err);
        res.redirect("/users/me/vendors");
    }
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

        const vendorObj = formatVendorData(data);

        const vendor = await Vendor.create({
            ...vendorObj,
            createdBy: _id
        });

        const user = await User.findOne({ _id });
        user.vendors.push(vendor._id);
        await user.save();

        res.redirect("/users/me/vendors");
    } catch (err) {
        console.log(err);
        res.redirect("/users/me/vendors");
    }
}

exports.showVendorProfile = async (req, res) => {
    const _id = req.params.id;

    try {
        const vendor = await Vendor.findOne({ _id });
        res.render("./vendors/show", {
            vendor
        })
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