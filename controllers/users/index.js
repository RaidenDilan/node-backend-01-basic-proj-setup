const { v4: uuid } = require('uuid');
const HttpError = require('../../models/http-error');

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
