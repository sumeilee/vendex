const User = require("./../models/User");
const Vendor = require("./../models/Vendor");

const { createVendorObj } = require("./../scripts/utils");

exports.showUserVendors = async (req, res) => {
    const _id = req.session.user._id;
    const whose = req.query.whose || "mine";

    let vendors;

    try {
        if (whose === "mine") {
            vendors = await Vendor.find({ user: _id });
        } else if (whose === "friends") {
            const me = await User.findOne({ _id });
            vendors = await Vendor.find({ user: { $in: me.friends } });
        }

        const vendorObj = createVendorObj(vendors);

        res.render("./users/vendors", {
            whose,
            vendorObj
        });
    } catch (err) {
        console.log(err);
        res.redirect("/");
    }
}