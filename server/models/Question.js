const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  quiz: {
    type: String,
    required: true,
    min: 6,
    max: 25,
  },
  type: {
    type: String,
    required: true,
    min: 3,
    max: 4,
  },
  optionType: {
    type: String,
    required: true,
    min: 3,
    max: 6,
  },
  timer: {
    type: Number,
    required: false,
    default: 0,
  },
  attempts: {
    type: Number,
    required: false,
    default: 0,
  },
  correct: {
    type: Number,
    required: false,
    default: 0,
  },
  incorrect: {
    type: Number,
    required: false,
    default: 0,
  },
  options: {
    type: Array,
    required: false,
    default: [],
  },
  imageOptions: {
    type: Array,
    required: false,
    default: [],
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  optedOption1: {
    type: Number,
    required: false,
    default: 0,
  },
  optedOption2: {
    type: Number,
    required: false,
    default: 0,
  },
  optedOption3: {
    type: Number,
    required: false,
    default: 0,
  },
  optedOption4: {
    type: Number,
    required: false,
    default: 0,
  },
});


const Question = mongoose.model("question", questionSchema);

module.exports = Question;