const express = require('express')
const router = express.Router()
const controller = require('../controllers/controller')
const isAuthenticatedCookie = require('../middleware/authenticator')

router.get('/bills/:id', isAuthenticatedCookie, controller.getBills)
router.post('/bills', isAuthenticatedCookie, controller.postBill)

module.exports = router
