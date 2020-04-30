const axios = require('axios');
const HttpError = require('../models/http-error');

const API_KEY = 'AIzaSyAPW3x_nhY1Tr2DnKRj7465kOcQ9QgkknA';

async function getCoordinatesForAddress(address) {
  // Dummy location data.
  // return {
  //   lat: 40.7484474,
  //   lng: -73.9871516
  // };
  const res = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${ encodeURIComponent(address) }&key=${ API_KEY }`);
  const data= res.data;

  if (!data || data.status === 'ZERO_RESULTS') {
    const error = new HttpError('Coulod not find location for the specified address.', 422);
    throw error;
  }
  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

module.exports = getCoordinatesForAddress;
