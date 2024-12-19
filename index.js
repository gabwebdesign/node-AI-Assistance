const http= require('http');
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAI } = require('openai');
const PineconeClient = require("./utils/PineconeClient");
const PORT = process.env.PORT || 5001;
const fileLoad = require('./utils/fileTransform');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
//fileLoad('data/food.pdf');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const embeddings = async (query) => {
  // Configurar cliente Pinecone
  const client = new PineconeClient(
    process.env.PINECONE_API_KEY,
    process.env.PINECONE_ENVIRONMENT,
    process.env.PINECONE_INDEX_NAME
  );

  try {
    // Buscar vectores en Pinecone
    const results = await client.queryVectors(query, 5);
    //console.log("Resultados relevantes:");
    return results;

  } catch (error) {
    console.error("Error durante la consulta:", error);
  }

}

app.post('/api/ask', async (req, res) => {
    const message = req.body.messages;

    // Realizar la consulta en Pinecone
    const pineconeRequest = await embeddings(req.body.messages[0].content);
    const prompt = {
     role: "system",
      content: `Eres agente de viajes, debes guiar al usuario en información relevante, como clima, precios tiquetes de avion, comida tipica, estilo de vida. Usa la siguiente información como contexto al responder si el usuario pregunta sobre comida tipica en Costa Rica: ${pineconeRequest}`
    }
    console.log("Mensaje recibido:", message);
    
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: message,
        max_tokens: 150,
      });

      res.status(200).json({
        success: true,
        response: response.choices[0].message,
      });
      //console.log("Respuesta de OpenAI:", response.choices[0].message.content.trim());


    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        error: 'Hubo un problema procesando tu solicitud.',
      });
    }
    
  });

  
  app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`)); 