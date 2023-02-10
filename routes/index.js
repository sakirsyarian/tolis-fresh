'use strict'

const Controller = require('../controllers')
const userRouter = require('./userRoutes')
const express = require('express')
const router = express.Router()

router.get('/', Controller.home)
router.use(userRouter)

module.exports = router