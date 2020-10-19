require("dotenv").config();

const express = require("express");
const session = require("express-session");
const methodOverride = require("method-override");
const mongoose = require("mongoose");

// SERVER CONFIG
const app = express();
const port = 5000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        name: "app_session",
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false, // only works with SSL
            maxAge: 3600000,
        },
    })
);

// DATABASE CONFIG
const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;
// const mongoURI = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}`;
const mongoURI = "mongodb://localhost:27017/vendex";
mongoose.set("useFindAndModify", false);

// CONTROLLERS

const authControllers = require("./controllers/authControllers");
const vendorControllers = require('./controllers/vendorControllers');
const userControllers = require("./controllers/userControllers");

// MIDDLEWARE

const authMiddleware = require("./middleware/authMiddleware");

app.use(authMiddleware.setUserVar);

// ROUTES
app.get("/", (req, res) => {
    res.render("./index");
});

app.get("/signup", authControllers.showSignupForm);
app.post("/signup", authControllers.signup);

app.get("/login", authControllers.showLoginForm);
app.post("/login", authControllers.login);

app.post("/logout", authControllers.logout);

// VENDOR ROUTES
app.get("/vendors/new", vendorControllers.showNewVendorForm);
app.post("/vendors/new", vendorControllers.createVendor);

// USER ROUTES
app.get(
    "/users/dashboard",
    authMiddleware.authenticatedOnly,
    userControllers.showDashbaord
);

mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to DB");

        app.listen(port, () => {
            console.log(`App listening on port: ${port}`);
        });
    })
    .catch(err => console.log(err));

// app.listen(port, () => {
//     console.log(`App listening on port: ${port}`);
// });
