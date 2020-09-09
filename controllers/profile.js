const User = require("../models/User")
const Comment = require("../models/Comment")

exports.viewProfile = async (req, res) => {
    const user = req.user
    const comments = await Comment.find({author : req.user._id})
    res.render("profile/profile", {user, comments})
}

exports.editProfileView = (req, res) => {
    res.render("profile/editProfile")
}

exports.editProfileProcess = async(req, res) => {
    const {
        username
    } = req.body;

    if (username === '') return res.render('profile/editProfile', {
        error: "Please enter a username"
    })

    let image = req.user.image;
    if (req.file) image = req.file.path

    await User.findByIdAndUpdate(req.user._id, {
        username,
        image
    })
    res.redirect("/profile")
}