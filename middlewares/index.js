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