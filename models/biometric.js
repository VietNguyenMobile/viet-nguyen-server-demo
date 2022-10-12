const mongoose = require("mongoose");

const biometricSchema = mongoose.Schema({
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agent",
  },
  signature: {
    type: String,
    required: true,
  },
  deviceId: {
    type: String,
    required: true,
  },
  deviceModel: {
    type: String,
    default: "",
  },
  deviceOS: {
    type: String,
    required: true,
  },
  loginLocation: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  biometricPublicKey: {
    type: String,
    default: "",
  },
});

exports.Biometric = mongoose.model("Biometric", biometricSchema);
