const User = require("./../models/User");
const Vendor = require("./../models/Vendor");

const { createVendorObj } = require("./../scripts/utils");

exports.showDashboard = async (req, res) => {
    const _id = req.session.user._id;
    const whoseVendors = req.query.vendors || "mine";

    let vendors;

    try {
        if (whoseVendors === "mine") {
            vendors = await Vendor.find({ user: _id });
        } else if (whoseVendors === "friends") {
            const me = await User.findOne({ _id });
            vendors = await Vendor.find({ user: { $in: me.friends } });
        }
        // console.log(vendors);

        // const vendors = await Vendor.find({ user: _id });
        const vendorObj = createVendorObj(vendors);

        res.render("users/dashboard", {
            vendorObj
        });
    } catch (err) {
        console.log(err);
        res.redirect("/");
    }
}