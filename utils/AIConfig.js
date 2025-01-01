const { OpenAI } = require('openai');
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { Pinecone } = require("@pinecone-database/pinecone");
require('dotenv').config();

class AIConfig {
    constructor() {
        this._openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        this._embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY
        });

        this._pinecone = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY
        });

        this._index = this._pinecone.index(process.env.PINECONE_INDEX_NAME);
    }

    get openai() {
        return this._openai;
    }

    set openai(value) {
        this._openai = value;
    }

    get embeddings() {
        return this._embeddings;
    }

    set embeddings(value) {
        this._embeddings = value;
    }

    get pinecone() {
        return this._pinecone;
    }

    set pinecone(value) {
        this._pinecone = value;
    }

    get index() {
        return this._index;
    }

    set index(value) {
        this._index = value;
    }
}

module.exports = new AIConfig();