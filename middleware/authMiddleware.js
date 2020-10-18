exports.authenticatedOnly = (req, res, next) => {
    if (!req.session || !req.session.user) {
        res.redirect("/login");
        return;
    }

    next();
}

exports.guestOnly = (req, res, next) => {
    if (req.session && req.session.user) {
        res.redirect("/users/dashboard");
        return;
    }

    next();
}

exports.setUserVar = (req, res, next) => {
    res.locals.user = null;

    if (req.session && req.session.user) {
        res.locals.user = req.session.user.email;
    }

    next();
}