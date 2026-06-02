const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { getUrlAnalytics, getClickTrends } = require("../controllers/analytics.controller");
router.get("/:id", authMiddleware, getUrlAnalytics);
router.get("/:id/chart", authMiddleware, getClickTrends);
module.exports = router;