const Url = require("../models/Url.model");
const Visit = require("../models/Visit.model");
const UAParser = require("ua-parser-js");
const geoip = require("geoip-lite");

const redirectToOriginalUrl = async (req, res) => {
  try {
    const code = req.params.code || req.params.shortCode;
    const aliasCode = typeof code === "string" ? code.toLowerCase() : code;
    const url = await Url.findOne({
      $or: [{ shortCode: code }, { customAlias: aliasCode }],
    });
    // Handle multiple origins in FRONTEND_URL (common for CORS)
    const origins = process.env.FRONTEND_URL 
      ? process.env.FRONTEND_URL.split(',').map(u => u.trim().replace(/\/$/, ""))
      : ['http://localhost:5173'];
    
    // Pick the most appropriate origin:
    // 1. If in production, prefer the first non-localhost origin if available
    // 2. Otherwise just pick the first one
    let targetOrigin = origins[0];
    if (process.env.NODE_ENV === 'production' && origins.length > 1) {
      const prodOrigin = origins.find(o => !o.includes('localhost') && !o.includes('127.0.0.1'));
      if (prodOrigin) targetOrigin = prodOrigin;
    }

    const getRedirectUrl = (path, params = {}) => {
      const url = new URL(`${targetOrigin}/${path}`);
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
      return url.toString();
    };

    if (!url) {
      return res.redirect(getRedirectUrl('not-found', { code }));
    }
    if (!url.isActive) {
      return res.redirect(getRedirectUrl('expired', { alias: url.shortCode, status: 'disabled' }));
    }
    if (url.expiresAt && url.expiresAt < new Date()) {
      return res.redirect(getRedirectUrl('expired', { 
        alias: url.shortCode, 
        expiresAt: url.expiresAt.toISOString() 
      }));
    }
    const parser = new UAParser(req.headers["user-agent"]);
    const result = parser.getResult();
    await Visit.create({
      url: url._id,
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      country: geoip.lookup(req.headers["x-forwarded-for"] || req.socket.remoteAddress)?.country || "IN",
      city: geoip.lookup(req.headers["x-forwarded-for"] || req.socket.remoteAddress)?.city || "CBE",
      browser: result.browser.name || "Unknown",
      os: result.os.name || "Unknown",
      device: result.device.type || "Desktop",
      userAgent: req.headers["user-agent"],
      referrer: req.headers["referer"] || req.headers["referrer"] || "Direct",
    });
    url.clicks += 1;
    await url.save();
    return res.redirect(url.originalUrl);
  } catch (error) {
    console.error("Redirect Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  redirectToOriginalUrl,
};
