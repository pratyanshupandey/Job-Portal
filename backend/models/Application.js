const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const Application = new Schema({
  userid: {
    type: String,
    required: true,
  },
  jobid: {
    type: String,
    required: true,
  },
  dateofapplication: {
    type: Date,
    required: true,
    default: Date.now,
  },
  sop: {
    type: String,
    default: "",
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Applied",
  },
  jobrating: {
    israted: Boolean,
    value: Number,
  },
  applicantrating: {
    israted: Boolean,
    value: Number,
  },
  joiningdate: {
    type: Date,
  },
});

module.exports = Applications = mongoose.model("Application", Application);
