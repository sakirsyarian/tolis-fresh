'use strict'

const path = require('path')
const router = require('./routes')
const express = require('express')
const session = require('express-session')
const app = express()

const PORT = process.env.PORT || 3000;
const oneDay = 1000 * 60 * 60 * 24

app.use(express.static(path.join(__dirname, '/public')))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(session({
    secret: 'sakirsyarian',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: oneDay,
        secure: false,
        sameSite: true,
    }
}))

app.use(router)

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})