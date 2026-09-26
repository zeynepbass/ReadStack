const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getPRs,
  getPRById,
  createPR,
  approvePR,
  rejectPR,
  reopenPR,
  updateProgress,
  addNote,
} = require("../controllers/prController");

const router = express.Router();

router.get("/", getPRs);
router.get("/:id", getPRById);
router.post("/", authMiddleware, createPR);
router.patch("/:id/approve", authMiddleware, approvePR);
router.patch("/:id/reject", authMiddleware, rejectPR);
router.patch("/:id/reopen", authMiddleware, reopenPR);
router.patch("/:id/progress", authMiddleware, updateProgress);
router.post("/:id/notes", authMiddleware, addNote);

module.exports = router;
