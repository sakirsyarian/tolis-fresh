'use strict'

const bycrypt = require('bcryptjs')
const chalk = require('chalk')
const { User, UserDetail, Product, Category, Partner, Client, Purchase } = require('../models')

class Controller {
    static home(req, res) {
        const { error, message } = req.query
        let dataMenu = {}

        User.findAll()
            .then(users => {
                dataMenu.users = users
                return Product.findAll()
            })
            .then(prodcts => {
                dataMenu.products = prodcts
                return Category.findAll({ limit: 4 })
            })
            .then(categories => {
                dataMenu.categories = categories
                return Partner.findAll({ limit: 12 })
            })
            .then(partners => {
                dataMenu.partners = partners
                return Client.findAll({ limit: 12 })
            })
            .then(clients => {
                dataMenu.clients = clients
                res.render('home', { ...dataMenu, error, message })
            })
            .catch(err => res.send(err))
    }

    static listProducts(req, res) {

        Product.findAll()
            .then(products => {
                res.render('listProduct', { products })
            })
            .catch(err => res.send(err))
    }

    static register(req, res) {
        const { error } = req.query
        res.render('auth/register', { error })
    }

    static registerCreate(req, res) {
        const { username, email, password } = req.body

        User.create({ username, email, password })
            .then(() => res.redirect('/login'))
            .catch(err => {
                if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
                    const message = err.errors.map(el => el.message)
                    return res.redirect(`/register?error=${message}`)
                }

                res.send(err)
            })
    }

    static login(req, res) {
        const { error } = req.query
        res.render('auth/login', { error })
    }

    static loginCreate(req, res) {
        const { username, password } = req.body

        User.findOne({ include: UserDetail, where: { username } })
            .then(user => {
                if (!user) return res.redirect('/login?error=Invalid username/password')

                const isValidPassword = bycrypt.compareSync(password, user.password)
                if (!isValidPassword) return res.redirect('/login?error=Invalid username/password')

                req.session.userId = user.id
                req.session.roleId = user.RoleId
                req.session.username = user.username
                req.session.image = user.UserDetail.image

                return res.redirect('/dashboard')
            })
            .catch(err => {
                res.send(err)
            })
    }

    static dashboard(req, res) {
        let dataMenu = {}

        Product.findAll()
            .then(prodcts => {
                dataMenu.products = prodcts
                return Category.findAll()
            })
            .then(categories => {
                dataMenu.categories = categories
                return Partner.findAll()
            })
            .then(partners => {
                dataMenu.partners = partners
                return Client.findAll()
            })
            .then(clients => {
                res.render('dashboard', { ...dataMenu, clients })
            })
            .catch(err => res.send(err))
    }

    static logout(req, res) {
        req.session.destroy(err => {
            if (err) return res.send(err)
            return res.redirect('/login')
        })
    }

    static purchaseFindAll(req, res) {
        Purchase.findAll({ order: [['createdAt', 'DESC']] })
            .then(purchases => {
                res.render('purchase', { purchases })
            })
            .catch(err => res.send(err))
    }

    static purchaseCreate(req, res) {
        const { name, message, email, phoneNumber, businessName, businessAddress } = req.body

        Purchase.create({ name, message, email, phoneNumber, businessName, businessAddress })
            .then(_ => res.redirect('/?message=Berhasil mengirim pesan'))
            .catch(err => {
                if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
                    const message = err.errors.map(el => el.message)
                    return res.redirect(`/?error=${message}`)
                }

                res.send(err)
            })
    }

    static purchaseView(req, res) {
        const { id } = req.params

        Purchase.findByPk(id)
            .then(purchase => {
                res.render('purchaseView', { purchase })
            })
            .catch(err => res.send(err))
    }

    static purchaseRead(req, res) {
        const { id } = req.params

        Purchase.update({ status: "Read" }, { where: { id } })
            .then(_ => res.redirect('/purchases'))
            .catch(err => res.send(err))
    }

    static purchaseDestroy(req, res) {
        const { id } = req.params

        Purchase.destroy({ where: { id } })
            .then(_ => res.redirect('/purchases'))
            .catch(err => res.send(err))
    }
}

module.exports = Controller