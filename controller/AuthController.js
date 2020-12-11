const { User } = require('../models/UserModel');

exports.RegisterUser = (req, res, next) => {
  const user = new User(req.body);
  User.findOne({ email: req.body.email }, (err, existedUser) => {
    if (!existedUser) {
      user.save((err, doc) => {
        if (err) {
          res.status(422).json({ errors: err });
        } else {
          const userData = {
            firstName: doc.firstName,
            lastName: doc.lastName,
            email: doc.email,
          };
          res.status(200).json({
            success: true,
            message: 'Successfully signed up.',
            userData,
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
            .json({ success: false, emssage: 'Wrong password.' });
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
                userData: data,
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
exports.getUserDetails = (req, res) => {
  return res.status(200).json({
    isAuthenticated: true,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
  });
};
