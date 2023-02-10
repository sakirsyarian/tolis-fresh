const isLogin = (req, res, next) => {
    console.log(req.session);
    if (req.session.userId) return next()
    return res.redirect('/login?error=You must login first')
}

module.exports = isLogin