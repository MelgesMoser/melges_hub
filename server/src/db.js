const mysql = require("mysql2/promise");

const connectionUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;
const pool = mysql.createPool(connectionUrl || {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  enableKeepAlive: true,
});

module.exports = pool;
