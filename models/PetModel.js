const mongoose = require('mongoose');

const petSchema = new mongoose.Schema(
  {
    animal: {
      type: String,
      required: [true, 'Animal name is required'],
      trim: true,
      unique: 1,
    },
    nickname: {
      type: String,
      trim: true,
      unique: 1,
    },
    intelligence: {
      type: Number,
      min: 0,
      max: 5,
    },
    loyalty: {
      type: Number,
      min: 0,
      max: 5,
    },
    owners: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const Pet = mongoose.model('Pet', petSchema);
module.exports = { Pet };
