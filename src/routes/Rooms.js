const express = require("express");
const Room = require("../models/room/Room");
const router = express.Router();

router.get("/", async (req, res) => {
  const rooms = await Room.find({});
  return res.json(rooms);
});

router.get("/:id", async (req, res) => {
  const roomId = req.params.id;
  if (!roomId) return res.status(400).json({ error: "Room id not provided" });
  const room = await Room.findOne({ _id: roomId });
  if (!room) return res.status(404).json({ error: "Room not found" });

  return res.json(room);
});

//create new room
router.post("/", async (req, res) => {
  const room = req.body;
  if (!room)
    return res.status(400).json({ error: "Room details not provided" });
  const roomRes = await Room.create(room).catch((err) => {
    return res.status(400).json({ error: err });
  });
  if (!roomRes) return res.status(404).json({ error: "Room not created" });

  return res.status(200).json(roomRes);
});

module.exports = router;
