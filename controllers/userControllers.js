const Vendor = require("./../models/Vendor");

exports.showDashbaord = async (req, res) => {
    const _id = req.session.user._id;

    try {
        const vendors = await Vendor.find({ user: _id });

        const vendorObj = {};

        vendors.forEach(vendor => {
            vendor.vendorType.forEach(type => {
                if (!Object.keys(vendorObj).includes(type)) {
                    vendorObj[type] = [];
                }

                vendorObj[type].push(vendor);
            })
        });

        res.render("users/dashboard", {
            vendorObj
        });
    } catch (err) {
        console.log(err);
        res.redirect("/");
    }
}