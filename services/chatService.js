const Menu = require('../models/menu.js')
const CarritoService = require('./carritoService.js')
const Chat = require('../models/chat.js')
const HuggingFaceService = require('./huggingFaceService.js')



async function procesarMensaje(message, lastInteraction, carrito, nombre) {
  const menu = await Menu.find()
  let respuesta
  switch (lastInteraction) {
    case "welcome":
      switch (message) {
        case "1":
          respuesta = {
            intencion: "welcome",
            mensaje: `${nombre} nuestro menú incluye los siguientes rolls:

            ${menu.map((item) => item.nombre).join('\n')}

            Por favor ingrese la opción deseada:

            1. Ver menú
            2. Hacer un pedido
            3. Consultar horarios`,
            productos: [],
          };
          break;
        case "2":
          respuesta = {
            intencion: "pedido",
            mensaje: `${nombre} indique el número del roll que desea ordenar:
              ${menu.map((item, index) => `${index + 1}. ${item.nombre}`).join('\n')}`,
            productos: []
          };
          break;
        case "3":
          respuesta = {
            intencion: "welcome",
            mensaje: `${nombre} nuestro restaurante está abierto de lunes a viernes de 12:00 PM a 10:00 PM
            y los fines de semana de 1:00 PM a 11:00 PM.

            Por favor ingrese la opción deseada:

            1. Ver menú
            2. Hacer un pedido
            3. Consultar horarios`,
            productos: []
          };
          break;
        default:
          const intencion = await HuggingFaceService.clasificarIntencion(message)
          switch (intencion) {
            case "consultar horarios de apertura o cierre del local de comida":
              respuesta = {
                intencion: "welcome",
                mensaje: `${nombre} nuestro restaurante está abierto de lunes a viernes de 12:00 PM a 10:00 PM
                y los fines de semana de 1:00 PM a 11:00 PM.
    
                Por favor ingrese la opción deseada:
    
                1. Ver menú
                2. Hacer un pedido
                3. Consultar horarios`,
                productos: []
              };
              break;
            case "consultar los platos disponibles en el menú del local de comida":
              respuesta = {
                intencion: "welcome",
                mensaje: `${nombre} nuestro menú incluye los siguientes rolls:
    
                ${menu.map((item) => item.nombre).join('\n')}
    
                Por favor ingrese la opción deseada:
    
                1. Ver menú
                2. Hacer un pedido
                3. Consultar horarios`,
                productos: [],
              };
              break;
            case "hacer un pedido o comprar comida del local":
              respuesta = {
                intencion: "pedido",
                mensaje: `${nombre} indique el número del roll que desea ordenar:
                  ${menu.map((item, index) => `${index + 1}. ${item.nombre}`).join('\n')}`,
                productos: []
              };
              break;
            default:
              respuesta = {
              intencion: "welcome",
              mensaje: `Opción no válida. Por favor ingrese una opción:
  
                1. Ver menú
                2. Hacer un pedido
                3. Consultar horarios`,
              productos: [],
            };
            break;
          }
          break;
      }
      break;
    case "pedido":
      const rollIndex = parseInt(message, 10) - 1;
      if (rollIndex >= 0 && rollIndex < menu.length) {
        respuesta = {
          intencion: `roll${rollIndex}`,
          mensaje: `${nombre} has seleccionado el roll "${menu[rollIndex].nombre}". ¿Cuántas piezas deseas?`,
          productos: [],
        };
      } else {
        respuesta = {
          intencion: "pedido",
          mensaje: `Por favor, selecciona un número válido del menú:
            ${menu.map((item, index) => `${index + 1}. ${item.nombre}`).join('\n')}`,
          productos: [],
        };
      }
      break;
    case "confirmar":
      switch (message) {
        case "1":
          respuesta = {
            intencion: "pedido",
            mensaje: `${nombre} indique el número del roll que desea ordenar:

              ${menu.map((item, index) => `${index + 1}. ${item.nombre}`).join('\n')}`,
            productos: []
          };
          break;
        case "2":
          await CarritoService.confirmCarrito(carrito)
          respuesta = {
            intencion: "welcome",
            mensaje: `Gracias ${nombre} su pedido ha sido confirmado, el contenido del mismo es:

              ${carrito.pedido.map((item, index) => `${item.menu.nombre} - ${item.cantidad} piezas`)
                .join('\n')}.

            Gracias por utilizar ArmacaSushi

            Por favor ingrese la opción deseada:

            1. Ver menú
            2. Hacer un pedido
            3. Consultar horarios`,
            productos: []
          };
          break;
          case "3":
            await CarritoService.cancelCarrito(carrito)
            respuesta = {
              intencion: "welcome",
              mensaje: `${nombre} su pedido ha sido cancelado.

              Por favor ingrese la opción deseada:
  
              1. Ver menú
              2. Hacer un pedido
              3. Consultar horarios`,
              productos: []
            };
            break;
        default:
          respuesta = {
            intencion: "welcome",
            mensaje: `Opción no válida. Por favor ingrese una opción:

              1. Ver menú
              2. Hacer un pedido
              3. Consultar horarios`,
            productos: [],
          };
          break;
      }
      break;
    default:
      if (lastInteraction.startsWith("roll")) {
        const rollIndex = parseInt(lastInteraction.replace("roll", ""), 10);
        if (rollIndex >= 0 && rollIndex < menu.length) {
          const cantidad = parseInt(message, 10);
          if (isNaN(cantidad) || cantidad <= 0) {

            respuesta = {
              intencion: lastInteraction,
              mensaje: `Por favor, ingresa una cantidad válida para "${menu[rollIndex].nombre}".`,
              productos: carrito,
            };
          } else {
            const productoExistente = carrito.pedido.find(
              (item) => item.menu.nombre === menu[rollIndex].nombre
            );
            if (productoExistente) {
              productoExistente.cantidad += cantidad;
            } else {
              carrito.pedido.push({ menu: menu[rollIndex], cantidad })
            }
            await carrito.save()
            const carritoMensaje = carrito.pedido
              .map((item) => `${item.menu.nombre} - ${item.cantidad} piezas`)
              .join('\n');
            respuesta = {
              intencion: "confirmar",
              mensaje: `${nombre} se agregaron ${cantidad} piezas de "${menu[rollIndex].nombre}" al carrito. 
              Tu carrito actual contiene:

                ${carritoMensaje}
                
                ¿Te gustaría agregar otro producto?

                1. Agregar otro producto
                2. Confirmar pedido
                3. Cancelar pedido`,
              productos: carrito,
            }
          }
        } else {
          respuesta = {
            intencion: "pedido",
            mensaje: `Opción no válida. Por favor selecciona un número del menú:
              ${menu.map((item, index) => `${index + 1}. ${item.nombre}`).join('\n')}`,
            productos: carrito,
          };
        }
      }
      break;
  }

  return respuesta;
}

async function saveChatByUser(message) {
const userChat = new Chat({ content: message, role: "user" })
return await userChat.save()
}
async function saveChatBySystem(message, intencion) {
  const systemChat = new Chat({ content: message, role: "system", lastInteraction: intencion })
  return await systemChat.save()
}

module.exports = { procesarMensaje, saveChatByUser, saveChatBySystem }