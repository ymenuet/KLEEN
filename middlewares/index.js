const Place = require('../models/Place')

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
    const place = await Place.findById(req.params.placeId).populate('creator')
    if (place.creator._id === req.user._id) next()
    else redirect('/')
}

exports.checkAuthorComment = async(req, res, next) => {
    const place = await Place.findById(req.params.commentId).populate('author')
    if (place.author._id === req.user._id) next()
    else redirect('/')
}