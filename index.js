const http= require('http');
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAI } = require('openai');
//const { OpenAI } = require("langchain/llms");
const PORT = process.env.PORT || 5001;
const fileLoad = require('./utils/fileTransform');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
fileLoad('data/food.pdf');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/ask', async (req, res) => {
    const message = req.body.messages;
    console.log("Mensaje recibido:", message);
    if (message.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Debes enviar un mensaje.',
      });
    }
    
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