const mongoose = require('mongoose')
const crypto = require('crypto')

const chatSchema = new mongoose.Schema({
  id: { type: String, default: crypto.randomUUID()},
  role: { type: String, required: true},
  content: { type: String, required: true},
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


module.exports = mongoose.model('Chat', chatSchema)