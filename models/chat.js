const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
  role: { type: String, required: true},
  content: { type: String, required: true},
  lastInteraction: { type: String }
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