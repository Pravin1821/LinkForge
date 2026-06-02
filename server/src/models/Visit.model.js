const mongoose = require("mongoose");
const visitSchema = new mongoose.Schema(
     {
    url: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Url",
      required: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },

    ip: {
      type: String,
    },

    browser: {
      type: String,
    },

    os: {
      type: String,
    },

    device: {
      type: String,
    },

    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Visit", visitSchema);