require("dotenv").config({ quiet: true });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const prRoutes = require("./routes/prRoutes");
const statsRoutes = require("./routes/statsRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/prs", prRoutes);
app.use("/api/stats", statsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint bulunamadı" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5050;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT);
  })
  .catch((err) => {
    process.stderr.write(`MongoDB bağlantı hatası: ${err.message}\n`);
    process.exit(1);
  });
