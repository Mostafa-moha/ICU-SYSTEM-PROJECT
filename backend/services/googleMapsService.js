// services/googleMapsService.js
const axios = require('axios');

// Google Maps API key (replace with your actual API key)
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

// Function to get geocode (latitude, longitude) from address
const geocodeAddress = async (address) => {
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: {
        address: address,
        key: GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status === 'OK') {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { lat, lng };
    } else {
      throw new Error('Unable to geocode address');
    }
  } catch (error) {
    console.error('Error geocoding address:', error);
    throw error;
  }
};

// Function to calculate the distance between two locations
const calculateDistance = async (location1, location2) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
      params: {
        origins: `${location1.lat},${location1.lng}`,
        destinations: `${location2.lat},${location2.lng}`,
        key: GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status === 'OK') {
      const distance = response.data.rows[0].elements[0].distance.text;
      return distance;
    } else {
      throw new Error('Unable to calculate distance');
    }
  } catch (error) {
    console.error('Error calculating distance:', error);
    throw error;
  }
};

module.exports = {
  geocodeAddress,
  calculateDistance
};
