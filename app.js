const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const usersRouter = require('./controllers/users')
const menuRouter = require('./controllers/menu')
const chatRouter = require('./controllers/chat')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser(config.COOKIE_SECRET))
app.use(morgan("dev"))
app.use(middleware.requestLogger)
app.use('/api/users', usersRouter)
app.use('/api/menu', menuRouter)
app.use('/api/chat', chatRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app