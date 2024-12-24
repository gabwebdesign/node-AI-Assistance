const http= require('http');
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAI } = require('openai');
const PORT = process.env.PORT || 5001;
const fileLoad = require('./utils/fileTransform');
const scrapping = require('./utils/scrapping');
const { Pinecone } = require("@pinecone-database/pinecone");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
//fileLoad('data/food.pdf');
const tours = scrapping(
  'https://www.civitatis.com/es/costa-rica/?_gl=1*pjnvms*_up*MQ..*_gs*MQ..&gclid=CjwKCAiAyJS7BhBiEiwAyS9uNe7Mf6WTrwuOfTmSSFYe6nKzNhb1MHZcc2STGKAN4RK5MHQZlquVLhoCNawQAvD_BwE&gclsrc=aw.ds',
  '.compact-card',
  'h3.compact-card__title',
  '.compact-card__price__text');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const embeddings = async (query) => {

  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY
  });

  const index = pinecone.index(process.env.PINECONE_INDEX_NAME);
  const queryEmbedding = await embeddings.embedQuery(query);

  try {
    const results = await index.query({ 
      topK: 3, 
      vector: queryEmbedding,
      includeMetadata: true
    });
    //console.log("Resultados de la consulta:", results.matches[0].metadata.text);
    return results.matches.map(match => match.metadata.text);

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
      content: `Eres agente de viajes, debes guiar al usuario en información relevante, como clima, precios tiquetes de avion, comida tipica, estilo de vida. 
      Usa la siguiente información como contexto al responder si el usuario pregunta sobre comida tipica en Costa Rica: ${pineconeRequest},
      usa la siguiente información como contexto al responder si el usuario pregunta sobre tours en Costa Rica: ${tours}`
    }

    message.unshift(prompt);
    
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
      
      console.log("Respuesta de OpenAI:", response.choices[0].message.content.trim());

    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        error: 'Hubo un problema procesando tu solicitud.',
      });
    }
    
  });

  
  app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`)); 