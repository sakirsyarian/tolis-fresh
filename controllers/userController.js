'use strict'

const fs = require('fs')
const chalk = require('chalk')
const path = require('path')

const { UserDetail, User, Role, Setting } = require('../models')

const baseUrl = 'public/uploads/'

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
        let filename

        UserDetail.findByPk(id, {
            include: User
        })
            .then((userDetail) => {
                filename = userDetail.image
                if (req.file) filename = req.file.filename

                fs.access(`./${baseUrl}${userDetail.image}`, fs.constants.F_OK, (err) => {
                    if (err) {
                        console.log(chalk.red('file does not exist - error'));
                        return;
                    }

                    const checkAvailability = path.extname(`./${baseUrl}${userDetail.image}`)
                    if (!checkAvailability) {
                        console.log(chalk.red('file does not exist - check available'));
                        return
                    }

                    console.log(chalk.green(`There is a ${userDetail.image} file`));
                    if (userDetail.image !== filename) {
                        fs.unlink(`${baseUrl}${userDetail.image}`, function (err) {
                            if (err) throw err;
                            console.log(chalk.red(`File ${userDetail.image} has been deleted!`));
                        });
                    }
                });

                // jika userDetail ada, maka update
                if (userDetail) {
                    UserDetail.update(
                        { firstName, lastName, phoneNumber, image: filename, dateOfBirth, address },
                        { where: { id } }
                    )

                    return User.update(
                        { username, email },
                        { where: { id } }
                    )
                }

                // jika userDetail tidak ada, maka create
                return UserDetail.create({ firstName, lastName, phoneNumber, image: filename, dateOfBirth, address, UserId: id })
            })
            .then(_ => {
                res.redirect(`/user-details/${id}`)
            })
            .catch(err => {
                if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
                    const message = err.errors.map(el => el.message)
                    return res.redirect(`/user-details/edit/${id}?error=${message}`)
                }

                res.send(err)
            })
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

    static settingEdit(req, res) {
        const { userId } = res.locals
        let dataMenu = {}
        // res.send(res.locals)

        User.findOne({ where: { id: userId }, include: UserDetail })
            .then(user => {
                dataMenu.user = user
                return Setting.findByPk(1)
            })
            .then(setting => res.render('setting', { ...dataMenu, setting }))
            .catch(err => res.send(err))
    }

    static settingUpdate(req, res) {
        // res.send(req.files)
        let filenameOne, filenameTwo

        Setting.findByPk(1)
            .then(setting => {
                filenameOne = setting.bannerOne

                if (req.files.bannerOne) filenameOne = req.files.bannerOne[0].filename
                if (req.files.bannerTwo) filenameTwo = req.files.bannerTwo[0].filename

                fs.access(`./${baseUrl}${setting.bannerOne}`, fs.constants.F_OK, (err) => {
                    if (err) {
                        console.log(chalk.red('file does not exist - error'));
                        return;
                    }

                    const checkAvailability = path.extname(`./${baseUrl}${setting.bannerOne}`)
                    if (!checkAvailability) {
                        console.log(chalk.red('file does not exist - check available'));
                        return
                    }

                    console.log(chalk.green(`There is a ${setting.bannerOne} file`));
                    if (setting.bannerOne !== filenameOne) {
                        fs.unlink(`${baseUrl}${setting.bannerOne}`, function (err) {
                            if (err) throw err;
                            console.log(chalk.red(`File ${setting.bannerOne} has been deleted!`));
                        });
                    }
                });

                fs.access(`./${baseUrl}${setting.bannerTwo}`, fs.constants.F_OK, (err) => {
                    if (err) {
                        console.log(chalk.red('file does not exist - error'));
                        return;
                    }

                    const checkAvailability = path.extname(`./${baseUrl}${setting.bannerTwo}`)
                    if (!checkAvailability) {
                        console.log(chalk.red('file does not exist - check available'));
                        return
                    }

                    console.log(chalk.green(`There is a ${setting.bannerTwo} file`));
                    if (setting.bannerTwo !== filenameTwo) {
                        fs.unlink(`${baseUrl}${setting.bannerTwo}`, function (err) {
                            if (err) throw err;
                            console.log(chalk.red(`File ${setting.bannerTwo} has been deleted!`));
                        });
                    }
                });

                return Setting.update({ bannerOne: filenameOne, bannerTwo: filenameTwo }, { where: { id: 1 } })
            })
            .then(_ => res.redirect('/settings'))
            .catch(err => res.send(err))
    }
}

module.exports = UserController