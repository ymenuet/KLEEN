const express = require('express');
const router = express.Router();
const upload = require('../config/cloudinary')
const {
    ensureLogin
} = require('../middlewares')

const {
    viewProfile,
    editProfileView,
    editProfileProcess,
} = require("../controllers/profile")

/* GET home page */
router.get('/', (req, res) => {
    res.render('index');
});

/* Profile page */
router.get("/profile", ensureLogin, viewProfile)

/* Edit Profile */
router.get("/profile/editProfile", ensureLogin, editProfileView)
router.post("/profile/editProfile", ensureLogin, upload.single('image'), editProfileProcess)


module.exports = router;