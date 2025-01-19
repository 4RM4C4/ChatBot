const { HfInference } = require('@huggingface/inference');
const config = require('../utils/config.js')

const hf = new HfInference(config.HUGGINGFACE_KEY);
const Menu = require('../models/menu.js')


async function clasificarIntencion(mensaje) {
  try {
    const candidateLabels = [
      "consultar los horarios de apertura o cierre del restaurante",
      "consultar platos disponibles en el menú del restaurante",
      "hacer un pedido de comida",
      "otro"
    ];
/*     const result = await hf.zeroShotClassification({
      model: 'facebook/bart-large-mnli',
      inputs: mensaje,
      parameters: {
        candidate_labels: candidateLabels,
        hypothesis_template: "El usuario está intentando {}.",
        multi_label: true
      }
    }); */

    const result = await hf.zeroShotClassification({
      model: 'MoritzLaurer/mDeBERTa-v3-base-mnli-xnli',
      inputs: mensaje,
      parameters: {
        candidate_labels: [
          "consultar horarios de apertura o cierre del local de comida",
          "consultar los platos disponibles en el menú del local de comida",
          "hacer un pedido o comprar comida del local"
        ],
        hypothesis_template: "El usuario está preguntando sobre {}.",
        multi_label: true
      }
    });
    console.log(result)
    const { labels, scores } = result[0];
    const sortedResults = labels.map((label, index) => ({
      label,
      score: scores[index]
    })).sort((a, b) => b.score - a.score);


    const threshold = 0.75;
    return sortedResults[0].score < threshold ? "otro" : sortedResults[0].label;
  } catch (error) {
    console.error('Error al clasificar la intención:', error);
    return null;
  }
}

module.exports = { clasificarIntencion }