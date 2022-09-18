const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mark: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 60,
  },
  gender: {
    type: String,
    required: true,
    default: "male",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    required: true,
  },
});

studentSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

studentSchema.set("toJSON", {
  virtuals: true,
});

exports.Student = mongoose.model("Student", studentSchema);
