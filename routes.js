const router = require('express').Router();

const {
  RegisterUser,
  LoginUser,
  LogoutUser,
  GetUserDetails,
  ChangePassword,
  ChangeUserInfo,
} = require('./controller/UserController');

const { auth } = require('./middleware/auth');

router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'No params sent',
  });
});

router.route('/users/register').post(RegisterUser);
router.route('/users/login').post(LoginUser);
router.route('/users/change-password').post(auth, ChangePassword);
router.route('/users/logout').get(auth, LogoutUser);
router
  .route('/users/user')
  .get(auth, GetUserDetails)
  .post(auth, ChangeUserInfo)

module.exports = router;
