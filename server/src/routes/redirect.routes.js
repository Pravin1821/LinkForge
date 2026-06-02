const express = require("express");
const router = express.Router();
const { redirectToOriginalUrl } = require("../controllers/redirect.controller");
router.get("/:code", redirectToOriginalUrl);
module.exports = router;
