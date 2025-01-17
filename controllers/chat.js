const chatRouter = require('express').Router()
const chatService = require('../services/chatService');
const { verifyToken } = require('../utils/token-manager.js')
const carritoService = require('../services/carritoService.js')
const userService = require('../services/userService.js')

chatRouter.post('/', verifyToken, async (request, response, next) => {
  try {
    const { message } = request.body
    const user = await userService.getUserByIdWithChats(response.locals.jwtData.id);
    if (!user) {
      return response.status(401).json({ message: "User not registered or token malfunctioned" })
    }
    if (user.chats.length == 0) {
      return response.status(401).json({ message: "User chats not initialized" })
    }
    const savedUserChat = await chatService.saveChatByUser(message)
    const lastInteraction = user.chats[user.chats.length - 1].lastInteraction || null;
    const userCarrito = await carritoService.getUserCarritoNotConfirmed(user)
    const respuesta = await chatService.procesarMensaje(message, lastInteraction, userCarrito, user.nombre);
    const savedSystemChat = await chatService.saveChatBySystem(respuesta.mensaje, respuesta.intencion)
    user.chats.push(savedUserChat, savedSystemChat);
    await user.save()

    return response.status(201).json(user.chats);
  } catch (error) {
    response.status(500).json({ message: "ERROR", cause: error.message });
  }
})

chatRouter.get('/', verifyToken, async (request, response, next) => {
  try {
    const user = await userService.getUserByIdWithChats(response.locals.jwtData.id);
    if (!user) {
      return response.status(401).json({ message: "User not registered or token malfunctioned" })
    }
    if (user.chats.length == 0) {
      const savedChat = await chatService.saveChatBySystem(`Bienvenido a ArmacaSushi ${user.nombre}
    Por favor ingrese la opción deseada:
    1. Ver menú
    2. Hacer un pedido
    3. Consultar horarios`, "welcome")
      user.chats.push(savedChat)
      await user.save()
    }
    return response.status(200).json(user.chats);
  } catch (error) {
    response.status(500).json({ message: "ERROR", cause: error.message });
  }
})

module.exports = chatRouter