const User = require("./../models/User");

exports.showFriends = async (req, res) => {
    const _id = req.session.user._id;
    const show = req.query.show || "friends";

    let friends;

    try {
        if (show === "friends") {
            const user = await User.findOne({ _id }).populate("friends", "email");
            friends = user.friends.map(({ email }) => ({ email }));
        } else {
            const user = await User.findOne({ _id }).populate("followers", "email");
            friends = user.followers.map(({ email }) => ({ email }));
        }

        res.render("./users/friends/index", {
            show,
            friends
        });
    } catch (err) {
        console.log(err);
        res.redirect("/users/me/vendors");
    }
}

exports.showFriendForm = (req, res) => {
    res.render("./users/friends/new");
}

exports.addFriend = async (req, res) => {
    const _id = req.session.user._id;

    const { email } = req.body;

    try {
        const friend = await User.findOne({ email });
        const me = await User.findOne({ _id });

        if (!friend) {
            console.log("Friend not found");
            res.redirect("/users/me/friends");
            return;
        }

        if (!me.friends.includes(friend._id)) {
            me.friends.push(friend._id);
            await me.save();

            if (!friend.followers.includes(me._id)) {
                friend.followers.push(me._id);
                await friend.save();
            }
        } else {
            console.log("friend already in list");
        }

        res.redirect("/users/me/friends");
    } catch (err) {
        console.log(err);
        res.redirect("/users/me/friends");
    }
}

exports.deleteFriend = async (req, res) => {
    const _id = req.session.user._id;
    const { email } = req.body;

    try {
        const user = await User.findOne({ _id });
        const friend = await User.findOne({ email });

        console.log("deleting friend");
        user.friends.splice(user.friends.indexOf(friend._id), 1);
        await user.save();

        console.log("deleting follower");
        friend.followers.splice(friend.followers.indexOf(user._id), 1);
        await friend.save();

        res.redirect("/users/me/friends");
    } catch (err) {
        console.log(err);
        res.redirect("/users/me/friends");
    }
}

exports.getFriendsWithVendors = async (req, res) => {
    const _id = req.session.user;

    try {
        const user = User.findOne({ _id }).populate({
            path: "friends",
            populate: { path: "vendors" }
        });

        res.send(200).json(user.friends);
    } catch (err) {
        console.log(err);
        res.send(400);
    }
}