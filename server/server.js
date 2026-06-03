require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
    console.warn(
      "Starting server without MongoDB connection (development mode).",
    );
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`BASE_URL: ${process.env.BASE_URL || 'Not Set (using request host)'}`);
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  });
};

startServer();
