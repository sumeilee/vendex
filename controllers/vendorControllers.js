const Vendor = require("./../models/Vendor");

exports.showNewVendorForm = (req, res) => {
    res.render("./vendors/new");
}

exports.createVendor = async (req, res) => {
    try {
        const vendor = await Vendor.create(req.body);
        res.send(vendor);
    } catch (err) {
        console.log(err);
        res.redirect("/vendors/new");
    }
}