const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  quizID: {
    type: String,
    required: true,
    min: 20,
    max: 20,
  },
  name: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  type: {
    type: String,
    required: true,
    min: 3,
    max: 4,
  },
  createdOn: {
    type: Date,
    required: true,
    default: Date.now,
  },
  impressions: {
    type: Number,
    required: false,
    default: 0,
  },
  questions: {
    type: Array,
    required: true,
    default: [],
  },
});

const Quiz = mongoose.model("quiz", quizSchema);

module.exports = Quiz;
