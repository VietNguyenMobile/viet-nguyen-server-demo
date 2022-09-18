const mongoose = require("mongoose");

const settingSchema = mongoose.Schema({
  currency: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
    default: "vn",
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agent",
  },
});

settingSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

settingSchema.set("toJSON", {
  virtuals: true,
});

exports.Setting = mongoose.model("Setting", settingSchema);
