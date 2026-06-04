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
    const clientUrl = process.env.CLIENT_URL || (process.env.NODE_ENV === 'production' ? `https://${req.get('host')}` : 'http://localhost:5173');
    const getRedirectUrl = (path, params = {}) => {
      const url = new URL(`${clientUrl.replace(/\/$/, "")}/${path}`);
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
