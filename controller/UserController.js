const { User } = require('../models/UserModel');

exports.RegisterUser = (req, res, next) => {
  const user = new User(req.body);
  User.findOne({ email: req.body.email }, (err, existedUser) => {
    if (!existedUser) {
      user.save((err, doc) => {
        if (err) {
          res.status(422).json({ error: err });
        } else {
          const userData = {
            firstName: doc.firstName,
            lastName: doc.lastName,
            email: doc.email,
            gender: doc.gender,
            phone: doc.phone,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
          };
          res.status(200).json({
            success: true,
            message: 'Successfully signed up.',
            user: userData,
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
    email: req.user.email,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    gender: req.user.gender,
    phone: req.user.phone,
    createdAt: req.user.createdAt,
    updatedAt: req.user.updatedAt,
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
      } else if (req.body.currentPassword === req.body.newPassword) {
        return res.status(400).json({
          success: false,
          message: 'New password is current password',
        });
      } else {
        user.password = req.body.newPassword;
        user.save();
        return res.status(200).json({
          success: true,
          message: 'Change password successfully',
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
    user.save((err, doc) => {
      if (err) {
        res.status(422).json({ error: err });
      } else {
        const userData = {
          email: doc.email,
          firstName: doc.firstName,
          lastName: doc.lastName,
          gender: doc.gender,
          phone: doc.phone,
          pets: doc.pets,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        };
        res.status(200).json({
          success: true,
          message: 'Successfully modify info.',
          user: userData,
        });
      }
    });
    return res.status(200).json({
      success: true,
      user: user
    })
  });
};
