const { User } = require('../models/UserModel');

const getListOfUserInfo = (fromDoc) => {
  return {
    _id: fromDoc._id,
    email: fromDoc.email,
    firstName: fromDoc.firstName,
    lastName: fromDoc.lastName,
    gender: fromDoc.gender,
    phone: fromDoc.phone,
    pets: fromDoc.pets,
    createdAt: fromDoc.createdAt,
    updatedAt: fromDoc.updatedAt,
  };
};

exports.RegisterUser = (req, res, next) => {
  const user = new User(req.body);
  User.findOne({ email: req.body.email }, (err, existedUser) => {
    if (!existedUser) {
      user.save((err, thisUser) => {
        if (err) {
          res.status(422).json({ error: err });
        } else {
          res.status(200).json({
            success: true,
            message: 'Successfully signed up.',
            user: getListOfUserInfo(thisUser),
          });
        }
        next();
      });
    } else {
      return res.status(409).json({
        success: false,
        message: 'Email has aready registered.',
      });
    }
  });
};

exports.LoginUser = (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User email not found.' });
    } else {
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch) {
          return res
            .status(400)
            .json({ success: false, message: 'Wrong password.' });
        } else {
          user.generateToken((err, user) => {
            if (err) {
              return res.status(400).send({ err });
            } else {
              const data = {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                token: user.token,
              };
              res.cookie('authToken', user.token).status(200).json({
                success: true,
                message: 'Successfully Logged In.',
                user: data,
              });
            }
          });
        }
      });
    }
  });
};

exports.LogoutUser = (req, res) => {
  User.findByIdAndUpdate(
    {
      _id: req.user._id,
    },
    { token: '' },
    (err) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({ success: true, message: 'Logged out.' });
    }
  );
};

// get authenticated user details
exports.GetUserDetails = (req, res) => {
  return res.status(200).json({
    isAuthenticated: true,
    user: getListOfUserInfo(req.user),
  });
};

exports.ChangePassword = (req, res) => {
  User.findById(req.user._id, (err, user) => {
    if (err) return res.json({ success: false, err });
    user.comparePassword(req.body.currentPassword, (err, isMatch) => {
      if (err) return res.json({ success: false, err });
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Wrong password.',
        });
      } else if (req.body.newPassword.length < 6) {
        return res.status(400).send({
          success: false,
          error: 'New password must be greater equal than 6 characters.',
        });
      } else if (req.body.currentPassword === req.body.newPassword) {
        return res.status(400).json({
          success: false,
          message: 'New password is still current password',
        });
      } else {
        user.password = req.body.newPassword;
        user.save((err) => {
          if (err) return res.json({ success: false, err })
          return res.status(200).json({
            success: true,
            message: 'Change password successfully',
          });
        });
      }
    });
  });
};

// TODO: send email for new password
// exports.ForgetPassword = () => {}

exports.ChangeUserInfo = (req, res) => {
  User.findById(req.user._id, (err, user) => {
    if (err) return res.json({ success: false, err });

    if (req.body.firstName) user.firstName = req.body.firstName;
    if (req.body.lastName) user.lastName = req.body.lastName;
    if (req.body.gender) user.gender = req.body.gender;
    if (req.body.phone) user.phone = req.body.phone;
    user.save((err, thisUser) => {
      if (err) {
        res.status(422).json({ error: err });
      } else {
        res.status(200).json({
          success: true,
          message: 'Successfully modify info.',
          user: getListOfUserInfo(thisUser),
        });
      }
    });
  });
};
