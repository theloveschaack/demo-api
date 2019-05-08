let httpError = require('http-errors')
let jwt = require('jsonwebtoken')
let config = require('../config')

exports.verifyToken = (req, res, next) => {
  let token = req.headers[config.app.tokenHeader]

  if(!token) {
    return next(httpError(403, 'Not allowed'))
  }

  jwt.verify(token, config.app.secret, (error, claims) => {
    if(error) {
      return next(httpError(403, 'Invalid token'))
    }
    req.claims = claims
    next()
  })

}
