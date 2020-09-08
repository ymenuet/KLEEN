const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: `${process.env.URL}/auth/facebook/callback`,
    profileFields: ['id', 'email', 'gender', 'link', 'name', 'photos']
}, async(accesToken, refreshToken, profile, done) => {
    const user = await User.findOne({
        facebookID: profile.id
    })
    const userWithEmail = await User.findOne({
        email: profile.emails[0].value
    })
    if (!user && userWithEmail) return done(null, false, {
        message: "Try logging in with Google or a local account"
    })
    if (!user && !userWithEmail) {
        const user = await User.create({
            facebookID: profile.id,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
            username: profile.name.givenName
        })
        return done(null, user)
    }
    done(null, user)
}))