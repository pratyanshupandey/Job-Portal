const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const Applicant = new Schema({
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
  education: [
    {
      _id: false,
      id: false,
      institute: {
        type: String,
        required: true,
      },
      startyear: {
        type: Number,
        required: true,
      },
      endyear: Number,
    },
  ],
  skills: [String],
  rating: {
    sum: Number,
    count: Number,
  },
});

module.exports = Applicants = mongoose.model("Applicant", Applicant);
