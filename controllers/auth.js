const passport = require('passport');
const User = require('../models/User');
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

exports.loginView = (req, res) => {
    res.render("auth/login", {
        "message": req.flash("error")
    });
}

exports.loginProcess = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
})

exports.signupView = (req, res) => {
    res.render("auth/signup");
}

exports.singupProcess = async(req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    if (username === "" || password === "" || email === "") {
        res.render("auth/signup", {
            message: "Indicate username, email and password"
        });
        return;
    }

    const user = await User.findOne({
        email
    })
    if (user) return res.render("auth/signup", {
        message: "The username already exists"
    });

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    await User.create({
        username,
        email,
        password: hashPass
    });

    res.redirect('/')
};

exports.logout = (req, res) => {
    req.logout();
    res.redirect("/");
}

exports.googleLogin = passport.authenticate("google", {
    scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email"
    ]
})

exports.googleLoginCallback = passport.authenticate("google", {
    successRedirect: "/profile",
    failureRedirect: "/auth/login",
    failureFlash: true,
})

exports.facebookLogin = passport.authenticate('facebook', {
    scope: ['email']
})

exports.facebookLoginCallback = passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/auth/login',
    failureFlash: true
})