let express = require('express')
let httpError = require('http-errors')
let fs = require('fs');
let userService = require('../services/userService')
let validate = require('../helpers/validate')
let config = require('../config')
let publicRoute = express.Router()

// login
publicRoute.post('/login', (req, res, next) => {
  userService.authenticate(req.body.email, req.body.password)
    .then(function(result) {
      res.json(result)
      next()
    })
    .catch(function(error) {
      return next(error)
    })
})

// register user
publicRoute.post('/register', (req, res, next) => {
  if(validate.validateNewUser(req.body)) {
    userService.registerUser(req.body.email, req.body.password, req.body.firstName, req.body.lastName)
      .then(function(result) {
        res.json(result)
        next()
      })
      .catch(function(error) {
        return next(error)
      })
  }
  else {
    return next(httpError(400, 'Invalid user input'))
  }
})

// get image
publicRoute.get('/images/:imageName', (req, res, next) => {
  let filePath = config.app.userImagePath + req.params.imageName;
  fs.readFile(filePath, (error, data) => {
    if(error) {
      return next(httpError(404, `Image not found`))
    }

    res.writeHead(200, { 'Content-Type': 'image/*' })
    res.end(data, 'binary')
    next()
  })
})

module.exports = publicRoute
