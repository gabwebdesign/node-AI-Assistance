const { Pinecone } = require("@pinecone-database/pinecone");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");

class PineconeClient {
  constructor(apiKey, environment, indexName) {
    this.pinecone = new Pinecone({
      apiKey: apiKey,
      environment: environment,
    });
    this.indexName = indexName;
    this.index = this.pinecone.Index(indexName);
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY
    });
  }

  /**
   * Realiza una consulta en Pinecone basada en texto.
   * @param {string} query - Texto para buscar.
   * @param {number} topK - Número de resultados más similares a recuperar.
   * @returns {Promise<Array>} - Lista de resultados relevantes.
   */
  async queryVectors(query, topK = 5) {
    try {
      // Generar el embedding para la consulta
      const queryEmbedding = await this.embeddings.embedQuery(query);

      // Realizar la consulta en Pinecone
      const response = await this.index.query({
        vector: queryEmbedding,
        topK: topK,
        includeMetadata: true, // Devuelve los metadatos (por ejemplo, texto asociado a los vectores)
      });

      // Retornar resultados relevantes
      return response.matches.map((match) => ({
        id: match.id,
        score: match.score,
        metadata: match.metadata,
      }));
    } catch (error) {
      console.error("Error al consultar Pinecone:", error);
      throw error;
    }
  }
}

module.exports = PineconeClient;
