const users = require('./api/v1/users')
const usersV2 = require('./api/v2/users')

const profile = require('./api/v2/profile')
const bankAccount = require('./api/v2/bankAccount')
const tipeTransaksi = require('./api/v2/tipeTransaksi')
const transaction = require('./api/v2/transaction')
const auth = require('./api/v2/auth')
const media = require('./api/v2/media')

module.exports = {
    users,
    usersV2, 
    profile,
    bankAccount, tipeTransaksi, transaction, auth, media
}