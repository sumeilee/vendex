const User = require("../models/User");
const { createVendorObj, formatVendorData } = require("../scripts/utils");
const Vendor = require("./../models/Vendor");

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
        const vendorObj = formatVendorData(req.body);

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
        const vendorObj = formatVendorData(req.body);

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