const { Biometric } = require("../models/biometric");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  const biometricList = await Biometric.find();

  if (!biometricList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(biometricList);
});

router.get("/:id", async (req, res) => {
  const biometric = await Biometric.findById(req.params.id);

  if (!biometric) {
    res
      .status(500)
      .json({ message: "The biometric with the given ID was not found!" });
  }

  res.status(200).send(biometric);
});

router.post("/", async (req, res) => {
  let biometric = new Biometric({
    agentId: req.body.agentId,
    signature: req.body.signature,
    deviceId: req.body.deviceId,
    deviceModel: req.body.deviceModel,
    deviceOS: req.body.deviceOS,
    loginLocation: req.body.loginLocation,
  });
  console.log("biometric: ", biometric);
  biometric = await biometric.save();

  if (!biometric)
    return res
      .status(400)
      .send({ success: false, message: "the biometric cannot be created!" });

  res.send(biometric);
});

router.delete("/:id", (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Biometric Id");
  }

  Biometric.findByIdAndRemove(req.params.id)
    .then((biometric) => {
      if (biometric) {
        return res
          .status(200)
          .json({ success: true, message: "the biometric is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "the biometric not found!" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Biometric Id");
  }

  const biometric = await Biometric.findByIdAndUpdate(req.params.id, {
    agentId: req.body.agentId,
    signature: req.body.signature,
    deviceId: req.body.deviceId,
    deviceModel: req.body.deviceModel,
    deviceOS: req.body.deviceOS,
    loginLocation: req.body.loginLocation,
  });

  if (!biometric)
    return res
      .status(401)
      .send({ success: false, message: "the biometric cannot be update!" });

  res.send(biometric);
});

router.put("/:agentId/biometric", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.agentId)) {
    return res.status(400).send("Invalid Agent Id");
  }

  const biometric = await Biometric.findOneAndUpdate(
    { agentId: req.params.agentId },
    {
      biometricPublicKey: req.body.biometricPublicKey,
    },
    { returnOriginal: true }
  );

  console.log("biometric: ", biometric);

  if (!biometric)
    return res
      .status(401)
      .send({ success: false, message: "the biometric cannot be update!" });

  res.status(200).send({ success: true });
});

router.get("/:agentId/verify-biometric", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.agentId)) {
    return res.status(400).send("Invalid Agent Id");
  }

  const biometricByAgent = await Biometric.findOne({
    agentId: req.params.agentId,
  });

  console.log("eq.params.: ", req.params);

  console.log("eq.query: ", req.query);

  console.log("biometricByAgent: ", biometricByAgent);

  if (!biometricByAgent) {
    res.status(500).json({ success: false });
  }

  if (
    req.query.signature === biometricByAgent.signature &&
    req.query.deviceId === biometricByAgent.deviceId
  ) {
    res.status(200).send({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
