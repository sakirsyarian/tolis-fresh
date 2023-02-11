'use strict'

const { Category, Product, Partner } = require('../models')

class ProductController {
    static categoryFindAll(req, res) {

        Category.findAll()
            .then(categories => {
                res.render('category', { categories })
            })
            .catch(err => res.send(err))
    }

    static categoryAdd(req, res) {
        const { error } = req.query
        res.render('categoryAdd', { error })
    }

    static categoryCreate(req, res) {
        const { name, image } = req.body

        Category.create({ name, image })
            .then(_ => res.redirect('/categories'))
            .catch(err => res.send(err))
    }

    static categoryEdit(req, res) {
        const { id } = req.params
        const { error } = req.query

        Category.findByPk(id)
            .then(category => {
                res.render('categoryEdit', { category, error })
            })
            .catch(err => res.send(err))
    }

    static categoryUpdate(req, res) {
        const { id } = req.params
        const { name, image } = req.body

        Category.update({ name, image }, { where: { id } })
            .then(_ => res.redirect('/categories'))
            .catch(err => res.send(err))
    }

    static categoryDestroy(req, res) {
        const { id } = req.params

        Category.destroy({ where: { id } })
            .then(_ => res.redirect('/categories'))
            .catch(err => res.send(err))
    }

    static productFindAll(req, res) {
        Product.findAll({ include: [Category, Partner] })
            .then(products => {
                res.render('product', { products })
            })
            .catch(err => res.send(err))
    }

    static productAdd(req, res) {
        const { error } = req.query
        let dataCategories

        Category.findAll()
            .then(categories => {
                dataCategories = categories
                return Partner.findAll()
            })
            .then(partners => {
                res.render('productAdd', { dataCategories, partners, error })
            })
            .catch(err => res.send(err))
    }

    static productCreate(req, res) {
        const { name, price, stock, expired, image, description, CategoryId, PartnerId } = req.body

        Product.create({ name, price, stock, expired, image, description, CategoryId, PartnerId })
            .then(_ => res.redirect('/products'))
            .catch(err => res.send(err))
    }

    static productEdit(req, res) {
        let data = {}
        const { id } = req.params
        const { error } = req.query

        Product.findByPk(id)
            .then(product => {
                data.product = product
                return Category.findAll()
            })
            .then(categories => {
                data.categories = categories
                return Partner.findAll()
            })
            .then(partners => {
                res.render('productEdit', { error, ...data, partners })
            })
            .catch(err => res.send(err))
    }

    static productUpdate(req, res) {
        const { id } = req.params
        const { name, price, stock, expired, image, description, CategoryId, PartnerId } = req.body

        Product.update({ name, price, stock, expired, image, description, CategoryId, PartnerId }, { where: { id } })
            .then(_ => res.redirect('/products'))
            .catch(err => res.send(err))
    }

    static productDestroy(req, res) {
        const { id } = req.params

        Product.destroy({ where: { id } })
            .then(_ => res.redirect('/products'))
            .catch(err => res.send(err))
    }
}

module.exports = ProductController