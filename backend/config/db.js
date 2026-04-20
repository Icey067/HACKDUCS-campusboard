/**
 * PostgreSQL connection pool configuration.
 * Uses DATABASE_URL from environment for Railway compatibility.
 */
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Quick connection health check on startup
pool.on("connect", () => {
  console.log("📦 Connected to PostgreSQL");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected PostgreSQL error:", err);
  process.exit(-1);
});

module.exports = pool;
