const { v4: uuid } = require('uuid');
const HttpError = require('../../models/http-error');
const { validationResult } = require('express-validator');
const User = require('../../models/user');

let DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Raiden D.',
    email: 'test@test.com',
    password: 'password'
  }
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError('Invalid inputs passed, please check your data', 422);// you cna also console log the errors array from the validationResult object.
    return next(error);
  }

  const { name, email, password, places } = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again later.', 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError('User exists already, please login instead.', 422); // => For better UX, we expose the error.
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password,
    image: 'https://cdn4.vectorstock.com/i/1000x1000/64/83/web-developer-avatar-vector-25996483.jpg',
    places
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again later.', 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const indentifiedUser = DUMMY_USERS.find(u => u.email === email);
  if (!indentifiedUser || indentifiedUser.password !== password) {
    const error = new HttpError('Could not identify user, credentials seem to be incorrect.', 404);
    return next(error);
  }
  res.json({ message: 'Logged In' });
};

module.exports = {
  getUsers: getUsers,
  signup: signup,
  login: login
};
