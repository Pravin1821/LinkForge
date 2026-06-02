const Url = require("../models/Url.model");
const Visit = require("../models/Visit.model");
const UAParser = require("ua-parser-js");

const redirectToOriginalUrl = async (req, res) => {
  try {
    const code = req.params.code || req.params.shortCode;
    const aliasCode = typeof code === "string" ? code.toLowerCase() : code;
    const url = await Url.findOne({
      $or: [{ shortCode: code }, { customAlias: aliasCode }],
    });
    if (!url) {
      return res
        .status(404)
        .json({ success: false, message: "Short URL not found" });
    }
    if (!url.isActive) {
      return res
        .status(404)
        .json({ success: false, message: "Short Link disabled" });
    }
    if (url.expiresAt && url.expiresAt < new Date()) {
      return res
        .status(410)
        .json({ success: false, message: "Short URL has expired" });
    }
    const parser = new UAParser(req.headers["user-agent"]);
    const result = parser.getResult();
    await Visit.create({
      url: url._id,
      ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      browser: result.browser.name || "Unknown",
      os: result.os.name || "Unknown",
      device: result.device.type || "Desktop",
      userAgent: req.headers["user-agent"],
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
