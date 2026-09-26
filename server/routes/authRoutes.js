const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  register,
  login,
  refresh,
  logout,
  me,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", authMiddleware, me);

module.exports = router;
