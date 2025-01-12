const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true},
  chats: [    {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  }],
},
  {
    toJSON: {
      transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
      },
    },
  })


module.exports = mongoose.model('User', userSchema)