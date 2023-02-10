'use strict'

const Controller = require('../controllers')
const isLogin = require('../middlewares/isLogin')

const express = require('express')
const router = express.Router()

router.get('/register', Controller.register)
router.post('/register', Controller.registerPost)

router.get('/login', Controller.login)
router.post('/login', Controller.loginPost)

router.get('/dashboard', isLogin, Controller.dashboard)
router.get('/logout', Controller.logout)

module.exports = router