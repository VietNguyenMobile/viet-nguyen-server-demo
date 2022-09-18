const mongoose = require("mongoose");

const leadSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "",
  },
  age: {
    type: String,
    default: "",
  },
  income: {
    type: String,
    default: "",
  },
  maritalStatus: {
    type: String,
    default: "Close",
  },
  source: {
    type: String,
    default: "Personal",
  },
  note: {
    type: String,
    default: "",
  },
  rate: {
    type: Number,
    default: 0,
  },
});

exports.Lead = mongoose.model("Lead", leadSchema);
