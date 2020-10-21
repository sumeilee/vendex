const User = require("../models/User");
const { createVendorObj } = require("../scripts/utils");
const Vendor = require("./../models/Vendor");

exports.showNewVendorForm = (req, res) => {
    res.render("./vendors/new");
}

exports.createUserVendor = async (req, res) => {
    try {
        const _id = req.session.user._id;
        const vendor = await Vendor.create({
            ...req.body,
            user: _id
        });

        const user = await User.findOne({ _id });
        await user.vendors.push(vendor._id);
        await user.save();

        res.json({ redirect: "/users/dashboard" });
    } catch (err) {
        console.log(err);
        res.json({ redirect: "/vendors/new" });
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
        res.redirect("/users/dashboard");
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