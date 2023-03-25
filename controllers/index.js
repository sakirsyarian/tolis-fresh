'use strict'

const bycrypt = require('bcryptjs')
const chalk = require('chalk')
const { User, Role } = require('../models')

class Controller {
    static home(req, res) {
        User.findAll()
            .then(users => {
                res.render('home', { users })
            })
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

        User.findOne({ where: { username } })
            .then(user => {
                if (!user) return res.redirect('/login?error=Invalid username/password')

                const isValidPassword = bycrypt.compareSync(password, user.password)
                if (!isValidPassword) return res.redirect('/login?error=Invalid username/password')

                req.session.userId = user.id
                req.session.roleId = user.RoleId
                req.session.username = user.username

                return res.redirect('/dashboard')
            })
            .catch(err => {
                res.send(err)
            })
    }

    static dashboard(req, res) {
        const { username, userId } = req.session
        res.render('dashboard', { username, userId })
    }

    static logout(req, res) {
        req.session.destroy(err => {
            if (err) return res.send(err)
            return res.redirect('/login')
        })
    }
}

module.exports = Controller