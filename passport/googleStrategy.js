const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "/auth/google/callback"
}, async(accessToken, refreshToken, profile, done) => {
    console.log('PROFILE: ', profile)
    const user = await User.findOne({
        googleID: profile.id
    })
    if (!user) {
        const user = await User.create({
            email: profile.emails[0].value,
            googleID: profile.id,
            image: profile.photos[0].value,
            username: profile.name.givenName
        })
        done(null, user)
    }
    done(null, user)
}))