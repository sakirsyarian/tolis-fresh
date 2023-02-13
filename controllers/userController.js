'use strict'

const { UserDetail, User, Role } = require('../models')

class UserController {
    static userDetailFindAll(req, res) {
        const { id } = req.params

        User.findByPk(id, {
            include: UserDetail
        })
            .then(user => {
                res.render('profile', { user })
            })
            .catch(err => res.send(err))
    }

    static userDetailEdit(req, res) {
        const { id } = req.params
        const { error } = req.query

        User.findByPk(id, {
            include: UserDetail
        })
            .then(user => {
                res.render('profileEdit', { id, error, user })
            })
            .catch(err => res.send(err))
    }

    static userDetailUpdate(req, res) {
        const { id } = req.params
        const { firstName, lastName, phoneNumber, dateOfBirth, address, username, email } = req.body

        UserDetail.findByPk(id, {
            include: User
        })
            .then((userDetail) => {
                // jika userDetail ada, maka update
                if (userDetail) {
                    UserDetail.update(
                        { firstName, lastName, phoneNumber, dateOfBirth, address },
                        { where: { id } }
                    )

                    return User.update(
                        { username, email },
                        { where: { id } }
                    )
                }

                // jika userDetail tidak ada, maka create
                return UserDetail.create({ firstName, lastName, phoneNumber, dateOfBirth, address, UserId: id })
            })
            .then(_ => {
                res.redirect(`/user-details/${id}`)
            })
            .catch(err => res.send(err))
    }

    static roleFindAll(req, res) {

        Role.findAll()
            .then(roles => {
                res.render('roles/role', { roles })
            })
            .catch(err => res.send(err))
    }

    static roleAdd(req, res) {
        const { error } = req.query
        res.render('roles/roleAdd', { error })
    }

    static roleCreate(req, res) {
        const { name } = req.body

        Role.create({ name })
            .then(_ => res.redirect('/roles'))
            .catch(err => res.send(err))
    }

    static roleEdit(req, res) {
        const { id } = req.params
        const { error } = req.query

        Role.findByPk(id)
            .then(role => {
                res.render('roles/roleEdit', { error, role })
            })
            .catch(err => res.send(err))
    }

    static roleUpdate(req, res) {
        const { id } = req.params
        const { name } = req.body

        Role.update({ name }, { where: { id } })
            .then(_ => res.redirect('/roles'))
            .catch(err => res.send(err))
    }

    static roleDestroy(req, res) {
        const { id } = req.params

        Role.destroy({ where: { id } })
            .then(_ => res.redirect('/roles'))
            .catch(err => res.send(err))
    }

    static userFindAll(req, res) {

        User.findAll({ include: Role })
            .then(users => {
                res.render('users/user', { users })
            })
            .catch(err => res.send(err))
    }

    static userAdd(req, res) {
        const { error } = req.query
        Role.findAll()
            .then(roles => res.render('users/userAdd', { error, roles }))
            .catch(err => res.send(err))
    }

    static userCreate(req, res) {
        const { username, email, password, RoleId } = req.body

        User.create({ username, email, password, RoleId })
            .then(_ => res.redirect('/users'))
            .catch(err => res.send(err))
    }

    static userEdit(req, res) {
        const { id } = req.params
        const { error } = req.query
        let dataRoles

        Role.findAll()
            .then(roles => {
                dataRoles = roles
                return User.findByPk(id)
            })
            .then(user => res.render('users/userEdit', { error, dataRoles, user }))
            .catch(err => res.send(err))
    }

    static userUpdate(req, res) {
        const { id } = req.params
        const { username, email, RoleId } = req.body

        User.update({ username, email, RoleId },
            {
                where: { id },
                // individualHooks: true, // property hooks beforeUpdate for password
            }
        )
            .then(_ => res.redirect('/users'))
            .catch(err => res.send(err))
    }

    static userDestroy(req, res) {
        const { id } = req.params

        User.destroy({ where: { id } })
            .then(_ => res.redirect('/users'))
            .catch(err => res.send(err))
    }
}

module.exports = UserController