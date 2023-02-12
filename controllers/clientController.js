'use strict'

const { Client } = require('../models')

class ClientController {
    static clientFindAll(req, res) {

        Client.findAll()
            .then(clients => {
                res.render('clients/client', { clients })
            })
            .catch(err => res.send(err))
    }

    static clientAdd(req, res) {
        const { error } = req.query
        res.render('clients/clientAdd', { error })
    }

    static clientCreate(req, res) {
        const { name, image, address, district, city, province, zipCode } = req.body

        Client.create({ name, image, address, district, city, province, zipCode })
            .then(_ => res.redirect('/clients'))
            .catch(err => res.send(err))
    }

    static clientEdit(req, res) {
        const { id } = req.params
        const { error } = req.query

        Client.findByPk(id)
            .then(clientOne => {
                res.render('clients/clientEdit', { error, clientOne })
            })
            .catch(err => res.send(err))
    }

    static clientUpdate(req, res) {
        const { id } = req.params
        const { name, image, address, district, city, province, zipCode } = req.body

        Client.update({ name, image, address, district, city, province, zipCode }, { where: { id } })
            .then(_ => res.redirect('/clients'))
            .catch(err => res.send(err))
    }

    static clientDestroy(req, res) {
        const { id } = req.params

        Client.destroy({ where: { id } })
            .then(_ => res.redirect('/clients'))
            .catch(err => res.send(err))
    }
}

module.exports = ClientController