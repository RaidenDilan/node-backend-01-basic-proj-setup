const express = require('express');
const placesCtrl = require('../../controllers/places');

const router = express.Router();

router.get('/:pid', placesCtrl.getPlaceById);

router.get('/user/:uid', placesCtrl.getPlaceByUserId);

router.post('/', placesCtrl.createPlace);

module.exports = router;
