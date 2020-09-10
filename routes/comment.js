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

//for edit comment
router.get("/editComment/:commentId", ensureLogin, checkAuthorComment, editCommentView)
router.post("/editComment/:commentId", upload.single('image'),editCommentProcess)


//for delete comment
router.post("/:commentId", ensureLogin, checkAuthorComment, deleteComment);

module.exports = router;
