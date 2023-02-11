'use strict'

const router = require('./routes')
const express = require('express')
const session = require('express-session')
const app = express()
const port = 3000
const oneHour = 1000 * 60 * 60

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(session({
    secret: 'sakirsyarian',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: oneHour,
        secure: false,
        sameSite: true,
    }
}))

app.use(router)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})