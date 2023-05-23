'use strict'

const fs = require('fs')
const chalk = require('chalk')
const path = require('path')

const { Client } = require('../models')

const baseUrl = 'public/uploads/'

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
        let filename

        if (req.file) filename = req.file.filename

        Client.create({ name, image: filename, address, district, city, province, zipCode })
            .then(_ => res.redirect('/clients'))
            .catch(err => {
                if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
                    const message = err.errors.map(el => el.message)
                    return res.redirect(`/clients/add?error=${message}`)
                }

                res.send(err)
            })
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
        const { name, address, district, city, province, zipCode } = req.body
        let filename

        Client.findByPk(id)
            .then(client => {
                filename = client.image
                if (req.file) filename = req.file.filename

                fs.access(`./${baseUrl}${client.image}`, fs.constants.F_OK, (err) => {
                    if (err) {
                        console.log(chalk.red('file does not exist - error'));
                        return;
                    }

                    const checkAvailability = path.extname(`./${baseUrl}${client.image}`)
                    if (!checkAvailability) {
                        console.log(chalk.red('file does not exist - check available'));
                        return
                    }

                    console.log(chalk.green(`There is a ${client.image} file`));
                    if (client.image !== filename) {
                        fs.unlink(`${baseUrl}${client.image}`, function (err) {
                            if (err) throw err;
                            console.log(chalk.red(`File ${client.image} has been deleted!`));
                        });
                    }
                });

                return Client.update({ name, address, district, city, province, zipCode, image: filename }, { where: { id } })
            })
            .then(_ => res.redirect('/clients'))
            .catch(err => {
                if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
                    const message = err.errors.map(el => el.message)
                    return res.redirect(`/clients/edit/${id}?error=${message}`)
                }

                res.send(err)
            })
    }

    static clientDestroy(req, res) {
        const { id } = req.params
        let dataClient

        Client.findByPk(id)
            .then(client => {
                dataClient = client
                return Client.destroy({ where: { id } })
            })
            .then(_ => {
                fs.access(`./${baseUrl}${dataClient.image}`, fs.constants.F_OK, (err) => {
                    if (err) {
                        console.log(chalk.red('file does not exist - error'));
                        return;
                    }

                    const checkAvailability = path.extname(`./${baseUrl}${dataClient.image}`)
                    if (!checkAvailability) {
                        console.log(chalk.red('file does not exist - check available'));
                        return
                    }

                    console.log(chalk.green(`There is a ${dataClient.image} file`));
                    fs.unlink(`${baseUrl}${dataClient.image}`, function (err) {
                        if (err) throw err;
                        console.log(chalk.red(`File ${dataClient.image} has been deleted!`));
                    });
                });

                res.redirect('/clients')
            })
            .catch(err => res.send(err))
    }
}

module.exports = ClientController