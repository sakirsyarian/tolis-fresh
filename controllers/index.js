'use strict'

const { User } = require('../models')

class Controller {
    static home(req, res) {
        User.findAll()
            .then(users => {
                res.render('home', { users })
            })
    }

    static register(req, res) {
        const { error } = req.query
        res.render('register', { error })
    }

    static registerPost(req, res) {
        const { email, password } = req.body
        User.create({ email, password })
            .then(() => {
                res.redirect('/login')
            })
            .catch(err => {
                res.send(err)
            })
    }

    static login(req, res) {
        const { error } = req.query
        res.render('login', { error })
    }

    static loginPost(req, res) {
        const { username, password } = req.body

        User.findOne({ where: { username } })
            .then(user => {
                if (user && user.password === password) {
                    req.session.userId = user.id
                    req.session.roleId = user.RoleId
                    req.session.username = user.username

                    return res.redirect('/dashboard')
                }

                res.send('Invalid username/password')
            })
            .catch(err => res.send(err))
    }

    static dashboard(req, res) {
        res.render('dashboard')
    }

    static logout(req, res) {
        req.session.destroy(err => {
            if (err) return res.send(err)
            return res.redirect('/login')
        })
    }
}

module.exports = Controller