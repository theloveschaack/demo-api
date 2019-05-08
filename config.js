let config = {}

config.app = {
  name: 'User API',
  defaultImageEndpoint: '/images/default.jpeg',
  secret: 'S3cr3t!#',
  saltRounds: 10,
  tokenHeader: 'x-access-token',
  userImagePath: '/opt/images/',
  minPasswordLength: 8,
  allowedImageTypes: ['image/png', 'image/jpeg']
}

config.server = {
  host: 'http://localhost',
  port: 3000
}

config.database = {
  host: 'localhost',
  name: 'users',
  port: 3306,
  username: 'db_user',
  password: 'db_pass'
}

module.exports = config
