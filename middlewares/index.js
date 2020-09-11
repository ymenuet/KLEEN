const Place = require('../models/Place');
const Comment = require('../models/Comment')

exports.ensureLogin = (req, res, next) => {
    if (req.user) next();
    else res.redirect('/auth/login')
}

exports.catchErrors = controller => (req, res, next) => controller(req, res).catch(next)

exports.sendUser = app => (req, res, next) => {
    if (req.user) app.locals.user = req.user;
    else app.locals.user = null;
    next();
}

exports.checkAuthorPlace = async(req, res, next) => {
    const place = await Place.findById(req.params.placeId)
    if (`${place.creator}` === `${req.user._id}`) return next()
    else res.redirect('/')
}

exports.checkAuthorComment = async(req, res, next) => {
    const comment = await Comment.findById(req.params.commentId)
    if (`${comment.author}` === `${req.user._id}`) return next()
    else res.redirect('/')
}

