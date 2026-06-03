const Url = require("../models/Url.model");
const Visit = require("../models/Visit.model");

const getUrlAnalytics = async (req, res) => {
  try {
    const urlId = req.params.id;
    const url = await Url.findOne({ _id: urlId, user: req.user.id });
    if (!url) {
      return res.status(404).json({ success: false, message: "URL not found" });
    }
    const visits = await Visit.find({ url: url._id })
      .sort({ timestamp: -1 })
      .limit(50);
    const totalClicks = url.clicks;
    const lastVisited = visits.length > 0 ? visits[0].timestamp : null;
    const browserAggregation = await Visit.aggregate([
      { $match: { url: url._id } },
      { $group: { _id: "$browser", count: { $sum: 1 } } },
    ]);
    const deviceAggregation = await Visit.aggregate([
      { $match: { url: url._id } },
      { $group: { _id: "$device", count: { $sum: 1 } } },
    ]);
    const countryAggregation = await Visit.aggregate([
      { $match: { url: url._id } },
      { $group: { _id: "$country", count: { $sum: 1 } } },
    ]);
    const browserStats = {};
    browserAggregation.forEach((item) => {
      browserStats[item._id || "Unknown"] = item.count;
    });
    const deviceStats = {};
    deviceAggregation.forEach((item) => {
      deviceStats[item._id || "Unknown"] = item.count;
    });
    const countryStats = {};
    countryAggregation.forEach((country) => {
      countryStats[country._id || "IN"] = country.count;
    });
    res.status(200).json({
      success: true,
      analytics: {
        totalClicks,
        lastVisited,
        browserStats,
        deviceStats,
        countryStats,
        recentVisits: visits.map((visit) => ({
          timestamp: visit.timestamp,
          ip: visit.ip,
          browser: visit.browser,
          os: visit.os,
          device: visit.device,
          country: visit.country,
          referrer: visit.referrer,
        })),
      },
    });
  } catch (error) {
    console.error("Get URL Analytics Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getClickTrends = async (req, res) => {
  try {
    const urlId = req.params.id;
    const url = await Url.findOne({ _id: urlId, user: req.user.id });
    if (!url) {
      return res.status(404).json({ success: false, message: "URL not found" });
    }
    const chartData = await Visit.aggregate([
      { $match: { url: url._id } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    res.status(200).json({
      success: true,
      chartData: chartData.map((item) => ({
        date: item._id,
        clicks: item.count,
      })),
    });
  } catch (error) {
    console.error("Get Click Trends Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getWorkspaceAnalytics = async (req, res) => {
  try {
    const urls = await Url.find({ user: req.user.id });
    const urlIds = urls.map((url) => url._id);
    
    const totalLinks = urls.length;
    const activeLinks = urls.filter(u => u.isActive !== false).length;
    const totalClicks = urls.reduce((acc, url) => acc + (url.clicks || 0), 0);

    const recentVisits = await Visit.find({ url: { $in: urlIds } })
      .sort({ timestamp: -1 })
      .limit(20)
      .populate("url", "shortCode originalUrl");

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const chartData = await Visit.aggregate([
      { $match: { url: { $in: urlIds }, timestamp: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const countryAggregation = await Visit.aggregate([
      { $match: { url: { $in: urlIds } } },
      { $group: { _id: "$country", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    const cityAggregation = await Visit.aggregate([
      { $match: { url: { $in: urlIds } } },
      { $group: { _id: "$city", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        totalLinks,
        activeLinks,
        totalClicks,
        chartData: chartData.map((item) => ({
          date: item._id,
          clicks: item.count,
        })),
        recentVisits: recentVisits.map((visit) => ({
          _id: visit._id,
          url: visit.url,
          timestamp: visit.timestamp,
          ip: visit.ip,
          country: visit.country,
          city: visit.city,
          browser: visit.browser,
          device: visit.device,
          referrer: visit.referrer,
        })),
        countryStats: countryAggregation,
        cityStats: cityAggregation
      },
    });
  } catch (error) {
    console.error("Get Workspace Analytics Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getUrlAnalytics,
  getClickTrends,
  getWorkspaceAnalytics,
  getWorkspaceAnalytics,
};
