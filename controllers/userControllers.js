const User = require("./../models/User");
const Vendor = require("./../models/Vendor");

const { createVendorObj } = require("./../scripts/utils");

exports.showUserVendors = async (req, res) => {
    const _id = req.session.user._id;
    const whose = req.query.whose || "mine";

    try {
        const me = await User.findOne({ _id }).populate("vendors").populate({
            path: "friends",
            populate: { path: "vendors" }
        });

        const myVendors = me.vendors;
        const myVendorsIds = me.vendors.map(vendor => vendor._id);
        const friendsVendors = me.friends.map(friend => friend.vendors).flat();

        // console.log(friendsVendors);

        let vendorObj;

        if (whose === "mine") {
            vendorObj = createVendorObj(myVendors);
        } else if (whose === "friends") {
            vendorObj = createVendorObj(friendsVendors);
        }

        // console.log(vendorObj);

        res.render("./users/vendors", {
            whose,
            myVendorsIds,
            vendorObj
        });
    } catch (err) {
        console.log(err);
        res.redirect("/");
    }
}

exports.addUserVendor = async (req, res) => {
    const { _id } = req.session.user;
    const { vendorId } = req.body;

    try {
        const user = await User.findOne({ _id });

        console.log(user.vendors);
        console.log(vendorId);

        if (!user.vendors.includes(vendorId)) {
            user.vendors.push(vendorId);
            await user.save();
        } else {
            console.log("vendor already in user's list");
        }

        res.redirect("/users/me/vendors");
        // res.status(200).json({ status: "success" });
    } catch (err) {
        console.log(err);
        res.redirect("/users/me/vendors");
        // res.status(400).json({ status: "error" });
    }
}

exports.removeUserVendor = async (req, res) => {
    const { _id } = req.session.user;
    const { vendorId } = req.body;

    try {
        const user = await User.findOne({ _id });

        if (user.vendors.includes(vendorId)) {
            user.vendors.splice(user.vendors.indexOf(vendorId), 1);
            await user.save();
        } else {
            console.log("vendor not in user's list");
        }

        // res.status(200).json({ status: "success" });
        res.redirect("/users/me/vendors");

    } catch (err) {
        console.log(err);
        res.redirect("/users/me/vendors");
        // res.status(400).json({ status: "error" });
    }
}