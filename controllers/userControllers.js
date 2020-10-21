const Vendor = require("./../models/Vendor");

const { createVendorObj } = require("./../scripts/utils");

exports.showDashbaord = async (req, res) => {
    const _id = req.session.user._id;

    try {
        const vendors = await Vendor.find({ user: _id });
        const vendorObj = createVendorObj(vendors);

        res.render("users/dashboard", {
            vendorObj
        });
    } catch (err) {
        console.log(err);
        res.redirect("/");
    }
}