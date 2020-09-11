const express = require('express');
const router = express.Router();

const {
    createCommentProcess,
    editCommentView,
    editCommentProcess,
    deleteComment,
} = require("../controllers/comment");

const upload = require('../config/cloudinary')

const {
    checkAuthorComment,
    ensureLogin
} = require("../middlewares/index")

router.post("/newComment/:placeId", ensureLogin, upload.single('image'), createCommentProcess);

router.get("/editComment/:commentId", ensureLogin, checkAuthorComment, editCommentView)
router.post("/editComment/:commentId", ensureLogin, checkAuthorComment, upload.single('image'), editCommentProcess)

router.post("/:commentId", ensureLogin, checkAuthorComment, deleteComment);

module.exports = router;