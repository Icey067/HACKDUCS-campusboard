/**
 * PostgreSQL connection pool configuration.
 * Supports Google Cloud SQL Connector or standard DATABASE_URL.
 */
const { Pool } = require("pg");
const { Connector } = require("@google-cloud/cloud-sql-connector");
require("dotenv").config();

let poolPromise = null;

async function getPool() {
  if (poolPromise) return poolPromise;

  if (process.env.CLOUD_SQL_CONNECTION_NAME) {
    // Use Google Cloud SQL Connector (IAM based, secure)
    const connector = new Connector();
    poolPromise = connector.getOptions({
      instanceConnectionName: process.env.CLOUD_SQL_CONNECTION_NAME,
      ipType: process.env.CLOUD_SQL_IP_TYPE || "PUBLIC",
    }).then(clientOpts => {
      const p = new Pool({
        ...clientOpts,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
      p.on("connect", () => console.log("📦 Connected to GCP Cloud SQL via Connector"));
      p.on("error", (err) => console.error("❌ Unexpected PostgreSQL error:", err));
      return p;
    });
  } else {
    // Standard Connection via connectionString
    const p = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    });
    p.on("connect", () => console.log("📦 Connected to PostgreSQL Database"));
    p.on("error", (err) => console.error("❌ Unexpected PostgreSQL error:", err));
    poolPromise = Promise.resolve(p);
  }

  return poolPromise;
}

// Export query handler that lazily initializes pool and executes queries
module.exports = {
  query: async (text, params) => {
    const pool = await getPool();
    return pool.query(text, params);
  },
  getPool
};
