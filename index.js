//HTTP RESPONSE

require('dotenv').config()

const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const flash = require('express-flash')
const session = require('express-session')
const routers = require('./router')
const swaggerJSON = require('./openapi.json')
const swaggerUI = require('swagger-ui-express')
const passport = require('./utils/passport')

//untuk handle post req.body (middleware)
app.use(express.json())
app.use(express.urlencoded({ extended:false })) //req.body untuk form data

//saveUnitialized untuk 
//session digunakan untuk fullstack di express js, tp kalau backend pakai token aja 
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
}))

app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.set("view engine", "ejs") //register sbg view engine flash
app.set("views", path.join(__dirname, './app//view'))

app.use(routers)
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerJSON))

app.get('/', (req, res) => res.send('Hello World'))
app.listen(port, () => 
    console.log(`Example app listening at http://localhost:${port}`))

module.exports = app