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

menuRouter.post('/setMultipleMenus', verifyToken, isAdmin, async (request, response, next) => {
    try {
      const menus = request.body;

      if (!Array.isArray(menus) || menus.length === 0) {
        return response.status(400).json({ message: 'Debe enviar un array de menús.' });
      }

      const resultados = await Promise.all(
        menus.map(async (menu) => {
          const { nombre, categoria, ingredientes } = menu;

          if (!nombre || !categoria || !ingredientes) {
            return { nombre, error: 'Faltan campos obligatorios.' };
          }

          const existingMenu = await Menu.findOne({ nombre });
          if (existingMenu) {
            return { nombre, error: `El menú ${nombre} ya se encuentra está registrado.` };
          }

          const newMenu = new Menu({
            nombre,
            categoria,
            ingredientes,
          });

          const savedMenu = await newMenu.save();
          return { nombre, id: savedMenu.id };
        })
      );

      const errores = resultados.filter((res) => res.error);
      const exitosos = resultados.filter((res) => !res.error);

      response.status(201).json({
        message: 'Procesamiento completo.',
        exitosos,
        errores,
      });
    } catch (error) {
      response.status(500).json({ message: 'Error en el servidor.', cause: error.message });
    }
  }
);

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