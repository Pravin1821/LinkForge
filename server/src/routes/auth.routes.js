const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require("../controllers/auth.controller");

const authMiddleware = require("../middleware/auth.middleware");
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getCurrentUser);

module.exports = router;
