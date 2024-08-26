const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const basicAuth = require("express-basic-auth");
dotenv.config();
const port = process.env.WEB_PORT;
var cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);
const indexRoute = require("./routes/index");
app.use(indexRoute);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("app"));
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
