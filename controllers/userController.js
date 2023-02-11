'use strict'

const { UserDetail, User } = require('../models')

class UserController {
    static userDetailFindAll(req, res) {
        const { id } = req.params
        const { username } = req.session

        UserDetail.findByPk(id, {
            include: User
        })
            .then(userDetail => {
                res.render('profile', { id, username, userDetail })
            })
            .catch(err => res.send(err))
    }

    static userDetailEdit(req, res) {
        const { id } = req.params
        const { error } = req.query

        UserDetail.findByPk(id)
            .then(userDetail => {
                res.render('profileUpdate', { id, userDetail, error })
            })
            .catch(err => res.send(err))
    }

    static userDetailUpdate(req, res) {
        const { id } = req.params
        const { firstName, lastName, phoneNumber, dateOfBirth, address } = req.body

        UserDetail.findByPk(id)
            .then((userDetail) => {

                if (userDetail) {
                    return UserDetail.update({ firstName, lastName, phoneNumber, dateOfBirth, address }, {
                        where: {
                            id
                        }
                    })
                }

                return UserDetail.create({ firstName, lastName, phoneNumber, dateOfBirth, address, UserId: id })
            })
            .then(_ => res.redirect(`/user-details/${id}`))
            .catch(err => res.send(err))
    }
}

module.exports = UserController