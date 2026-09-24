const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getPRs,
  getPRById,
  createPR,
  approvePR,
  rejectPR,
} = require("../controllers/prController");

const router = express.Router();

router.get("/", getPRs);
router.get("/:id", getPRById);
router.post("/", authMiddleware, createPR);
router.patch("/:id/approve", authMiddleware, approvePR);
router.patch("/:id/reject", authMiddleware, rejectPR);

module.exports = router;
