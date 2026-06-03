const Url = require("../models/Url.model");
const validator = require("validator");
const generateShortCode = require("../utils/generateShortCode");
const generateQRCode = require("../utils/generateQRCode");

const createShortUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias, expiresAt } = req.body;

    if (!originalUrl) {
      return res
        .status(400)
        .json({ success: false, message: "Original URL is required" });
    }

    if (!validator.isURL(originalUrl)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid original URL" });
    }

    const normalizedAlias = customAlias ? customAlias.toLowerCase() : null;
    if (normalizedAlias) {
      const existingAlias = await Url.findOne({ customAlias: normalizedAlias });
      if (existingAlias) {
        return res
          .status(400)
          .json({ success: false, message: "Custom alias already in use" });
      }
    }

    const code = normalizedAlias || generateShortCode();
    
    // Smart fallback for BASE_URL: prioritize env var, then current host
    const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const hostFallback = `${protocol}://${req.get('host')}`;
    const baseUrl = process.env.BASE_URL || hostFallback;
    
    const shortUrl = `${baseUrl}/${code}`;
    const qrCode = await generateQRCode(shortUrl);

    const url = await Url.create({
      user: req.user.id,
      originalUrl,
      shortCode: code,
      customAlias: normalizedAlias,
      shortUrl,
      qrCode,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });

    res.status(201).json({
      success: true,
      message: "Short URL created successfully",
      data: {
        id: url._id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        customAlias: url.customAlias,
        shortUrl: url.shortUrl,
        qrCode: url.qrCode,
        clicks: url.clicks,
        expiresAt: url.expiresAt,
        createdAt: url.createdAt,
      },
    });
  } catch (error) {
    console.error("Create Short URL Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getUserUrls = async (req, res) => {
  try {
    const urls = await Url.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: urls.length, data: urls });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getUrlById = async (req, res) => {
  try {
    const url = await Url.findOne({ _id: req.params.id, user: req.user.id });
    if (!url) {
      return res.status(404).json({ success: false, message: "URL not found" });
    }
    res.status(200).json({ success: true, data: url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateUrl = async (req, res) => {
  try {
    const { originalUrl, expiresAt } = req.body;

    const url = await Url.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "URL not found",
      });
    }

    if (originalUrl) {
      if (!validator.isURL(originalUrl)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid original URL" });
      }
      url.originalUrl = originalUrl;
    }

    if (expiresAt !== undefined) {
      url.expiresAt = expiresAt ? new Date(expiresAt) : null;
    }

    await url.save();

    res.status(200).json({
      success: true,
      message: "URL updated",
      data: url,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const deleteUrl = async (req, res) => {
  try {
    const url = await Url.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "URL not found",
      });
    }

    await url.deleteOne();

    res.status(200).json({
      success: true,
      message: "URL deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createShortUrl,
  getUserUrls,
  getUrlById,
  updateUrl,
  deleteUrl,
};
