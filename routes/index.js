const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
    res.render('index');
});

//profile
router.get("/profile", (req, res) => {
    const user = req.user
    res.render("profile", user)
})


module.exports = router;