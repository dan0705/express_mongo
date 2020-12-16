require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT = 10;
const JWT_AUTH_TOKEN_SECRET = process.env.JWT_AUTH_TOKEN_SECRET || 'asdflkj';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      unique: 1,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    firstName: {
      type: String,
      require: [true, 'Firstname is required'],
      trim: true,
      maxlength: 100,
    },
    lastName: {
      type: String,
      required: [true, 'Lastname is required'],
      trim: true,
      maxlength: 100,
    },
    token: {
      type: String,
    },
    gender: String,
    phone: String,
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  const user = this;
  if (user.isModified('password')) {
    // checking if password field is available and modified
    bcrypt.hash(user.password, SALT, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  } else {
    next();
  }
});

// comparing the users entered password with database during login
userSchema.methods.comparePassword = function (candidatePaswsword, callBack) {
  bcrypt.compare(candidatePaswsword, this.password, function (err, isMatch) {
    if (err) return callBack(err);
    callBack(null, isMatch);
  });
};

// generating token when loggedIn
userSchema.methods.generateToken = function (callBack) {
  const user = this;
  const token = jwt.sign(user._id.toHexString(), JWT_AUTH_TOKEN_SECRET);
  user.token = token;
  user.save(function (err, user) {
    if (err) return callBack(err);
    callBack(null, user);
  });
};

// vakidating token for auth routes middleware
userSchema.statics.findByToken = function (token, callBack) {
  const user = this;
  jwt.verify(token, JWT_AUTH_TOKEN_SECRET, function (err, decode) {
    // decode must give user_id if token is valid .ie decode = user_id
    user.findOne({ _id: decode, token: token }, function (err, user) {
      if (err) return callBack(err);
      callBack(null, user);
    });
  });
};

// auto change from User > users collection in db
const User = mongoose.model('User', userSchema);
module.exports = { User };
