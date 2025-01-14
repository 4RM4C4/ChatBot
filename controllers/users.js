const usersRouter = require('express').Router()
const User = require('../models/user.js')
const bcrypt = require('bcrypt')
const validators = require('../utils/validators.js')
const { createToken, verifyToken  } = require('../utils/token-manager.js')

usersRouter.get('/getAllUsers', async (request, response) => {
  try {
    const users = await User.find().select('-passwordHash').lean()
    response.json(users)
  } catch (error) {
    response.status(500).json({ message: "ERROR", cause: error.message });
  }
})

usersRouter.post('/login', validators.validate(validators.loginValidator), async (request, response, next) => {
  try {
  const { email, password } = request.body

  const user = await User.findOne({ email })

  if (!user) {
    return response.status(401).send("email is not registered")
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash)

  if (!isPasswordCorrect){
    return response.status(403).json("Incorrect password")
  }

  const token = createToken(user._id.toString(), user.email, "1d")
  const expires = new Date();
  expires.setDate(expires.getDate() + 1)
  
  response.cookie("auth_token", token, {path: "/", domain: "localhost", expires, httpOnly: true , signed: true})
  response.status(200).json({ message: "OK", id: user._id.toString()})

  } catch (error) {
    console.log(error)
    return response.status(500).json({ meessage: "ERROR", cause: error.message})
  }
})

usersRouter.get('/verify', verifyToken, async (request, response, next) => {
  try {
    const user = await User.findById(response.locals.jwtData.id);

   if (!user) {
     return response.status(401).send("Permissions not match")
   }

    return response.status(200).json({ message: "OK", id: user._id.toString()})

  } catch (error) {
    console.log(error)
    return response.status(500).json({ meessage: "ERROR", cause: error.message})
  }
})

usersRouter.post('/singup', validators.validate(validators.singupValidator), async (request, response, next) => {
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
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser.id)
} catch (error) {
  console.log(error)
  return response.status(500).json({ meessage: "ERROR", cause: error.message})
}
})

usersRouter.get('/logout', verifyToken, async (request, response, next) => {
  try {
    const user = await User.findById(response.locals.jwtData.id);
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

    return response.status(200).json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "ERROR", cause: error.message });
  }
} )

module.exports = usersRouter