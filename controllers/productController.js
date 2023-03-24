'use strict'

const fs = require('fs')
const chalk = require('chalk')
const path = require('path')

const { Category, Product, Partner } = require('../models')

const baseUrl = 'public/uploads/'

class ProductController {
    static categoryFindAll(req, res) {

        Category.findAll()
            .then(categories => {
                res.render('categories/category', { categories })
            })
            .catch(err => res.send(err))
    }

    static categoryAdd(req, res) {
        const { error } = req.query
        res.render('categories/categoryAdd', { error })
    }

    static categoryCreate(req, res) {
        const { name } = req.body
        const filename = req.file.filename

        Category.create({ name, image: filename })
            .then(_ => res.redirect('/categories'))
            .catch(err => res.send(err))
    }

    static categoryEdit(req, res) {
        const { id } = req.params
        const { error } = req.query

        Category.findByPk(id)
            .then(category => {
                res.render('categories/categoryEdit', { category, error })
            })
            .catch(err => res.send(err))
    }

    static categoryUpdate(req, res) {
        const { id } = req.params
        const { name } = req.body
        let filename

        Category.findByPk(id)
            .then(category => {
                filename = category.image
                if (req.file) filename = req.file.filename

                fs.access(`./${baseUrl}${category.image}`, fs.constants.F_OK, (err) => {
                    if (err) {
                        console.log(chalk.red('file does not exist - error'));
                        return;
                    }

                    const checkAvailability = path.extname(`./${baseUrl}${category.image}`)
                    if (!checkAvailability) {
                        console.log(chalk.red('file does not exist - check available'));
                        return
                    }

                    console.log(chalk.green(`There is a ${category.image} file`));
                    if (category.image !== filename) {
                        fs.unlink(`${baseUrl}${category.image}`, function (err) {
                            if (err) throw err;
                            console.log(chalk.red(`File ${category.image} has been deleted!`));
                        });
                    }
                });

                return Category.update({ name, image: filename }, { where: { id } })
            })
            .then(_ => {
                res.redirect('/categories')
            })
            .catch(err => res.send(err))
    }

    static categoryDestroy(req, res) {
        const { id } = req.params
        let dataCategory

        Category.findByPk(id)
            .then(category => {
                dataCategory = category
                return Category.destroy({ where: { id } })
            })
            .then(_ => {
                fs.access(`./${baseUrl}${dataCategory.image}`, fs.constants.F_OK, (err) => {
                    if (err) {
                        console.log(chalk.red('file does not exist - error'));
                        return;
                    }

                    const checkAvailability = path.extname(`./${baseUrl}${dataCategory.image}`)
                    if (!checkAvailability) {
                        console.log(chalk.red('file does not exist - check available'));
                        return
                    }

                    console.log(chalk.green(`There is a ${dataCategory.image} file`));
                    fs.unlink(`${baseUrl}${dataCategory.image}`, function (err) {
                        if (err) throw err;
                        console.log(chalk.red(`File ${dataCategory.image} has been deleted!`));
                    });
                });

                res.redirect('/categories')
            })
            .catch(err => res.send(err))
    }

    static productFindAll(req, res) {
        Product.findAll({ include: [Category, Partner] })
            .then(products => {
                res.render('products/product', { products })
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
                res.render('products/productAdd', { dataCategories, partners, error })
            })
            .catch(err => res.send(err))
    }

    static productCreate(req, res) {
        const { name, price, stock, expired, description, CategoryId, PartnerId } = req.body
        const { filename } = req.file

        Product.create({ name, price, stock, expired, image: filename, description, CategoryId, PartnerId })
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
                res.render('products/productEdit', { error, ...data, partners })
            })
            .catch(err => res.send(err))
    }

    static productUpdate(req, res) {
        const { id } = req.params
        const { name, price, stock, expired, description, CategoryId, PartnerId } = req.body
        let filename

        Product.findByPk(id)
            .then(product => {
                filename = product.image
                if (req.file) filename = req.file.filename

                fs.access(`./${baseUrl}${product.image}`, fs.constants.F_OK, (err) => {
                    if (err) {
                        console.log(chalk.red('file does not exist - error'));
                        return;
                    }

                    const checkAvailability = path.extname(`./${baseUrl}${product.image}`)
                    if (!checkAvailability) {
                        console.log(chalk.red('file does not exist - check available'));
                        return
                    }

                    console.log(chalk.green(`There is a ${product.image} file`));
                    if (product.image !== filename) {
                        fs.unlink(`${baseUrl}${product.image}`, function (err) {
                            if (err) throw err;
                            console.log(chalk.red(`File ${product.image} has been deleted!`));
                        });
                    }
                });

                return Product.update({ name, price, stock, expired, image: filename, description, CategoryId, PartnerId }, { where: { id } })
            })
            .then(_ => res.redirect('/products'))
            .catch(err => res.send(err))
    }

    static productDestroy(req, res) {
        const { id } = req.params
        let dataProduct

        Product.findByPk(id)
            .then(product => {
                dataProduct = product
                return Product.destroy({ where: { id } })
            })
            .then(_ => {
                fs.access(`./${baseUrl}${dataProduct.image}`, fs.constants.F_OK, (err) => {
                    if (err) {
                        console.log(chalk.red('file does not exist - error'));
                        return;
                    }

                    const checkAvailability = path.extname(`./${baseUrl}${dataProduct.image}`)
                    if (!checkAvailability) {
                        console.log(chalk.red('file does not exist - check available'));
                        return
                    }

                    console.log(chalk.green(`There is a ${dataProduct.image} file`));
                    fs.unlink(`${baseUrl}${dataProduct.image}`, function (err) {
                        if (err) throw err;
                        console.log(chalk.red(`File ${dataProduct.image} has been deleted!`));
                    });
                });

                res.redirect('/products')
            })
            .catch(err => res.send(err))
    }
}

module.exports = ProductController