const jwt = require('jsonwebtoken')
const { secretKey } = require('../config')

const isAuthenticatedCookie = (req, res, next) => {
  try {
    console.log('Authentication')
    const token = req.cookies.authtoken
    const decodedToken = jwt.verify(token, secretKey)
    console.log('decodedToken', decodedToken)
    req.user = decodedToken
    next()
  } catch (error) {
    console.log(error)
    res.redirect('/login')
  }
}

module.exports = isAuthenticatedCookie
