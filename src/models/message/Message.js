const { Schema, model } = require("mongoose");

// Define the User schema
const messageSchema = new Schema({
  //reference to the user author
  room: {
    _id: { type: Schema.Types.ObjectId, ref: "Room" },
    //in order to avoid the populate too many times we can just store the name of the room
    name: String,
  },
  author: {
    _id: { type: Schema.Types.ObjectId, ref: "User" },
    //in order to avoid the populate for every message we can just store the email of the user
    email: String,
  },
  message: String,
  time: Schema.Types.Date,
});

// Create and export the User model
module.exports = model("Message", messageSchema);
