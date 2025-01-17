const Carrito = require('../models/carrito.js')

async function getUserCarritoNotConfirmed(user) {
  const carrito = await Carrito.findOne({
    usuario: user,
    completado: false,
  }).populate('pedido.menu')
  if (!carrito) {
    const nuevoCarrito = new Carrito({
      usuario: user,
    });
    await nuevoCarrito.save()

    return nuevoCarrito
  }
  return carrito
}

async function confirmCarrito(carrito) {
  carrito.completado = true;
  carrito.dateCompletado = new Date();
  await carrito.save()
  return carrito
}

async function cancelCarrito(carrito) {
  carrito.pedido = [];
  await carrito.save()
  return carrito
}



  module.exports = { getUserCarritoNotConfirmed , confirmCarrito , cancelCarrito }