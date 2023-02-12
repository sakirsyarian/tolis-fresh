'use strict'

const express = require('express')
const router = express.Router()

const Controller = require('../controllers')
const userRouter = require('./userRoute')
const productRouter = require('./productRoute')
const clientRouter = require('./clientRoute')
const isLoginForHome = require('../middlewares/isLoginForHome')

router.get('/', isLoginForHome, Controller.home)

router.get('/register', isLoginForHome, Controller.register)
router.post('/register', isLoginForHome, Controller.registerCreate)

router.get('/login', isLoginForHome, Controller.login)
router.post('/login', isLoginForHome, Controller.loginCreate)

// isLogin middleware
router.use((req, res, next) => {
    if (req.session.userId) {
        res.locals.userId = req.session.userId
        res.locals.roleId = req.session.roleId
        res.locals.username = req.session.username
        return next()
    }

    return res.redirect('/login?error=You must login first')
})

router.get('/dashboard', Controller.dashboard)

router.get('/logout', Controller.logout)

router.use(userRouter)
router.use(productRouter)
router.use(clientRouter)

module.exports = router