const mongoose = require('mongoose')


const carritoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId,
    ref: 'User'},
  completado: { type: Boolean, required: true, default: false},
  dateCompletado: { type: Date },
  pedido: [
    {
      menu: { type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu', required: true },
      cantidad: { type: Number, required: true, min: 1 },
    }
  ],
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


module.exports = mongoose.model('Carrito', carritoSchema)