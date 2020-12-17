const { User } = require('../models/UserModel');
const auth = (req, res, next) => {
  const token = req.cookies.authToken;
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.status(400).json({
      success: false,
      message: 'Not authorized'
    });
    req.token = token;
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(400).json({
      success: false,
      message: 'You are not an admin',
    })
  }
  next()
}

module.exports = { auth, isAdmin };
