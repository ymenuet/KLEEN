const express = require("express");
const router = express.Router();
const {
    loginView,
    loginProcess,
    signupView,
    signupProcess,
    logout,
    googleLogin,
    googleLoginCallback,
    facebookLogin,
    facebookLoginCallback
} = require('../controllers/auth');
const {
    catchErrors
} = require("../middlewares");

// Local login
router.get("/login", loginView);
router.post("/login", loginProcess);

// Local signup
router.get("/signup", signupView);
router.post("/signup", catchErrors(signupProcess));

// Logout
router.get("/logout", logout);

// Google auth
router.get("/google", googleLogin);
router.get("/google/callback", googleLoginCallback);

// Facebook auth
router.get('/facebook', facebookLogin);
router.get('/facebook/callback', facebookLoginCallback)


module.exports = router;