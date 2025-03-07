const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      // Set default local MongoDB URI if not provided in environment variables
      process.env.MONGODB_URI = "mongodb://localhost:27017/mentorsarthi";
    }

    // Remove any whitespace from the connection string
    const uri = process.env.MONGODB_URI.trim();

    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(
      "\x1b[32m%s\x1b[0m",
      `MongoDB Connected: ${conn.connection.host}`
    );
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", "Error connecting to MongoDB:");
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
