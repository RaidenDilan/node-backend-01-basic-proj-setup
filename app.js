const express = require('express');
const bodyParser = require('body-parser');
const placesRoutes = require('./routes/places');
const usersRoutes = require('./routes/users');
const HttpError = require('./models/http-error');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((err, req, res, next) => {
  if (res.headerSent) return next(err);
  res.status(err.code || 500);
  res.json({ message: err.message || 'An unknown error occurred!' });
});

mongoose
  .connect(`mongodb+srv://${ process.env.ATLAS_CLIENT_USERNAME }:${ process.env.ATLAS_CLIENT_PASSWORD }@cluster0-mhonq.mongodb.net/places?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => (console.log('Connected to database!'), app.listen(5000)))
  .catch((err) => console.log('Connection failed!', err));
