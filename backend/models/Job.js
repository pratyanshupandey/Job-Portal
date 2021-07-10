const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const Job = new Schema({
  title: {
    type: String,
    required: true,
  },
  recname: {
    type: String,
    required: true,
  },
  recemail: {
    type: String,
    required: true,
  },
  recid: {
    type: String,
    required: true,
  },
  maxappl: {
    type: Number,
    required: true,
  },
  positions: {
    type: Number,
    required: true,
  },
  dateofpost: {
    type: Date,
    required: true,
    default: Date.now,
  },
  emptypositions: {
    type: Number,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  requiredskills: [String],
  typeofjob: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  rating: {
    sum: Number,
    count: Number,
  },
});

module.exports = Jobs = mongoose.model("Job", Job);
