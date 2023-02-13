const isLogin = (req, res, next) => {
    if (req.session.userId) {
        res.locals.userId = req.session.userId
        res.locals.roleId = req.session.roleId
        res.locals.username = req.session.username

        return next()
    }

    return res.redirect('/login?error=You must login first')
}

module.exports = isLogin