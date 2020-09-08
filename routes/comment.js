const express = require('express');
const router = express.Router();

const {
  allComments,
  createCommentView,
  createCommentProcess,
  editCommentView,
  editCommentProcess,
  deleteComment
} = require("../controllers/comment");

const upload = require('../config/cloudinary')

const {
  checkAuthorComment
} = require("../middlewares/index")


//for view of all comments
router.get("/placeDetail", allComments);

//for create comment
router.get("/newComment", createCommentView)
router.post("/newComment", upload.single('image'),createCommentProcess);

//for edit comment
router.get("/editComment/:commentId",  editCommentView)
router.post("/editComment/:commentId",  editCommentProcess);

//for delete comment
router.post("/placeDetail/:commentId",checkAuthorComment, deleteComment);

module.exports=router;