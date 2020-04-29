const express = require('express');
const bodyParser = require('body-parser');
const placesRoutes = require('./routes/places');

const app = express();
// app.use(bodyParser);

app.use('/api/places', placesRoutes); // => /api/places/...

// if 4 arguements are attached to any middleware function, express will recognise this as a special middleware funtion, a error handling middleware function
app.use((err, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }

  res
    .status(err.code || 500)
    .json({ message: err.message || 'An unknown error occurred!' });
});

app.listen(3000);
