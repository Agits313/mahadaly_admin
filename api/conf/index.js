/* -------------------------------------------------------------------------- */
/*             MYSQL Conf, Project starter - Thejagat, andibastian            */
/* -------------------------------------------------------------------------- */

const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

// Database connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  multipleStatements: true,
});

const connectionNoDb = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  multipleStatements: true,
});
function keepConnectionAlive() {
  connection.query("SELECT 1", (error) => {
    if (error) {
      console.error("Error executing keep-alive query:", error);
    }
  });
}
setInterval(keepConnectionAlive, 30000);
connection.connect((error) => {
  if (error) {
    console.error("Error connecting to MySQL database:", error);
  } else {
    console.log("Connected to MySQL database");
  }
});
connection.on("error", (err) => {
  console.error("MySQL error:", err);
});
module.exports = {
  connection,
  connectionNoDb,
};
