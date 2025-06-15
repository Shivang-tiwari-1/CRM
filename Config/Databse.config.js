require("dotenv").config();
const mariadb = require("mariadb");
const fs = require("fs").promises;
const path = require("path");
const pool = mariadb.createPool({
  host: process.env.SQLHOSTNAME || "127.0.0.1",
  port: process.env.SQLPORT || 3306,
  user: process.env.SQLUSERNAME || "root",
  password: process.env.SQLPASSWORD || "admin",
  database: process.env.DBNAME,
  connectionLimit: 10,
  acquireTimeout: 30000,
});

async function initializeDatabase() {
  let conn;
  try {
    console.log("Starting database initialization...");
    conn = await pool.getConnection();

    await conn.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DBNAME}`);
    await conn.query(`USE ${process.env.DBNAME}`);

    const schemaPath = path.join(__dirname, "../Database/Schema.model.sql");
    const schemaSQL = await fs.readFile(schemaPath, "utf8");

    const statements = schemaSQL
      .split(";")
      .filter((stmt) => stmt.trim())
      .map((stmt) => {
        if (stmt.trim().toUpperCase().startsWith("CREATE TABLE")) {
          return stmt.replace("CREATE TABLE", "CREATE TABLE IF NOT EXISTS");
        }
        return stmt;
      });

    for (const statement of statements) {
      if (statement.trim()) {
        await conn.query(statement);
      }
    }

    console.log("Database schema check completed successfully");
  } catch (err) {
    console.log("Database status:", err.message);
  } finally {
    if (conn) conn.release();
  }
}

module.exports = { pool, initializeDatabase };
