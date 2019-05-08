let mysql = require('mysql2')
let config = require('../config')

let connection = mysql.createConnection({
    host: config.database.host,
    database: config.database.name,
    port: config.database.port,
    user: config.database.username,
    password: config.database.password
})

module.exports = connection
