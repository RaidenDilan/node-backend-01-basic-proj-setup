const express = require('express');
const bodyParser = require('body-parser');
const placesRoutes = require('./routes/places');

const app = express();
// app.use(bodyParser);

app.use('/api/places', placesRoutes); // => /api/places/...

app.listen(3000);
