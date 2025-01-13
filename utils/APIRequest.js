const axios = require('axios');
require('dotenv').config();

// Configura la petición
const APITemplate = async () => {
    const options = {
      method: 'GET',
      url: 'https://maps.googleapis.com/maps/api/place/textsearch/json',
      params: {
        query: 'restaurantes en Costa Rica',
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    };
      
      axios.request(options).then((response) => {
        const restaurantes = response.data.results.map((restaurant) => ({
          name: restaurant.name,
          rating: restaurant.rating,
          price_level: restaurant.price_level,
          address: restaurant.vicinity
        }));
        return restaurantes;
      }).catch((error) => console.error(error));
}

module.exports = APITemplate;

