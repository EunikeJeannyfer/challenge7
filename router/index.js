//sebagai main dr folder (semua di set disini)

const express = require('express')
const router = express.Router();

const users = require('./users')
const auth = require('./auth')
const media = require('./media')
const mailer = require('./mailer')

router.use(users)
router.use(auth)
router.use(media)
router.use(mailer)

module.exports = router 