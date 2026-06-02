const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const {
    createShortUrl,
    getUserUrls,
    getUrlById,
    updateUrl,
    deleteUrl,
} = require("../controllers/url.controller");
router.use(authMiddleware);

router.post("/", createShortUrl);
router.get("/", getUserUrls);
router.get("/:id", getUrlById);
router.put("/:id", updateUrl);
router.delete("/:id", deleteUrl);

module.exports = router;