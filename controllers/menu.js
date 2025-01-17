const menuRouter = require('express').Router()
const Menu = require('../models/menu.js')

const validators = require('../utils/validators.js')
const { verifyToken, isAdmin  } = require('../utils/token-manager.js')

menuRouter.get('/getAllMenus', verifyToken, async (request, response) => {
  try {
    const menu = await Menu.find()
    response.json(menu)
  } catch (error) {
    response.status(500).json({ message: "ERROR", cause: error.message });
  }
})

menuRouter.post('/setMenu', verifyToken, isAdmin, validators.validate(validators.menuValidator), async (request, response, next) => {
  try {
  const { nombre, categoria, ingredientes } = request.body

  const existingMenu = await Menu.findOne({ nombre });

  if (existingMenu) {
    return response.status(401).send("Menu already registered");
  }
  

  const menu = new Menu({
    nombre,
    categoria,
    ingredientes,
  })

  const savedMenu = await menu.save()

  response.status(201).json(savedMenu.id)
} catch (error) {
    return response.status(500).json({ meessage: "ERROR", cause: error.message})
}
})

menuRouter.delete('/delMenu', verifyToken, isAdmin, validators.validate(validators.menuDeleteValidator), async (request, response, next) => {
  try {
  const { nombre } = request.body

  const existingMenu = await Menu.findOne({ nombre });

  if (!existingMenu) {
    return response.status(404).send("Menu not found");
  }

  await Menu.deleteOne(existingMenu)

  response.status(204)
} catch (error) {
    return response.status(500).json({ meessage: "ERROR", cause: error.message})
}
})

module.exports = menuRouter