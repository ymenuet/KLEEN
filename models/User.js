const {
    Schema,
    model
} = require('mongoose');

const userSchema = new Schema({
    username: String,
    email: {
        type: String,
        required: true
    },
    password: String,
    image: {
        type: String,
        default: 'https://res.cloudinary.com/dlyw9xi3k/image/upload/v1599665580/KLEEN/default-profile_p6n81c.png'
    },
    googleID: String,
    facebookID: String
}, {
    timestamps: true
});

module.exports = model('User', userSchema);