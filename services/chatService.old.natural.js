const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const classifier = new natural.BayesClassifier();
const Menu = require('../models/menu.js')
const menuclassifier = new natural.BayesClassifier();

async function inicializarClasificadorMenu() {
  try {
    const menu = await Menu.find(); 
    menu.forEach(item => {
      menuclassifier.addDocument(item.nombre, item.categoria);
      menuclassifier.addDocument(item.ingredientes.join(' '), item.nombre);
    });
    console.log('Clasificador entrenado con el menú.');
  } catch (error) {
    console.error('Error al cargar el menú para entrenar el clasificador:', error.message);
  }

  menuclassifier.train();
  console.log('Clasificador completamente entrenado.');
}

classifier.addDocument('quiero hacer un pedido', 'pedido');
classifier.addDocument('me gustaria ordenar comida', 'pedido');
classifier.addDocument('cancelar pedido', 'cancelar');
classifier.addDocument('quiero 5 rolls de sushi', 'pedido');
classifier.addDocument('quiero agregar 2 rolls de ', 'pedido');
classifier.addDocument('quisiera ordenar algo', 'pedido');
classifier.addDocument('quisiera hacer un pedido', 'pedido');
classifier.addDocument('muestrame el menu', 'menu');
classifier.addDocument('estan abiertos', 'horarios');
classifier.addDocument('a que hora abren', 'horarios');
classifier.addDocument('a que hora cierran', 'horarios');
classifier.addDocument('cuales son sus horarios', 'horarios');
classifier.train();


async function procesarMensaje(mensaje) {
  const intencion = classifier.classify(mensaje); 
  console.log("mensaje: "+mensaje+" Clasificación: "+intencion)
  if (intencion === 'pedido') {
    return `Has ordenado .`;
  } else if (intencion === 'cancelar') {
    return 'Tu pedido ha sido cancelado.';
  } else if (intencion === 'horarios') {
    return 'Nos encontramos abiertos de martes a domingos de 20hs a 01hs.';
  } else {
    return 'Lo siento, no entiendo esa solicitud.';
  }
}



module.exports = { procesarMensaje, inicializarClasificadorMenu };