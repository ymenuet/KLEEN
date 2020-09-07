const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcryptjs');

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    async(email, password, done) => {
        const user = await User.findOne({
            email
        })
        if (!user) return done(null, false, {
            message: 'Incorrect email'
        })

        if (!bcrypt.compareSync(password, user.password)) return done(null, false, {
            message: 'Incorrect password'
        });

        done(null, user);
    }
));