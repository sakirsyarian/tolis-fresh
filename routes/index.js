'use strict'

const express = require('express')
const router = express.Router()

const Controller = require('../controllers')
const userRouter = require('./userRoute')
const productRouter = require('./productRoute')
const isLogin = require('../middlewares/isLogin')

router.get('/', Controller.home)

router.get('/register', Controller.register)
router.post('/register', Controller.registerCreate)

router.get('/login', Controller.login)
router.post('/login', Controller.loginCreate)

router.get('/dashboard', isLogin, Controller.dashboard)
router.get('/logout', Controller.logout)

router.use(userRouter)
router.use(productRouter)

module.exports = router