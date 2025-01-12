const usersRouter = require('express').Router()
const User = require('../models/user.js')
const bcrypt = require('bcrypt')
const validators = require('../utils/validators.js')

usersRouter.get('/', async (request, response) => {
  const users = await User.find().select('-passwordHash').lean()
  response.json(users)
})

usersRouter.post('/singup', validators.validate(validators.singupValidator), async (request, response, next) => {
  const { nombre, email, password } = request.body
  if (password.length >= 6) {
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    nombre,
    email,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser.id)
} else {
  const error = {
    name: "ValidationError",
    message: "User validation failed: password: Path `password` is shorter thn the minimun allowed length (3)"
  }
  next(error)
}
})
module.exports = usersRouter