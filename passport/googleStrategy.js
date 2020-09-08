const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "/auth/google/callback"
}, async(accessToken, refreshToken, profile, done) => {
    const user = await User.findOne({
        googleID: profile.id
    })
    const userWithEmail = await User.findOne({
        email: profile.emails[0].value
    })
    if (!user && userWithEmail) return done(null, false, {
        message: "Try logging in with Facebook or a local account"
    })
    if (!user && !userWithEmail) {
        const user = await User.create({
            email: profile.emails[0].value,
            googleID: profile.id,
            image: profile.photos[0].value,
            username: profile.name.givenName
        })
        return done(null, user)
    }
    done(null, user)
}))