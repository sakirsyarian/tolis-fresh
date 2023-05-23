const saveSession = (req, res, next) => {
    if (req.session.userId) {
        res.locals.userId = req.session.userId
        res.locals.roleId = req.session.roleId
        res.locals.username = req.session.username
        res.locals.image = req.session.image
    }

    next()
}

module.exports = saveSession