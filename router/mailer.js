const { sendMail, sendMailHTML } = require('../utils/mailer')
const express = require('express')
const router = express.Router()
const ejs = require('ejs')
const { JWTsign } = require('../utils/jwt')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

// const BASE_URL = process.env.BASE_URL

router.post('/registerMailer', (req,res) => {
    const {email, password, name} = req.body
    // sendMail(email, `Halo ${name}`,
    //     `Terima kasih sudah mendaftar di aplikasi kami! 
    //     Silahkan klik link berikut untuk verifikasi email.`
    // )

    const user = prisma.user.findFirst({
        where: { email }
    })

    const url = req.protocol+"://"+req.headers.host
    const token = JWTsign(user)

    ejs.renderFile(__dirname + "/../templates/register.ejs", 
        { 
        // name: name, 
        url: 'http://localhost:3000/resetPassword/' + token 
        }, 
        function (err, data) {
        if (err) {
        console.log(err);
        } else {
        sendMailHTML(email, `Reset Password`, data)
        }
    })
    
    res.status(200).json({
        status: 'ok',
        message: `Berhasil Register! silahkan cek email untuk verifikasi`,
        url: url
    })
})

module.exports = router