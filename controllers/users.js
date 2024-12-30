const usersRouter = require('express').Router()
const User = require('../models/user.js')

usersRouter.get('/', async (request, response) => {
  const users = await User.find()
  response.json(users)
})

module.exports = usersRouter