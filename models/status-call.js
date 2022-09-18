const mongoose = require("mongoose");

const resultCallSchema = mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  phone: {
    type: String,
    required: true,
  },
});

resultCallSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

resultCallSchema.set("toJSON", {
  virtuals: true,
});

exports.ResultCall = mongoose.model("ResultCall", resultCallSchema);
