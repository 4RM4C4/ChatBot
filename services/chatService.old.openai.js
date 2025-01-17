const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: "sk-pr",
});


async function procesarMensaje(mensaje) {
  const respuesta = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    prompt: `
Eres un chatbot para un restaurante de sushi. Tu tarea es analizar el mensaje del usuario y responder con un JSON que incluya:

1. **intencion**: La intención del usuario, que puede ser:
   - "horarios": Para consultar horarios del restaurante.
   - "modificar_pedido": Para agregar o eliminar productos de un pedido existente.
   - "confirmar_pedido": Para confirmar un pedido.
   - "cancelar_pedido": Para cancelar un pedido.

2. **productos**: Un arreglo con los productos a modificar, cada objeto debe tener:
   - "producto": El nombre del producto.
   - "cantidad": La cantidad a agregar (positivo) o remover (negativo).
   - "extras": Información adicional sobre el producto.

Si no hay productos mencionados, deja el campo "productos" vacío.

Ejemplo de salida:
Cliente: Quiero agregar 2 sushi de atún sin soya.
Respuesta: {
  "intencion": "modificar_pedido",
  "productos": [
    {
      "producto": "sushi de atún",
      "cantidad": 2,
      "extras": "sin soya"
    }
  ]
}

Cliente: ${mensaje}
Respuesta:
`,
    max_tokens: 300,
    temperature: 0,
  });

  return JSON.parse(respuesta.data.choices[0].text.trim());
}


module.exports = { procesarMensaje }