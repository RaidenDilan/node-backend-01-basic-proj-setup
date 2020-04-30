const { v4: uuid } = require('uuid');
const HttpError = require('../../models/http-error');
const { validationResult } = require('express-validator');
const getCoordinatesForAddress = require('../../util/location');

let DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    location: {
      lat: 40.7484474,
      lng: -73.9871516
    },
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1'
  }
];

const getPlaceById = (req, res, next) => {
  const placeId = req.params.placeId; // => { placeId: 'p1' }
  const place = DUMMY_PLACES.find(p => p.id === placeId);
  if (!place) throw new HttpError('Could not find a place for the provided id.', 404); // for syncronous middle
  res.json({ place }); // => { place } => { place: place }
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.userId;
  const places = DUMMY_PLACES.filter(p => p.creator === userId);
  if (!places || places.length === 0) return next(new HttpError('Could not find places for the provided user id.', 404)); // for asyncronous middle
  res.json({ places });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  // if (!errors.isEmpty()) throw new HttpError('Invalid inputs passed, please check your data', 422);// you cna also console log the errors array from the validationResult object.
  if (!errors.isEmpty()) return next(new HttpError('Invalid inputs passed, please check your data', 422)); // you cna also console log the errors array from the validationResult object.

  const { title, description, address, creator } = req.body;

  let coordinates;

  try {
    coordinates = await getCoordinatesForAddress(address);
  }
  catch (err) {
    return next(err);
  }

  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator
  };
  DUMMY_PLACES.push(createdPlace); // DUMMY_PLACES.unshift(createdPlace);
  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new HttpError('Invalid inputs passed, please check your data', 422);// you cna also console log the errors array from the validationResult object.

  const { title, description } = req.body;
  const placeId = req.params.placeId;
  const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId) }; // Update in a immutable way with { ...DUMMY_PLACES.fine() }
  const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;
  DUMMY_PLACES[placeIndex] = updatedPlace; // replace old object with the new updated place.
  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.placeId;
  if (!DUMMY_PLACES.find(p => p.id === placeId)) throw new HttpError('Could not find a place for that id.', 404);

  DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id === placeId); // filter returns new array || immutable.
  res.status(200).json({ message: `Deleted Place with the id of : ${ placeId }` });
};

module.exports = {
  getPlaceById: getPlaceById,
  getPlacesByUserId: getPlacesByUserId,
  createPlace: createPlace,
  updatePlace: updatePlace,
  deletePlace: deletePlace,
};
