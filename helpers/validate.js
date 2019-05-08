let config = require('../config')

let validEmail = (email) => {
  let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(String(email.toLowerCase()))
}

let validPassword = (password) => {
  return (String(password).length >= config.app.minPasswordLength)
}

let isNullEmptyOrWhiteSpace = (str) => {
  if(str == null) {
    return false
  }
  if(!(/\S/.test(String(str)))) {
      return false
  }
  return true
}

exports.validateNewUser = (body) => {
  return (validEmail(body.email) && validPassword(body.password) && isNullEmptyOrWhiteSpace(body.firstName) && isNullEmptyOrWhiteSpace(body.lastName));
}

exports.validateImage = (img) => {
  return (config.app.allowedImageTypes.indexOf(img.mimetype) > -1);
}
