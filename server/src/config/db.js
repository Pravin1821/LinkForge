const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set");
  }
  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error.message);
  });
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10_000,
  });
  console.log("MongoDB Connected");
};

module.exports = connectDB;
