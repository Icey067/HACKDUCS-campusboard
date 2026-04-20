/**
 * CampusBoard — Express Server Entry Point
 * Unified college notice & opportunity hub for Indian students.
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");
const { startReminderCron } = require("./cron/reminders");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// ── API Routes ──
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notices", require("./routes/notices"));
app.use("/api/bookmarks", require("./routes/bookmarks"));

// ── Health check ──
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "CampusBoard API",
    timestamp: new Date().toISOString(),
  });
});

// ── Global error handler ──
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ── Start server ──
app.listen(PORT, () => {
  console.log(`\n🚀 CampusBoard API running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || "development"}\n`);

  // Start cron jobs
  if (process.env.SMTP_USER) {
    startReminderCron();
  } else {
    console.log("📧 Email reminders disabled (no SMTP config)");
  }
});

module.exports = app;
