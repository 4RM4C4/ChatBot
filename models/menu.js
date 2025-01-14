const mongoose = require('mongoose')


const menuSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true},
  categoria: { type: String, required: true},
  ingredientes: { type: [String], required: true },
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


module.exports = mongoose.model('Menu', menuSchema)