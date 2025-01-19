const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const validators = require('../utils/validators.js')
const { createToken, verifyToken, isAdmin } = require('../utils/token-manager.js')
const userService = require('../services/userService.js')
const config = require('../utils/config.js')

usersRouter.post('/login', validators.validate(validators.loginValidator), async (request, response, next) => {
  try {
  const { email, password } = request.body

  const user = await userService.getUserByEmail({ email })

  if (!user) {
    return response.status(401).send("email is not registered")
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash)

  if (!isPasswordCorrect){
    return response.status(403).json("Incorrect password")
  }

  const token = createToken(user._id.toString(), user.email, user.admin, "1d")
  const expires = new Date();
  expires.setDate(expires.getDate() + 1)
  
  response.cookie(config.COOKIE_NAME, token, {path: "/", domain: config.COOKIE_DOMAIN, expires, httpOnly: true , signed: true, secure: false,})
  response.status(200).json({
    username: user.email,
  })

  } catch (error) {
    return response.status(500).json({ meessage: "ERROR", cause: error.message})
  }
})

usersRouter.post('/signup', validators.validate(validators.signUpValidator), async (request, response, next) => {
  try {
  const { nombre, email, password } = request.body

  const existingUser = await userService.getUserByEmail({ email })

  if (existingUser) {
    return response.status(401).send("User already registered");
  }
  
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const savedUser = await userService.saveUser(nombre, email, passwordHash)

  response.status(201).json(savedUser.id)
} catch (error) {
  return response.status(500).json({ meessage: "ERROR", cause: error.message})
}
})

usersRouter.post('/logout', verifyToken, async (request, response, next) => {
  try {
    const user = await userService.getUserById(response.locals.jwtData.id);
    if (!user) {
      return response.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== response.locals.jwtData.id) {
      return response.status(401).send("Permissions didn't match");
    }

    response.clearCookie("auth_token", {
      httpOnly: true,
      domain: "localhost",
      signed: true,
      path: "/",
    });

    return response.status(200).json({ message: "OK", nombre: user.nombre, email: user.email });
  } catch (error) {
    return response.status(500).json({ message: "ERROR", cause: error.message });
  }
} )

usersRouter.patch('/:id', validators.validate(validators.patchValidator),  verifyToken, isAdmin, async (request, response, next) => {
  try {

  
    const { id } = request.params;
    const { nombre, email, admin } = request.body;
    const user = await userService.getUserById(id);
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }

    if (typeof admin !== "undefined") {
      if (typeof admin !== "boolean") {
        return response.status(400).json({ error: "'admin' must be a boolean" });
      }
      user.admin = admin;
    }
    if (typeof nombre !== "undefined") {
      user.nombre = nombre;
    }
    if (typeof email !== "undefined") {
      user.email = email
    }

    await user.save();

    return response.status(204).json()
  } catch (error) {
    return response.status(500).json({ message: "ERROR", cause: error.message });
  }
} )

/* usersRouter.post('/signupadmin', validators.validate(validators.signUpValidator), async (request, response, next) => {
  try {
  const { nombre, email, password } = request.body

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return response.status(401).send("User already registered");
  }
  
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    nombre,
    email,
    passwordHash,
    admin: true
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser.id)
} catch (error) {
  return response.status(500).json({ meessage: "ERROR", cause: error.message})
}
}) */

module.exports = usersRouter