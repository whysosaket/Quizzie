const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 3,
    max: 1024,
  },
  quizCreated: {
    type: Number,
    required: false,
    default: 0,
  },
  questionsCreated: {
    type: Number,
    required: false,
    default: 0,
  },
  totalImpressions: {
    type: Number,
    required: false,
    default: 0,
  },
});


const User = mongoose.model("user", userSchema);

module.exports = User;