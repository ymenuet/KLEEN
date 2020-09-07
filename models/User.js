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
    hashPwd: String,
    image: String,
    googleID: String,
    facebookID: String
}, {
    timestamps: true
});

module.exports = model('User', userSchema);