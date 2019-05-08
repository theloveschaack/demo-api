let express = require('express')
let bodyParser = require('body-parser')
let config = require('./config')

// routes
let userRoute = require('./routes/users')
let publicRoute = require('./routes/public')

let app = express()
app.use(bodyParser.json())
app.use('/users', userRoute)
app.use('/', publicRoute)

app.listen(config.server.port, () => {
  console.log(`${config.app.name} started at ${config.server.host}:${config.server.port}`)
})
