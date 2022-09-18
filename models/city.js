const mongoose = require("mongoose");

const citySchema = mongoose.Schema({
  code: {
    type: String,
    default: "hcm",
  },
  name: {
    type: String,
    default: "Hồ Chí Minh",
  },
});

exports.City = mongoose.model("City", citySchema);
