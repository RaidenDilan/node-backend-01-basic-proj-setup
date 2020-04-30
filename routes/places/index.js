const express = require('express');
const HttpError = require('../../models/http-error');
const placesCtrl = require('../../controllers/places');

const router = express.Router();

router.get('/:pid', placesCtrl.getPlaceById);

router.get('/user/:uid', placesCtrl.getPlaceByUserId);

module.exports = router;
