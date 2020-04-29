const express = require('express');
const bodyParser = require('body-parser');
const placesRoutes = require('./routes/places');

const app = express();

app.use(placesRoutes);
// app.use(bodyParser);

app.listen(3000);
