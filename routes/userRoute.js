'use strict'

const express = require('express')
const router = express.Router()

const UserController = require('../controllers/userController')

router.get('/user-details/:id', UserController.userDetailFindAll)

router.get('/user-details/edit/:id', UserController.userDetailEdit)
router.post('/user-details/edit/:id', UserController.userDetailUpdate)

module.exports = router