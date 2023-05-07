'use strict'

const express = require('express')
const router = express.Router()

const multerConfig = require('../middlewares/multerConfig')

const ClientController = require('../controllers/clientController')

router.get('/clients', ClientController.clientFindAll)

router.get('/clients/add', ClientController.clientAdd)
router.post('/clients/add', multerConfig.single('image'), ClientController.clientCreate)

router.get('/clients/edit/:id', ClientController.clientEdit)
router.post('/clients/edit/:id', multerConfig.single('image'), ClientController.clientUpdate)

router.get('/clients/delete/:id', ClientController.clientDestroy)

module.exports = router