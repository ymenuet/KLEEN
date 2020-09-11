const passport = require('passport');
const User = require('../models/User');
const {
    genSaltSync,
    hashSync
} = require("bcryptjs");

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

exports.signupProcess = async(req, res) => {
    const {
        username,
        email,
        password
    } = req.body;

    if (username === "" || password === "" || email === "") return res.render("auth/signup", {
        message: "Indicate username, email and password"
    });

    if (req.fileFormatError) return res.render('auth/signup', {
        message: req.fileFormatError
    })

    let image = 'https://res.cloudinary.com/dlyw9xi3k/image/upload/v1599665580/KLEEN/default-profile_p6n81c.png';
    if (req.file) image = req.file.path

    const user = await User.findOne({
        email
    })

    if (user) return res.render("auth/signup", {
        message: "The email already exists"
    });

    const hashPass = hashSync(password, genSaltSync(12));

    await User.create({
        username,
        email,
        image,
        password: hashPass
    });

    res.redirect('/auth/login')
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
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
})

exports.facebookLogin = passport.authenticate('facebook', {
    scope: ['email']
})

exports.facebookLoginCallback = passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
})