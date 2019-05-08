let express = require('express')
let httpError = require('http-errors')
let fileUpload = require('express-fileupload')
let config = require('../config')
let validate = require('../helpers/validate')
let userService = require('../services/userService')
let auth = require('../helpers/auth')
let userRoute = express.Router()


userRoute.use(auth.verifyToken)   // private routes
userRoute.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp'
}))

// get user info
userRoute.get('/:id', (req, res, next) => {
  if(req.params.id != req.claims.userInfo.userId) {
    return next(httpError(403, 'Not Allowed'))
  }

  userService.getUserInfo(req.params.id)
    .then(function(result) {
      res.json(result)
      next()
    })
    .catch(function(error) {
      console.error(error)
      return next(error)
    })
})

// upload image
userRoute.post('/:id/image', (req, res, next) => {
  if(req.params.id != req.claims.userInfo.userId) {
    return next(httpError(403, 'Not Allowed'))
  }
  if(Object.keys(req.files).length == 0) {
    return next(httpError(400, 'An image is required'))
  }
  if(!validate.validateImage(req.files.profilePic)) {
    return next(httpError(400, 'Invalid image type'))
  }

  userService.saveProfilePic(req.claims.userInfo.userId, req.files.profilePic)
    .then(function() {
      res.json({'msg': 'Image uploaded successfully'})
      next()
    })
    .catch(function(error) {
      console.log(error)
      return next(error)
    })
})


module.exports = userRoute
