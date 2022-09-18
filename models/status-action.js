const mongoose = require("mongoose");

const statusActionSchema = mongoose.Schema({
  status: {
    type: String, // Contact, Meet, Consult, Signed, Success
    required: true,
  },
  expectedNumber: {
    type: Number,
    default: 0,
  },
  actualNumber: {
    type: Number,
    default: 0,
  },
});

statusActionSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

statusActionSchema.set("toJSON", {
  virtuals: true,
});

exports.StatusAction = mongoose.model("StatusAction", statusActionSchema);
