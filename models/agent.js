const mongoose = require("mongoose");

const agentSchema = mongoose.Schema({
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
  dateOfBirth: {
    // type: String,
    // default: "",
    type: Date,
    default: Date.now(),
  },
  email: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

exports.Agent = mongoose.model("Agent", agentSchema);
