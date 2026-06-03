require("dotenv").config();
const mongoose = require("mongoose");
const Url = require("./src/models/Url.model");
const generateQRCode = require("./src/utils/generateQRCode");

async function migrate() {
  try {
    console.log("Starting migration...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
      console.error("BASE_URL environment variable is missing. Migration aborted.");
      process.exit(1);
    }

    const cleanBaseUrl = baseUrl.replace(/\/$/, "");
    
    // Find URLs that still point to localhost
    const urlsToUpdate = await Url.find({
      shortUrl: { $regex: /localhost:5000/ }
    });

    console.log(`Found ${urlsToUpdate.length} URLs pointing to localhost.`);

    for (const url of urlsToUpdate) {
      const oldUrl = url.shortUrl;
      const newUrl = `${cleanBaseUrl}/${url.shortCode}`;
      
      console.log(`Updating ${url.shortCode}: ${oldUrl} -> ${newUrl}`);
      
      url.shortUrl = newUrl;
      url.qrCode = await generateQRCode(newUrl);
      
      await url.save();
    }

    console.log("Migration completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
