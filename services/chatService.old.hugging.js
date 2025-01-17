const { HfInference } = require('@huggingface/inference');

const hf = new HfInference('hf_');
const Menu = require('../models/menu.js')


async function clasificarIntencion(mensaje) {
  try {
    const result = await hf.zeroShotClassification({
      model: 'facebook/bart-large-mnli',
      inputs: mensaje,
      parameters: {
        candidate_labels: ["horarios_atencion", "comidas_menu"]
      }
    });
    return result[0].labels[0];
  } catch (error) {
    console.error('Error al clasificar la intención:', error);
    return null;
  }
}


async function procesarMensaje(mensaje, lastInteraction) {

  const intencion = await clasificarIntencion(mensaje); 
  console.log(intencion)
  switch (intencion) {
    case "horarios_atencion":
      respuesta = {
        intencion,
        mensaje: "Nuestro restaurante está abierto de lunes a viernes de 12:00 PM a 10:00 PM, y los fines de semana de 1:00 PM a 11:00 PM.",
        productos: []
      };
      break;
    case "comidas_menu":
      const menu = await Menu.find()
      const mensaje = menu.map((item) => item.nombre).join(', ');
      respuesta = {
        intencion,
        mensaje: `Nuestro menú incluye los siguientes rolls: ${mensaje}. ¿Te gustaría ordenar algo?`,
        productos: []
      }
      break;
  }


  return respuesta
}

module.exports = { procesarMensaje }