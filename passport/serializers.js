const passport = require('passport');
const User = require('../models/User');

passport.serializeUser((loggedInUser, cb) => {
    cb(null, loggedInUser._id);
});

passport.deserializeUser(async(userIdFromSession, cb) => {
    try {
        const user = await User.findById(userIdFromSession)
        cb(null, user);
    } catch (err) {
        cb(err);
    }
});