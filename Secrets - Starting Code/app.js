//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
// const bcrypt = require("bcrypt");
// const saltRounds = 11;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    //   cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());



mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

// ... require statements and setup code

// const secret = process.env.SECRET; // or replace with your own secret key

// const encryptionOptions = {
//     secret: secret, // or provide encryptionKey and signingKey separately
//     encryptedFields: ["password"]
// };

// userSchema.plugin(encrypt, encryptionOptions);

// ... remaining code

const User = new mongoose.model("User", userSchema);


// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.get("/secrets", function (req, res) {

    if (req.isAuthenticated()) {
        res.render("secrets");
    } else {
        res.redirect("/login");
    }
});
app.get("/logout", function (req, res) {
    req.logout(function (err) {
        if (err) {
            console.log("Error logging out:", err);
            res.redirect("/");
        } else {
            res.redirect("/");
        }
    });
});


app.post("/register", function (req, res) {
    User.register({ username: req.body.username }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            })
        }
    });
    // bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    //     // Store hash in your password DB.
    //     const newUser = new User({
    //         email: req.body.username,
    //         // password: md5(req.body.password)
    //         password: hash
    //     });

    //     newUser.save()
    //         .then(savedUser => {
    //             console.log("User saved:", savedUser);
    //             res.render("secrets");
    //             // Handle the success case
    //         })
    //         .catch(error => {
    //             console.log("Error saving user:", error);
    //             // Handle the error case
    //         });
    // });

    // const newUser = new User({
    //     email: req.body.username,
    //     // password: md5(req.body.password)
    // });

    // newUser.save()
    //     .then(savedUser => {
    //         console.log("User saved:", savedUser);
    //         res.render("secrets");
    //         // Handle the success case
    //     })
    //     .catch(error => {
    //         console.log("Error saving user:", error);
    //         // Handle the error case
    //     });

});

app.post("/login", function (req, res) {

    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function (err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            })
        }
    })
    // const username = req.body.username;
    // // const password = md5(req.body.password);
    // const password = req.body.password;
    // User.findOne({ email: username })
    //     .then(foundUser => {
    //         bcrypt.compare(password, foundUser.password, function (err, result) {
    //             // result == true
    //             res.render("secrets");
    //         });



    //     })
    //     .catch(error => {
    //         console.log("Error find user:", error);
    //         // Handle the error case
    //     });

});





app.listen(3000, function () {
    console.log("Server started on port 3000");
});