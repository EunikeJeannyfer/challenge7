//router --> kita buat sendiri untk handle endpoint (API)
//tp kalau middleware ini handle sblm masuk endpoint (auth, json, error handler, logging)
    //contoh middleware itu ada app.use(express.json()) krn dia handle inputannya dulu 

const express = require('express')
const router = express.Router()
// untuk memanggil handler yg ad di controller
// const { get, getById, create, destroy, update } = require('../app/controller/users')
const controller = require('../app/controller')
const { auth } = require('../utils/jwt')

router.get('/users', controller.users.get)
router.get('/users/:id', controller.users.getById)
router.post('/users', controller.users.create)
router.delete('/users/:id', controller.users.destroy)
router.put('/users/:id', controller.users.update)

router.get('/v2/users', controller.usersV2.get)
router.get('/v2/users/:id', controller.usersV2.getById)
router.put('/v2/users/:id', controller.usersV2.update)
router.post('/v2/users', controller.usersV2.create)
router.delete('/v2/users/:id', controller.usersV2.destroy)

router.put('/v2/profile/:id', controller.profile.update)
router.delete('/v2/profile/:id', controller.profile.destroy)

router.get('/v2/accounts', controller.bankAccount.get)
router.get('/v2/accounts/:id', controller.bankAccount.getById)
router.put('/v2/accounts/:id', controller.bankAccount.update)
router.post('/v2/accounts', controller.bankAccount.create)
router.delete('/v2/accounts/:id', controller.bankAccount.destroy)

router.get('/v2/type', controller.tipeTransaksi.get)
router.get('/v2/type/:id', controller.tipeTransaksi.getById)
router.put('/v2/type/:id', controller.tipeTransaksi.update)
router.post('/v2/type', controller.tipeTransaksi.create)
router.delete('/v2/type/:id', controller.tipeTransaksi.destroy)

router.get('/v2/transaction', controller.transaction.get)
router.get('/v2/transaction/:id', controller.transaction.getById)
router.post('/v2/transaction', controller.transaction.deposit)
router.post('/v2/transfer', controller.transaction.transfer)

module.exports = router