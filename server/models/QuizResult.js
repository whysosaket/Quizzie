const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema(
  {
    quizID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    regNo: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuizResult", quizResultSchema);
