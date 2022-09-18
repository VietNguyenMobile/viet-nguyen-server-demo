const mongoose = require("mongoose");

const salesPlanSchema = mongoose.Schema({
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    default: Date.now,
  },
  commission: {
    type: Number,
    default: 10,
  },
  ape: {
    type: Number,
    default: 5,
  },
  income: {
    type: Number,
    default: 10,
  },
  dateSelect: {
    type: String, // Month, Year
    required: true,
  },
  expectedAction: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StatusAction",
      required: true,
    },
  ],
});

exports.SalesPlan = mongoose.model("SalesPlan", salesPlanSchema);
