require("dotenv").config();

const express = require("express");
const methodOverride = require("method-override");
const mongoose = require("mongoose");

// SERVER CONFIG
const app = express();
const port = 5000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// DATABASE CONFIG
const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;
const mongoURI = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}`;
mongoose.set("useFindAndModify", false);

// ROUTES
app.get("/", (req, res) => {
    res.render("./index");
});

app.get("/signup", (req, res) => {
    res.render("./signup");
})

app.get("/login", (req, res) => {
    res.render("./login");
})

// mongoose
//     .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log("Connected to DB");

//         app.listen(port, () => {
//             console.log(`App listening on port: ${port}`);
//         });
//     })
//     .catch(err => console.log(err));

app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});
