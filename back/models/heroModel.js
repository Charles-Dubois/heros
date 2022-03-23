const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 15,
    unique: true,
  },
  power: {
    type: [String],
    required: false,
  },
  color: {
    type: String,
    required: true,
    maxlength: 150,
  },
  isAlive: {
    required: true,
    type: Boolean,
  },
  age: {
    required: false,
    type: Number,
  },
  image: {
    type: String,
    maxlength: 500,
    unique: true,
  },
});

const Hero = mongoose.model("Heroes", heroSchema);

module.exports = Hero;
