const express = require("express");
const { getMonthlyStats } = require("../controllers/statsController");

const router = express.Router();

router.get("/monthly", getMonthlyStats);

module.exports = router;
