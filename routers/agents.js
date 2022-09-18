const { Agent } = require("../models/agent");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  const agentList = await Agent.find();

  if (!agentList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(agentList);
});

router.get("/:id", async (req, res) => {
  const agent = await Agent.findById(req.params.id);

  if (!agent) {
    res
      .status(500)
      .json({ message: "The agent with the given ID was not found!" });
  }

  res.status(200).send(agent);
});

router.post("/", async (req, res) => {
  let agent = new Agent({
    name: req.body.name,
    phone: req.body.phone,
    avatar: req.body.avatar,
    dateOfBirth: req.body.dateOfBirth,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    isAdmin: req.body.isAdmin,
  });

  agent = await agent.save();

  if (!agent) return res.status(400).send("the agent cannot be created!");

  res.send(agent);
});

router.delete("/:id", (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Agent Id");
  }

  Agent.findByIdAndRemove(req.params.id)
    .then((agent) => {
      if (agent) {
        return res
          .status(200)
          .json({ success: true, message: "the agent is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "the agent not found!" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Agent Id");
  }

  const agent = await Agent.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });

  if (!agent) return res.status(401).send("the agent cannot be update!");

  res.send(agent);
});

router.post("/login", async (req, res) => {
  console.log("req: ", req);
  const agent = await Agent.findOne({ email: req.body.email });

  console.log("agent: ", agent);

  if (!agent) {
    return res.status(400).send({
      success: false,
      message: "The email was not found!",
    });
  }

  if (agent && bcrypt.compareSync(req.body.password, agent.passwordHash)) {
    const secret = process.env.secret;
    const token = jwt.sign(
      { useId: agent.id, isAdmin: agent.isAdmin },
      secret,
      {
        expiresIn: "1d",
      }
    );

    res
      .status(200)
      .send({ agent: agent.email, access_token: token, refresh_token: "" });
  } else {
    res.status(400).send("password is wrong!");
  }
});

module.exports = router;
