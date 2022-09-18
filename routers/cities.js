const { City } = require("../models/city");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  const cityList = await City.find();

  if (!cityList) {
    res.status(500).json({ success: false });
  }
  res.send(cityList);
});

router.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid City Id");
  }

  const city = await City.findById(req.params.id);

  if (!city) {
    res.status(500).json({
      success: false,
      message: "The city with the given ID was not found!",
    });
  }
  res.status(200).send(city);
});

router.post(`/`, async (req, res) => {
  let city = new City({
    name: req.body.name,
    code: req.body.code,
  });

  city = await city.save();

  if (!city) return res.status(500).send("the city cannot be created!");

  res.send(city);
});

router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid City Id");
  }

  const city = await City.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      code: req.body.code,
    },
    { new: true }
  );

  if (!city) return res.status(401).send("the city cannot be update!");

  res.send(city);
});

router.delete("/:id", (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid City Id");
  }

  City.findByIdAndRemove(req.params.id)
    .then((city) => {
      if (city) {
        return res
          .status(200)
          .json({ success: true, message: "the city is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "the city not found!" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

module.exports = router;
