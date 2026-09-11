require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const db = require("./db");
const fs = require("fs");
const path = require("path");

async function migrate() {
  // Em um banco novo (como no Railway), cria primeiro o esquema base.
  const schema = fs.readFileSync(path.join(__dirname, "..", "sql", "schema.sql"), "utf8");
  for (const statement of schema.split(/;\s*(?:\r?\n|$)/).map((item) => item.trim()).filter((item) => item && !/^CREATE DATABASE|^USE\s/i.test(item))) await db.query(statement);
  const [columns] = await db.query("DESCRIBE projects");
  if (!columns.some((column) => column.Field === "approval_status")) {
    await db.query("ALTER TABLE projects ADD COLUMN approval_status ENUM('pending','accepted','rejected') NOT NULL DEFAULT 'pending' AFTER features");
  }
  if (!columns.some((column) => column.Field === "progress_percent")) await db.query("ALTER TABLE projects ADD COLUMN progress_percent TINYINT UNSIGNED NOT NULL DEFAULT 0 AFTER approval_status");
  await db.query(`CREATE TABLE IF NOT EXISTS project_notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    recipient_user_id INT NOT NULL,
    message VARCHAR(500) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_notification_recipient FOREIGN KEY (recipient_user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notifications_recipient (recipient_user_id, created_at)
  ) ENGINE=InnoDB`);
  const [userColumns] = await db.query("DESCRIBE users");
  if (!userColumns.some((column) => column.Field === "email_verified")) await db.query("ALTER TABLE users ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT FALSE AFTER email");
  if (!userColumns.some((column) => column.Field === "phone_verified")) await db.query("ALTER TABLE users ADD COLUMN phone_verified BOOLEAN NOT NULL DEFAULT FALSE AFTER phone");
  if (!userColumns.some((column) => column.Field === "is_active")) await db.query("ALTER TABLE users ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE AFTER is_admin");
  if (!userColumns.some((column) => column.Field === "session_version")) await db.query("ALTER TABLE users ADD COLUMN session_version INT NOT NULL DEFAULT 1 AFTER is_active");
  await db.query(`CREATE TABLE IF NOT EXISTS auth_codes (
    id CHAR(36) PRIMARY KEY,
    user_id INT NOT NULL,
    channel ENUM('email','phone') NOT NULL,
    code_hash CHAR(64) NOT NULL,
    attempts TINYINT NOT NULL DEFAULT 0,
    expires_at DATETIME NOT NULL,
    consumed_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_auth_code_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_auth_codes_user (user_id, created_at)
  ) ENGINE=InnoDB`);
  console.log("Migração concluída.");
  await db.end();
}

migrate().catch((error) => { console.error(error); process.exitCode = 1; });
