const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    regNo: {
      type: String,
      required: false,
    },
    quizStatus: {
      enum: ["completed", "not_started", "started"],
      type: String,
      required: true,
    },
    attemptNumber: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Email", emailSchema);
