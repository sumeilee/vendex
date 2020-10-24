const bcrypt = require("bcrypt");
const User = require("./../models/User");

exports.showSignupForm = (req, res) => {
    res.render("./signup");
};

exports.signup = async (req, res) => {
    const { email, password, passwordConfirm } = req.body;

    if (!email || !password || !passwordConfirm) {
        res.redirect("/signup");
        return;
    }

    if (password !== passwordConfirm) {
        res.redirect("/signup");
        return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({
            email,
            passwordHash
        });

        req.session.user = {
            _id: user._id,
            email: user.email
        };

        res.redirect("/users/me/vendors");
    } catch (err) {
        console.log(err);
        res.redirect("/signup");
    }
}

exports.showLoginForm = (req, res) => {
    res.render("./login");
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.redirect("/login");
        return;
    }

    try {
        const user = await User.findOne({ email });

        const authenticated = await bcrypt.compare(password, user.passwordHash);

        if (authenticated) {
            req.session.user = {
                _id: user._id,
                email: user.email
            };

            res.redirect("/users/me/vendors");
        } else {
            res.redirect("/login");
        }
    } catch (err) {
        console.log(err);
        res.redirect("/login");
    }
};

exports.logout = (req, res) => {
    req.session.destroy();

    res.redirect("/");
}