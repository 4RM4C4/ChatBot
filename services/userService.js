const User = require('../models/user.js')

async function getAll() {
  return await User.find().select('-passwordHash').lean()
}
async function getUserByEmail(email) {
  return await User.findOne(email)
}

async function getUserById(id) {
  return await User.findById(id);
}

async function getUserByIdWithChats(id) {
  return await User.findById(id).populate('chats');
}

async function saveUser(nombre, email, passwordHash) {
  const user = new User({
    nombre,
    email,
    passwordHash,
  })
  return await user.save()
}





module.exports = { getAll , getUserByEmail , getUserById , saveUser , getUserByIdWithChats  }