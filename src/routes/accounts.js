const express = require('express')
const router = express.Router()
const controller = require('../controllers/controller')
const isAuthenticatedCookie = require('../middleware/authenticator')

router.get('/accounts', isAuthenticatedCookie, controller.getAccounts)
router.post('/accounts', isAuthenticatedCookie, controller.postAccounts)

module.exports = router
