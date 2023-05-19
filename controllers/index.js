'use strict'

const bycrypt = require('bcryptjs')
const chalk = require('chalk')
const { User, UserDetail, Product, Category, Partner, Client } = require('../models')

class Controller {
    static home(req, res) {
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
                res.render('home', { ...dataMenu })
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
}

module.exports = Controller