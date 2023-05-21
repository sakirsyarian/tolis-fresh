'use strict'

const express = require('express')
const router = express.Router()

const Controller = require('../controllers')
const userRouter = require('./userRoute')
const productRouter = require('./productRoute')
const clientRouter = require('./clientRoute')

const saveSession = require('../middlewares/saveSession')
const isLogin = require('../middlewares/isLogin')

router.get('/', saveSession, Controller.home)
router.get('/list-products', saveSession, Controller.listProducts)

router.get('/register', saveSession, Controller.register)
router.post('/register', saveSession, Controller.registerCreate)

router.get('/login', saveSession, Controller.login)
router.post('/login', saveSession, Controller.loginCreate)

router.post('/purchases/add', Controller.purchaseCreate)

// isLogin middleware
router.use(isLogin)

router.get('/dashboard', Controller.dashboard)
router.get('/purchases', Controller.purchaseFindAll)
router.get('/purchases/view/:id', Controller.purchaseView)
router.get('/purchases/read/:id', Controller.purchaseRead)
router.get('/purchases/delete/:id', Controller.purchaseDestroy)
router.get('/logout', Controller.logout)

router.use(userRouter)
router.use(productRouter)
router.use(clientRouter)

module.exports = router