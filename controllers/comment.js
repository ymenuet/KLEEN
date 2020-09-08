const Comment =  require("../models/Comment");
const User = require("../models/User");
const Place =  require("../models/Place");

//All comments in the detail page
exports.allComments = async(req, res)=>{
  const comments = await Comment.find().populate("author");
  res.render("place/placeDetail", {comments});
}

//Create new comment page (comment, newComment)
exports.createCommentView = (req, res)=>{
  res.render("comment/newComment")
}

exports.createCommentProcess = async(req, res)=>{
  const {content, scoreMasks, scoreGel, scoreClean, scoreService} = req.body;
  const { path } = req.file;

  const newComment = await Comment.create({
    author : req.user._id,
    place : req.place,
    image : path,
    content,
    scoreMasks,
    scoreGel,
    scoreClean,
    scoreService
  })

  res.render("comment/newComment")
}

//Edit comment (comment, editComment)
exports.editCommentView = async(req, res)=>{
  const { commentId } = req.params;
  const comment = await Comment.findById(commentId)
  res.render("comment/editComment", comment)
}

exports.editCommentProcess = async(req, res)=>{
  const { commentId } = req.params; 
  const {content, scoreMasks, scoreGel, scoreClean, scoreService} = req.body;
  const { path } = req.file;

    await Comment.findByIdAndUpdate(commentId, {
    author : req.user,
    place : req.place,
    image : path,
    content,
    scoreMasks,
    scoreGel,
    scoreClean,
    scoreService,
  })

  res.redirect("place/placeDetail")
}

//Delete
exports.deleteComment = async(req, res)=>{
  await Comment.findByIdAndDelete(req.params.commentId);
  res.redirect("/");
}