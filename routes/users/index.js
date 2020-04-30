const { Router } = require('express');
const { check } = require('express-validator');
const usersCtrl = require('../../controllers/users');

const router = Router();

router.get('/', usersCtrl.getUsers);
router.post(
  '/signup',
  [
    check('name').not().isEmpty(),
    check('email')
      .normalizeEmail() // Test@test.com => test@test.com
      .isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  usersCtrl.signup
);
router.post('/login', usersCtrl.login);

module.exports = router;
