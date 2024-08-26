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
const mainlabel = process.argv[3];

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

  connection.query(`DESCRIBE ${tableName}`, (err, results) => {
    if (err) {
      console.error("Error describing table:", err);
      connection.end();
      return;
    }

    const hasIsDelete = results.some((result) => result.Field === "is_delete");
    const hasIsActive = results.some((result) => result.Field === "is_active");
    // console.log(hasIsDelete, hasIsActive);
    if (!hasIsDelete) {
      connection.query(`ALTER TABLE ${tableName} ADD COLUMN is_delete INT DEFAULT 0`, (err) => {
        if (err) {
          console.error("Error adding is_delete column:", err);
          connection.end();
          return;
        }
      });
    }

    if (!hasIsActive) {
      connection.query(`ALTER TABLE ${tableName} ADD COLUMN is_active INT DEFAULT 1`, (err) => {
        if (err) {
          console.error("Error adding is_active column:", err);
          connection.end();
          return;
        }
      });
    }

    connection.query(`DESCRIBE ${tableName}`, (err, updatedResults) => {
      if (err) {
        console.error("Error describing updated table:", err);
        connection.end();
        return;
      }
      // const isIdPrimary = updatedResults.some((result) => result.Field === "id" && result.Key === "PRI");
      const isIdPrimary = updatedResults.some((result) => result.Key === "PRI");
      const primaryKeyField = updatedResults.find((result) => result.Key === "PRI");
      const primaryKeyName = primaryKeyField.Field;

      const columnDefinitions = updatedResults
        .map((result) => {
          if (result.Type.toUpperCase().includes("TIMESTAMP") || result.Type.toUpperCase().includes("DATETIME")) {
            return `date_format(\`${tableAlias}\`.\`${result.Field}\`, '%Y-%m-%d %H:%i:%s') AS \`${result.Field}\``;
          } else {
            return `\`${tableAlias}\`.\`${result.Field}\` AS \`${result.Field}\``;
          }
        })
        .join(",\n    ");

      const rowNumberColumn = isIdPrimary ? "`" + tableAlias + "`.`" + primaryKeyName + "` AS `row_number`," : "";
      const viewScript = `CREATE OR REPLACE\nALGORITHM = UNDEFINED VIEW \`${process.env.DB_NAME}\`.\`${viewName}\` AS\nSELECT\n    ${rowNumberColumn}
      \`${tableAlias}\`.\`${mainlabel}\` AS \`main_label\`,
      ${columnDefinitions}\nFROM
      \`${process.env.DB_NAME}\`.\`${tableName}\` \`${tableAlias}\` where \`${tableAlias}\`.\`is_delete\`='0';`;

      // console.log(viewScript);

      connection.query(viewScript, (err, result) => {
        if (err) {
          console.error("Error executing viewScript query:", err);
          connection.end();
          return;
        }

        console.log(viewScript);
        connection.end();
      });
    });
  });
});
