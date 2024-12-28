const axios = require('axios');
require('dotenv').config();

// Configura la petición
const APIRequest = async () => {
    const options = {
        method: 'GET',
        url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
        params: {
            location: '9.9325,-84.0316',
            radius: 5000,
            limit: 10,
            type: 'restaurant',
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

module.exports = APIRequest;

