const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const {
    compareSync
} = require('bcryptjs');

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    async(email, password, done) => {
        try {
            const user = await User.findOne({
                email
            })
            if (!user) return done(null, false, {
                message: 'Incorrect email'
            })
            if (!user.password) return done(null, false, {
                message: "Your account doesn't have a password associated. Try logging in with Facebook or Google."
            })
            if (user.password && !compareSync(password, user.password)) return done(null, false, {
                message: 'Incorrect password'
            });
            done(null, user);
        } catch (err) {
            console.log('ERROR MESSAGE: ', err)
            return err
        }
    }
));