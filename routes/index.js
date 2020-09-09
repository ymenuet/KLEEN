const express = require('express');
const router = express.Router();
const upload = require('../config/cloudinary')

const {
    editProfileView,
    editProfileProcess
} = require("../controllers/profile")

/* GET home page */
router.get('/', (req, res, next) => {
    res.render('index');
});

/* Profile page */
router.get("/profile/profile", (req, res) => {
    const user = req.user
    res.render("profile/profile", user)
})

/* Edit Profile */
router.get("/profile/editProfile", editProfileView)
router.post("/profile/editProfile", upload.single('image'), editProfileProcess)

module.exports = router;