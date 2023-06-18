const { Schema, model } = require("mongoose");

// Define the User schema
const userSchema = new Schema({
  name: String,
  surname: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
});

// Create and export the User model
module.exports = model("User", userSchema);
