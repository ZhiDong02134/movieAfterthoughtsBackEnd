const mysql = require("mysql");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
  multipleStatements: true,
});

connection.query("SELECT 1", function (error) {
  if (error) throw error;
  // connected!
});

module.exports = connection;
