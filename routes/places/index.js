const express = require('express');
const placesCtrl = require('../../controllers/places');

const router = express.Router();

router.get('/:placeId', placesCtrl.getPlaceById);

router.patch('/:placeId', placesCtrl.updatePlace);

router.delete('/:placeId', placesCtrl.deletePlace);

router.get('/user/:userId', placesCtrl.getPlacesByUserId);

router.post('/', placesCtrl.createPlace);

module.exports = router;
