const isLogin = (req, res, next) => {
    if (req.session.userId) return next()
    return res.redirect('/login?error=You must login first')
}

module.exports = isLogin