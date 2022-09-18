const { Student } = require("../models/student");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  const studentList = await Student.find().populate("city");

  if (!studentList) {
    res.status(500).json({ success: false });
  }
  res.send(studentList);
});

router.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Student Id");
  }

  const student = await Student.findById(req.params.id);

  if (!student) {
    res.status(500).json({
      success: false,
      message: "The student with the given ID was not found!",
    });
  }
  res.status(200).send(student);
});

router.post(`/`, async (req, res) => {
  let student = new Student({
    name: req.body.name,
    age: req.body.age,
    mark: req.body.mark,
    gender: req.body.gender,
    createdAt: req.body.createdAt,
    updatedAt: req.body.updatedAt,
    city: req.body.city,
  });

  student = await student.save();

  if (!student) return res.status(500).send("the student cannot be created!");

  res.send(student);
});

router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Student Id");
  }

  const student = await Student.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      age: req.body.age,
      mark: req.body.mark,
      gender: req.body.gender,
      createdAt: req.body.createdAt,
      updatedAt: req.body.updatedAt,
      city: req.body.city,
    },
    { new: true }
  );

  if (!student) return res.status(401).send("the student cannot be update!");

  res.send(student);
});

router.delete("/:id", (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Student Id");
  }

  Student.findByIdAndRemove(req.params.id)
    .then((student) => {
      if (student) {
        return res
          .status(200)
          .json({ success: true, message: "the student is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "the student not found!" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

module.exports = router;
