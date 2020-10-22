const User = require("./../models/User");

exports.showFriends = async (req, res) => {
    const _id = req.session.user;

    try {
        const user = await User.findOne({ _id }).populate("friends", "email");
        const friends = user.friends.map(friend => friend.email);

        res.render("./users/friends/index", {
            friends
        });
    } catch (err) {
        console.log(err);
        res.redirect("/users/dashboard");
    }
}

exports.showFriendForm = (req, res) => {
    res.render("./users/friends/new");
}

exports.addFriend = async (req, res) => {
    const _id = req.session.user;

    const { email } = req.body;

    try {
        const friend = await User.findOne({ email });
        const me = await User.findOne({ _id });

        if (!me.friends.includes(friend)) {
            me.friends.push(friend._id);
            me.save();
        } else {
            console.log("friend already in list");
        }

        res.redirect("/users/friends");
    } catch (err) {
        console.log(err);
        res.redirect("/users/friends");
    }

}