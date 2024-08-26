const mysql = require("mysql");
const dotenv = require("dotenv");
const path = require("path");
const envPath = "../.env";
dotenv.config();
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});
const tableName = process.argv[2];

// console.log(tableName, mainlabel);

if (!tableName) {
  console.error("Error: Please provide a table name as a command line argument.");
  process.exit(1);
}
const viewName = `_v${tableName}`;
const tableAlias = extractAlias(tableName);
function extractAlias(name) {
  const alphanumeric = name.replace(/[^a-zA-Z0-9]/g, "");
  return alphanumeric.substring(0, 2).toLowerCase();
}
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }

  connection.query(`DESCRIBE ${tableName}`, (err, updatedResults) => {
    if (err) {
      console.error("Error describing updated table:", err);
      connection.end();
      return;
    }
    const primaryKeyField = updatedResults.find((result) => result.Key === "PRI");
    const primaryKeyName = primaryKeyField.Field;
    console.log(primaryKeyName);
    connection.end();
  });
});
