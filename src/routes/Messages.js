const express = require("express");
const Message = require("../models/message/Message");
const router = express.Router();

router.get("/", async (req, res) => {
  const messages = await Message.find({});
  return res.json(messages);
});

router.get("/:id", async (req, res) => {
  const messageId = req.params.id;
  if (!messageId)
    return res.status(400).json({ error: "Message id not provided" });
  const message = await Message.findOne({ _id: messageId });
  if (!message) return res.status(404).json({ error: "Message not found" });

  return res.json(message);
});

//get messages of the room
router.get("/room/:id", async (req, res) => {
  const roomId = req.params.id;
  if (!roomId) return res.status(400).json({ error: "Room id not provided" });
  const roomMessages = await Message.find({ "room._id": roomId }, null, {
    sort: { time: 1 },
    limit: 3,
  });
  return res.json(roomMessages);
});

router.post("/", async (req, res) => {
  const message = req.body;
  if (!message)
    return res.status(400).json({ error: "Message details not provided" });
  const messageRes = await Message.create(message).catch((err) => {
    return res.status(400).json({ error: err });
  });
  if (!messageRes)
    return res.status(404).json({ error: "Message not created" });

  return res.status(200).json(message);
});

module.exports = router;
