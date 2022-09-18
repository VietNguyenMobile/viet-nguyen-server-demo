const mongoose = require("mongoose");

const resultCallSchema = mongoose.Schema({
  status: {
    type: String, // GetAppointment, CallLater, Denied
    required: true,
  },
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead",
  },
  phone: {
    type: String,
    required: true,
  },
  dateCall: {
    type: Date,
    default: Date.now,
  },
});

orderItemSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

orderItemSchema.set("toJSON", {
  virtuals: true,
});

exports.ResultCall = mongoose.model("ResultCall", resultCallSchema);
