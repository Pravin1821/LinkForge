const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { getUrlAnalytics, getClickTrends, getWorkspaceAnalytics } = require("../controllers/analytics.controller");

router.get("/global", authMiddleware, getWorkspaceAnalytics);
router.get("/:id", authMiddleware, getUrlAnalytics);
router.get("/:id/chart", authMiddleware, getClickTrends);

module.exports = router;