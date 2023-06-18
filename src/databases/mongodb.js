require("dotenv").config();
const mongoose = require("mongoose");

// MongoDB connection URI
const mongoURI = process.env.MONGO_URI;

// Create a connection to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected 🚀");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
