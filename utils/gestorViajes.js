const scrapping = require("./scrapping");
const APITemplate = require('./APIRequest');
const AIConfig = require('./AIConfig');

let contextoUsuario = {
    dias: null,
    experiencia: null,
    comida: null,
    presupuesto: null,
    lugares: null,
};

let contexto = { ...contextoUsuario }; // Contexto del usuario
let preguntaActual = obtenerSiguientePregunta(contexto); // Primera pregunta
let vectores_comida = [];
let itinerary = "";
let restaurants=[];
let tours=[]; 

async function resetContext() {
    contexto = { ...contextoUsuario };
    preguntaActual = obtenerSiguientePregunta(contexto);
    return contexto;
}

function obtenerSiguientePregunta(contexto) {
    if (!contexto.dias)return "¿Cuántos días desea que dure su itinerario?";
    if (!contexto.experiencia) return "¿Qué tipo de experiencia busca? (e.g., aventura, relajación, cultural, gastronómica, etc.)";
    if (!contexto.comida) return "¿Qué tipo de comida prefiere? ¿Tiene alguna restricción como comida vegana o sin gluten?";
    if (!contexto.presupuesto) return "¿Tiene un presupuesto aproximado para el viaje por día en dolares?";
    if (!contexto.lugares) return "¿Hay lugares que quiera visitar o actividades que no puedan faltar?";
    return null; // Todas las preguntas respondidas
}
  
function manejarRespuesta(preguntaActual, respuesta, contexto) {
    if (preguntaActual.includes("días")) contexto.dias = parseInt(respuesta);
    else if (preguntaActual.includes("experiencia")) contexto.experiencia = respuesta;
    else if (preguntaActual.includes("comida")) contexto.comida = respuesta;
    else if (preguntaActual.includes("presupuesto")) contexto.presupuesto = respuesta;
    else if (preguntaActual.includes("lugares")) contexto.lugares = respuesta;
    return contexto;
}


async function generarItinerario(contexto) {

  restaurants = await APITemplate();
  tours = await scrapping(
    'https://www.civitatis.com/es/costa-rica/?_gl=1*pjnvms*_up*MQ..*_gs*MQ..&gclid=CjwKCAiAyJS7BhBiEiwAyS9uNe7Mf6WTrwuOfTmSSFYe6nKzNhb1MHZcc2STGKAN4RK5MHQZlquVLhoCNawQAvD_BwE&gclsrc=aw.ds',
    '.compact-card',
    'h3.compact-card__title',
    '.compact-card__price__text');

  //const index = AIConfig.pinecone.index(process.env.PINECONE_INDEX_NAME);
  //const queryEmbedding = await AIConfig.embeddings.embedQuery(`opciones de comida: ${contexto.comida}`);

  /*try {
    const response_pinecone = await AIConfig.index.query({ 
      topK: 3, 
      vector: queryEmbedding,
      includeMetadata: true
    });
    //console.log("Resultados de la consulta:", results.matches[0].metadata.text);
    vectores_comida = response_pinecone.matches.map(match => match.metadata.text);

  } catch (error) {
    console.error("Error durante la consulta:", error);
  }*/

  let previousDaysGenerated = "";

  for (let dia = 1; dia <= contexto.dias; dia++) {

    const prompt = `
    You are a travel assistant. Generate a unique plan for Day ${dia} of a ${contexto.dias}-day trip.
    Generar todo en español.
    
    ### User Info:
        - Experience: ${contexto.experiencia}
        - Food preferences: ${contexto.comida}
        - Budget: ${contexto.presupuesto}
        - Priority locations: ${contexto.lugares}
    
        ### Previous Days:
        ${previousDaysGenerated || "No previous plans yet."}

        ### Data for Day ${dia}:
        - Available tours: ${tours}
        - Nearby restaurants: ${restaurants}

        ### Format (Do not include this line in the response):
        - Actividad:\n
        - Desayuno:\n
        - Almuerzo:\n
        - Cena:\n
        - Precio:\n

        Please generate the plan without including "### " lines in the response.
    `;

    try {
      const diaGenerado = await AIConfig.openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        max_tokens: 2000,
        prompt:prompt
      }); 
      // Actualiza el resumen con el resultado del día actual
      previousDaysGenerated += `Día ${dia} Plan:\n${diaGenerado.choices[0].text}\n\n`;
      //return completion.choices[0].text;
    }catch (error) {
       console.error("Error durante la consulta:", error);  
    }
  }
  contexto = { ...contextoUsuario };
  itinerary = previousDaysGenerated;
  return previousDaysGenerated;
  
}

async function feedbackItinerary(feedback) {
  const prompt = 
    `El usuario ha pedido corregir el itinerario de viajes, se preciso y solo corrige lo que se te pide.

    ### Itinerario actual:
    ${itinerary}

    ### lo que el cliente piensa que está mal:
    ${feedback}

    ### Instructions:
    - Corrije el itinerario ${feedback}.
    - Solo corrije el itinerario, no lo reescribas, no crear uno nuevo.
    - Tours disponibles: ${tours}
    - Restaurantes cerca: ${restaurants}
    - La respuesta debe ser solo el itinerario corregido.
    - No incluir las líneas "### " en la respuesta.
    `;

  try {
    const response = await AIConfig.openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt,
      max_tokens: 2000,
    });
    console.log("Respuesta del modelo:", response.choices[0].text);
    return response.choices[0].text;
  }catch (error) {
    console.error("Error durante la consulta:", error);
  }
}

module.exports = { contexto, preguntaActual, contextoUsuario, resetContext, obtenerSiguientePregunta, manejarRespuesta, generarItinerario, feedbackItinerary};