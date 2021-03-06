// importing npm packages
const colors = require('colors')
const express = require('express')
const morgan = require('morgan')
const swaggerUI = require('swagger-ui-express')

// Loading env variables
require('dotenv').config({ path: './config/config.env' })

// importing middlewares
const errorHandler = require('./middlewares/error')

// importing routers
const repository = require('./routes/repository')
const user = require('./routes/user')
const auth = require('./routes/auth')

// Loading env variables
require('dotenv').config({ path: './config/common.env' })
require('dotenv').config({ path: require('./utility/configPath')() })

// Database Connection
if (process.env.NODE_ENV !== 'test') {
  const connectDB = require('./config/db')
  connectDB()
}

const app = express()

// production mode
if (process.env.NODE_ENV === 'production') colors.disable()

// development mode
if (process.env.NODE_ENV === 'development') {
  console.log('\nDevelopment Mode'.underline.yellow)
  app.use(morgan('dev')) // Logging requests
}

// body parser
app.use(express.json())

// Logging requests
if (app.get('env') === 'development') {
  app.use(morgan('dev'))
}

app.get('/hello', (req, res) => res.status(200).send('Hello World'))

// using routers
app.use('/xgithub', auth)
app.use('/xgithub', repository)
app.use('/xgithub', user)

// error handling middleware
app.use(errorHandler)

// server port
const PORT = process.env.PORT || 3000

const server = app.listen(
  PORT,
  console.log(`\n Server running on port ${PORT} `.bgGreen.black)
)

module.exports = server
