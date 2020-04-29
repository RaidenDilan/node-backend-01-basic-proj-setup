const express = require('express');

const router = express.Router();

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    imageUrl: 'https://cdn.pixabay.com/photo/2015/12/08/00/40/empire-state-building-1081929_1280.jpg',
    address: '20 W 34th St, New York, NY 10001, United States',
    location: {
      lat: 40.7484405,
      lng: -73.9878531
    },
    creator: 'u1'
  }
];

router.get('/:pid',(req, res, next) => {
  // console.log('GET request in Places');
  const placeId = req.params.pid; // => { pid: 'p1' }
  const place = DUMMY_PLACES.find(p => p.id === placeId);

  if (!place) {
    // return res.status(404).json({ message: 'Could not find a place for the provided id.' });
    const error = new Error('Could not find a place for the provided id.'); // for syncronous middle
    error.code = 404;
    throw error; // for syncronous middle
  }

  res.json({ place }); // => { place } => { place: place }
});

router.get('/user/:uid',(req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PLACES.find(p => p.creator === userId);

  if (!place) {
    // return res.status(404).json({ message: 'Could not find a place for the provided user id.' });
    const error = new Error('Could not find a place for the provided user id.'); // for syncronous middle
    error.code = 404;
    return next(error); // for asyncronous middle
  }

  res.json({ place });
});

module.exports = router;
