const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getCurrentUser,
  updateProfile,
  updatePassword,
  deleteAccount
} = require("../controllers/auth.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getCurrentUser);
router.put("/profile", authMiddleware, updateProfile);
router.put("/password", authMiddleware, updatePassword);
router.delete("/account", authMiddleware, deleteAccount);

module.exports = router;
