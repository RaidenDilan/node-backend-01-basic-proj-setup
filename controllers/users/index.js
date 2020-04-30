const { v4: uuid } = require('uuid');
const HttpError = require('../../models/http-error');
const { validationResult } = require('express-validator');

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

const signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new HttpError('Invalid inputs passed, please check your data', 422);// you cna also console log the errors array from the validationResult object.
  
  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find(u => u.email === email);

  if (hasUser) throw new HttpError('Could not create user, email already exists.', 422);

  const ctreatedUser = {
    id: uuid(),
    name, // name: name
    email,
    password
  };

  DUMMY_USERS.push(ctreatedUser);

  res.status(201).json({ user: ctreatedUser });

};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const indentifiedUser = DUMMY_USERS.find(u => u.email === email);
  if (!indentifiedUser || indentifiedUser.password !== password) throw new HttpError('Could not identify user, credentials seem to be incorrect.', 404);
  res.json({ message: 'Logged In' });
};

module.exports = {
  getUsers: getUsers,
  signup: signup,
  login: login
};
