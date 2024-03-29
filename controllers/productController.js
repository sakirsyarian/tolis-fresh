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
        let filename

        if (req.file) filename = req.file.filename

        Category.create({ name, image: filename })
            .then(_ => res.redirect('/categories'))
            .catch(err => {
                if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
                    const message = err.errors.map(el => el.message)
                    return res.redirect(`/categories/add?error=${message}`)
                }

                res.send(err)
            })
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
            .catch(err => {
                if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
                    const message = err.errors.map(el => el.message)
                    return res.redirect(`/categories/edit/${id}?error=${message}`)
                }

                res.send(err)
            })
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
        let filename

        if (req.file) filename = req.file.filename

        Product.create({ name, price, stock, expired, image: filename, description, CategoryId, PartnerId })
            .then(_ => res.redirect('/products'))
            .catch(err => {
                if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
                    const message = err.errors.map(el => el.message)
                    return res.redirect(`/products/add?error=${message}`)
                }

                res.send(err)
            })
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
            .catch(err => {
                if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
                    const message = err.errors.map(el => el.message)
                    return res.redirect(`/products/edit/${id}?error=${message}`)
                }

                res.send(err)
            })
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

    static partnerFindAll(req, res) {

        Partner.findAll()
            .then(partners => {
                res.render('partners/partner', { partners })
            })
            .catch(err => res.send(err))
    }

    static partnerAdd(req, res) {
        const { error } = req.query
        res.render('partners/partnerAdd', { error })
    }

    static partnerCreate(req, res) {
        const { name } = req.body
        let filename

        if (req.file) filename = req.file.filename

        Partner.create({ name, image: filename })
            .then(_ => res.redirect('/partners'))
            .catch(err => {
                if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
                    const message = err.errors.map(el => el.message)
                    return res.redirect(`/partners/add?error=${message}`)
                }

                res.send(err)
            })
    }

    static partnerEdit(req, res) {
        const { id } = req.params
        const { error } = req.query

        Partner.findByPk(id)
            .then(partner => {
                res.render('partners/partnerEdit', { partner, error })
            })
            .catch(err => res.send(err))
    }

    static partnerUpdate(req, res) {
        const { id } = req.params
        const { name } = req.body
        let filename

        Partner.findByPk(id)
            .then(partner => {
                filename = partner.image
                if (req.file) filename = req.file.filename

                fs.access(`./${baseUrl}${partner.image}`, fs.constants.F_OK, (err) => {
                    if (err) {
                        console.log(chalk.red('file does not exist - error'));
                        return;
                    }

                    const checkAvailability = path.extname(`./${baseUrl}${partner.image}`)
                    if (!checkAvailability) {
                        console.log(chalk.red('file does not exist - check available'));
                        return
                    }

                    console.log(chalk.green(`There is a ${partner.image} file`));
                    if (partner.image !== filename) {
                        fs.unlink(`${baseUrl}${partner.image}`, function (err) {
                            if (err) throw err;
                            console.log(chalk.red(`File ${partner.image} has been deleted!`));
                        });
                    }
                });

                return Partner.update({ name, image: filename }, { where: { id } })
            })
            .then(_ => {
                res.redirect('/partners')
            })
            .catch(err => {
                if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
                    const message = err.errors.map(el => el.message)
                    return res.redirect(`/partners/edit/${id}?error=${message}`)
                }

                res.send(err)
            })
    }

    static partnerDestroy(req, res) {
        const { id } = req.params
        let dataPartner

        Partner.findByPk(id)
            .then(partner => {
                dataPartner = partner
                return Partner.destroy({ where: { id } })
            })
            .then(_ => {
                fs.access(`./${baseUrl}${dataPartner.image}`, fs.constants.F_OK, (err) => {
                    if (err) {
                        console.log(chalk.red('file does not exist - error'));
                        return;
                    }

                    const checkAvailability = path.extname(`./${baseUrl}${dataPartner.image}`)
                    if (!checkAvailability) {
                        console.log(chalk.red('file does not exist - check available'));
                        return
                    }

                    console.log(chalk.green(`There is a ${dataPartner.image} file`));
                    fs.unlink(`${baseUrl}${dataPartner.image}`, function (err) {
                        if (err) throw err;
                        console.log(chalk.red(`File ${dataPartner.image} has been deleted!`));
                    });
                });

                res.redirect('/partners')
            })
            .catch(err => res.send(err))
    }
}

module.exports = ProductController