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

router.use(authMiddleware);

router.get("/", getPRs);
router.get("/:id", getPRById);
router.post("/", createPR);
router.patch("/:id/approve", approvePR);
router.patch("/:id/reject", rejectPR);
router.patch("/:id/reopen", reopenPR);
router.patch("/:id/progress", updateProgress);
router.post("/:id/notes", addNote);

module.exports = router;
