/**
 * Migration runner — executes all .sql files in order.
 * Run with: npm run migrate
 */
const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

async function runMigrations() {
  const migrationsDir = __dirname;
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  console.log(`🔄 Running ${files.length} migration(s)...\n`);

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, "utf-8");

    try {
      await pool.query(sql);
      console.log(`  ✅ ${file}`);
    } catch (err) {
      console.error(`  ❌ ${file}:`, err.message);
      process.exit(1);
    }
  }

  console.log("\n🎉 All migrations complete!");
  process.exit(0);
}

runMigrations();
