const { CharacterTextSplitter } = require("langchain/text_splitter");
const { Pinecone } = require('@pinecone-database/pinecone');
const { OpenAI } = require('openai');
const pdf = require('pdf-parse');
const fs = require('fs');
require('dotenv').config();


const pdfToText = async (filePath) => {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    const text = data.text;
    return text;
};

const getEmbeddings = async (text) => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text,
    });
    return response.data[0].embedding;
};

const fileTransform = async (text) => {

    const pdfText = await pdfToText(text);

    const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    });

    const textSplitter = new CharacterTextSplitter({
        chunkSize: 100,
        chunkOverlap: 0,
    });

    const texts = await textSplitter.splitText(pdfText);
    const index = pinecone.index(process.env.PINECONE_INDEX_NAME);

     // Prepare and upsert vectors to Pinecone
     const vectors = await Promise.all(texts.map(async (text, idx) => ({
        id: `text-${idx}`,
        values: await getEmbeddings(text),
        metadata: { text },
    })));

    await index.upsert( vectors );
    console.log('Text fragments have been upserted to Pinecone');

    return texts;
}

module.exports = fileTransform;