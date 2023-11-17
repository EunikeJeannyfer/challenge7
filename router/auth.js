const express = require('express')
const router = express.Router()
const controller = require('../app/controller')
const passport = require('../utils/passport')
const { auth } = require('../utils/jwt')

const passportOAUTH = require('../utils/oauth')

//auth
router.post('/v2/auth/login', controller.auth.login)
router.post('/v2/auth/register', controller.auth.register)
router.get('/v2/auth/whoami',auth, controller.auth.whoami)

//view
router.get('/register', (req, res) => {
    res.render('register.ejs')
})
router.post('/register', controller.auth.registerForm)

router.get('/login', (req, res) => {
    res.render('login.ejs')
})
router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
}))

router.get('/auth/google', 
    passportOAUTH.authenticate('google', {
        scope: ['profile', 'email']
    })
)

router.get('/auth/google/callback', 
    passportOAUTH.authenticate('google', {
        failureRedirect: '/login',
        session: false
    }), controller.auth.oauth
)

module.exports = router

