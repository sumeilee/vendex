const User = require("../models/User");
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