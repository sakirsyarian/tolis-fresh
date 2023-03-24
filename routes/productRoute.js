'use strict'

const express = require('express')
const router = express.Router()

const multerConfig = require('../middlewares/multerConfig')

const ProductController = require('../controllers/productController')

router.get('/categories', ProductController.categoryFindAll)

router.get('/categories/add', ProductController.categoryAdd)
router.post('/categories/add', multerConfig.single('image'), ProductController.categoryCreate)

router.get('/categories/edit/:id', ProductController.categoryEdit)
router.post('/categories/edit/:id', multerConfig.single('image'), ProductController.categoryUpdate)

router.get('/categories/delete/:id', ProductController.categoryDestroy)

router.get('/products', ProductController.productFindAll)

router.get('/products/add', ProductController.productAdd)
router.post('/products/add', multerConfig.single('image'), ProductController.productCreate)

router.get('/products/edit/:id', ProductController.productEdit)
router.post('/products/edit/:id', multerConfig.single('image'), ProductController.productUpdate)

router.get('/products/delete/:id', ProductController.productDestroy)

module.exports = router