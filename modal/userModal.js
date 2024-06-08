const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    default: "user",
  },
  voterid: {
    type: String,
    required: true,
    unique: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  constituency: {
    type: String,
    required: true,
  },
  uvc: {
    type: String,
    required: true,
  },
  vote: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
