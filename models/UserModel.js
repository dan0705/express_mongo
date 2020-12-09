require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SALT = 10;
const PRIVATE_KEY = process.env.PRIVATE_KEY || "asdflkj";

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
  },
  firstName: {
    type: String,
    require: [true, "Firstname is required"],
    trim: true,
    maxlength: 100,
  },
  lastName: {
    type: String,
    required: [true, "Lastname is required"],
    trim: true,
    maxlength: 100,
  },
  token: {
    type: String,
  },
});

userSchema.pre("save", function (next) {
  let user = this;
  if (user.isModified("password")) {
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
  let token = jwt.sign(user._id.toHexString(), process.env.SECRETE);
  user.token = token;
  user.save(function (err, user) {
    if (err) return callBack(err);
    callBack(null, user);
  });
};

// vakidating token for auth routes middleware
userSchema.statics.findByToken = function (token, callBack) {
  const user = this;
  jwt.verify(token, PRIVATE_KEY, function (err, decode) {
    // decode must give user_id if token is valid .ie decode = user_id
    user.findOne({ id: decode, token: token }, function (err, user) {
      if (err) return callBack(err);
      callBack(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);
module.exports = { User };
