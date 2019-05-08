let httpError = require('http-errors')
let jwt = require('jsonwebtoken')
let bcrypt = require('bcrypt')
let shortid = require('shortid')
let config = require('../config')
let db = require('../services/db')

exports.registerUser = (email, password, firstName, lastName) => {
  return new Promise(function(resolve, reject) {
    bcrypt.hash(password, config.app.saltRounds, function(error, hashed) {
      if(error) {
        console.error('Error hashing password', error);
        reject(httpError(500, 'An unknown error occured'))
        return
      }

      let user = {
        id: shortid.generate(),
        email: email,
        firstName: firstName,
        lastName: lastName,
        imageEndpoint: config.app.defaultImageEndpoint
      }

      let q = `INSERT INTO user (id, email, password, firstName, lastName, imageEndpoint) VALUES (?, ?, ?, ?, ?, ?)`
      db.query(q, [user.id, user.email, hashed, user.firstName, user.lastName, user.imageEndpoint], (error) => {
        if(error) {
          if(error.code == 'ER_DUP_ENTRY') {
            reject(httpError(409, 'An account with this email already exists'))
            return
          }
          reject(httpError(500, 'An unknown error occured'))
          return
        }

        resolve(user)
        return
      })
    })
  })
}

exports.getUserInfo = (id) => {
  return new Promise(function(resolve, reject) {
    let q = `SELECT id,email,firstName,lastName,imageEndpoint FROM user WHERE id = ?`
    db.query(q, [id], (error, results) => {
      if(error) {
        console.error('Error getting user info from database', error)
        reject(httpError(500, 'An unknown error occured'))
        return
      }
      else if(results.length < 1) {
        reject(httpError(404, 'User not found'))
        return
      }
      else {
        resolve(results[0])
        return
      }
    })
  })
}

exports.saveProfilePic = (userId, file) => {
  return new Promise(function(resolve, reject) {
    let arr = file.name.split('.')
    let ext = arr[arr.length - 1]
    let fileName = userId + '.' + ext
    let imageLocation = config.app.userImagePath + fileName

    file.mv(imageLocation, (error) => {
      if(error) {
        console.error(`Error saving file to ${imageLocation}`, error)
        reject(httpError(500, 'An unknown error occured'))
        return
      }

      let imageEndpoint = `/images/${fileName}`

      let q = `UPDATE user SET imageEndpoint = ? WHERE id = ?`
      db.query(q, [imageEndpoint, userId], (error) => {
        if(error) {
          console.error('Error updating database', error)
          reject(httpError(500, 'An unknown error occured'))
          return
        }
        resolve()
        return
      })
    })

  })
}

exports.authenticate = (email, password) => {
  return new Promise(function(resolve, reject) {
    let q = `SELECT * FROM user WHERE email = ?`
    db.query(q, [email], (error, results) => {
      if(error) {
        console.error(`Erroring finding user with email, ${email}`, error)
        reject(httpError(500, 'An unknown error occured'))
        return
      }
      else if(results.length < 1) {
        reject(httpError(404, `An account with email, ${email}, does not exist`))
        return
      }

      let user = results[0]
      bcrypt.compare(password, user.password)
        .then(function(result) {
          if(!result) {
            reject(httpError(400, 'Incorrect password'))
            return
          }
          let payload = {
            userInfo: {
              userId: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              imageEndpoint: user.imageEndpoint
            }
          }
          resolve({ token: jwt.sign(payload, config.app.secret) })
          return
        })
        .catch(function(error) {
          console.log('Error in bcrypt compare', error)
          reject(httpError(500, 'An unknown error occured'))
          return
        })
    })
  })
}
