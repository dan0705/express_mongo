const router = require('express').Router();

const {
  RegisterUser,
  LoginUser,
  LogoutUser,
  getUserDetails,
} = require('./controller/AuthController');

const { auth } = require('./middleware/auth');

router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'No params sent',
  });
});

router.route('/users/register').post(RegisterUser);

router.route('/users/login').post(LoginUser);

router.route('/users/user').get(auth, getUserDetails);

router.route('/users/logout').get(auth, LogoutUser);

module.exports = router;
