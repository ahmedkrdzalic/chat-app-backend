const { Schema, model } = require("mongoose");

// Define the User schema
const roomSchema = new Schema({
  name: String,
});

// Create and export the User model
module.exports = model("Room", roomSchema);
