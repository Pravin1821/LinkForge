const mongoose = require("mongoose");
const urlSchema = new mongoose.Schema(
    {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    originalUrl: {
      type: String,
      required: true,
      trim: true,
    },

    shortCode: {
      type: String,
      required: true,
      unique: true,
    },

    customAlias: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },

    shortUrl: {
      type: String,
      required: true,
    },

    qrCode: {
      type: String,
      default: null,
    },

    clicks: {
      type: Number,
      default: 0,
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Url", urlSchema);
