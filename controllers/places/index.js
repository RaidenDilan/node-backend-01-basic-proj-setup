const { v4: uuid } = require('uuid');
const HttpError = require('../../models/http-error');
const { validationResult } = require('express-validator');
const getCoordinatesForAddress = require('../../util/location');
const Place = require('../../models/place');

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

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.placeId; // => { placeId: 'p1' }
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not find a place.', 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError('Could not find a place for the provided id.', 404); // for syncronous middle
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) }); // => { place } => { place: place } // => getters: true  => get rid of '_id'.
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  let places;

  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError('Something went wrong, could not find a place.', 500);
    return next(error);
  }

  if (!places || places.length === 0) {
    const error = new HttpError('Could not find places for the provided user id.', 404);
    return next(error);
  }

  res.json({ places: places.map(place => place.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  // if (!errors.isEmpty()) throw new HttpError('Invalid inputs passed, please check your data', 422);// you cna also console log the errors array from the validationResult object.
  if (!errors.isEmpty()) return next(new HttpError('Invalid inputs passed, please check your data', 422)); // you cna also console log the errors array from the validationResult object.

  const { title, description, address, creator, image } = req.body;

  let coordinates;

  try {
    coordinates = await getCoordinatesForAddress(address);
  }
  catch (err) {
    return next(err);
  }

  const createdPlace = new Place({
    title,
    description,
    image: 'https://cdn.pixabay.com/photo/2015/12/08/00/40/empire-state-building-1081929_1280.jpg',
    address,
    location: coordinates,
    creator
  });

  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError('Creating place failed, please try again.', 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new HttpError('Invalid inputs passed, please check your data', 422);// you cna also console log the errors array from the validationResult object.

  const { title, description } = req.body;
  const placeId = req.params.placeId;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError('Something went wrong,could not update place.', 500);
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError('Somethig went wrong, could not update place.', 500);
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
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
