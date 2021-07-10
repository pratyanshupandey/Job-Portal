const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const Recruiter = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  contact: Number,
  bio: String,
});

module.exports = Recruiters = mongoose.model("Recruiter", Recruiter);
