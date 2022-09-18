const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead",
  },
  eventName: {
    type: String,
    default: "MeetForConsulting",
  },
  address: {
    type: String,
    required: true,
  },
  dateEvent: {
    type: Date,
    default: Date.now,
  },
});

exports.Event = mongoose.model("Event", eventSchema);
