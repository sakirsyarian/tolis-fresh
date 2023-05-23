'use strict'

const express = require('express')
const router = express.Router()

const multerConfig = require('../middlewares/multerConfig')

const UserController = require('../controllers/userController')

router.get('/roles', UserController.roleFindAll)

router.get('/roles/add', UserController.roleAdd)
router.post('/roles/add', UserController.roleCreate)

router.get('/roles/edit/:id', UserController.roleEdit)
router.post('/roles/edit/:id', UserController.roleUpdate)

router.get('/roles/delete/:id', UserController.roleDestroy)

router.get('/users', UserController.userFindAll)

router.get('/users/add', UserController.userAdd)
router.post('/users/add', UserController.userCreate)

router.get('/users/edit/:id', UserController.userEdit)
router.post('/users/edit/:id', UserController.userUpdate)

router.get('/users/delete/:id', UserController.userDestroy)

router.get('/user-details/:id', UserController.userDetailFindAll)

router.get('/user-details/edit/:id', UserController.userDetailEdit)
router.post('/user-details/edit/:id', multerConfig.single('image'), UserController.userDetailUpdate)

module.exports = router