//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// ... require statements and setup code

const secret = process.env.SECRET; // or replace with your own secret key

const encryptionOptions = {
    secret: secret, // or provide encryptionKey and signingKey separately
    encryptedFields: ["password"]
};

userSchema.plugin(encrypt, encryptionOptions);

// ... remaining code

const User = new mongoose.model("User", userSchema);


app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});


app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save()
        .then(savedUser => {
            console.log("User saved:", savedUser);
            res.render("secrets");
            // Handle the success case
        })
        .catch(error => {
            console.log("Error saving user:", error);
            // Handle the error case
        });

});

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username })
        .then(foundUser => {
            if (foundUser.password === password) {
                res.render("secrets");
            }
        })
        .catch(error => {
            console.log("Error find user:", error);
            // Handle the error case
        });

});





app.listen(3000, function () {
    console.log("Server started on port 3000");
});