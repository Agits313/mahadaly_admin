/* -------------------------------------------------------------------------- */
/*               Router, Project starter - Thejagat, andibastian              */
/* -------------------------------------------------------------------------- */

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
var favicon = require("serve-favicon");
dotenv.config();

const port = process.env.APP_PORT;
app.use(cors());

/* -------------------------------------------------------------------------- */
/*                                   Static                                   */
/* -------------------------------------------------------------------------- */
app.use(favicon(path.join(__dirname, "../..", "public", "favicon.ico")));
app.use(express.static("public"));
app.use("/asset", express.static(path.join(__dirname, "../..", "public", "uploads")));
app.use("/koleksibuku", express.static(path.join(__dirname, "../..", "public", "uploads", "koleksibuku")));
app.use("/template", express.static(path.join(__dirname, "../..", "public", "template")));

app.use(bodyParser.json({ limit: "150mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "150mb",
    parameterLimit: 50000,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/admin/socketview", express.static(path.join(__dirname, "../../", "node_modules", "@socket.io", "admin-ui", "ui", "dist")));
app.use("/applib", express.static(path.resolve(__dirname, "../../", "node_modules")));

console.log(path.join(__dirname, "../..", "command"));
/* -------------------------------------------------------------------------- */
/*                                   routes                                   */
/* -------------------------------------------------------------------------- */
const routesAdmin = "./routes/admin";
const routeAdminFiles = fs.readdirSync(routesAdmin).filter((file) => !file.includes("conf") && !file.includes("custom"));
const routesGeneral = "./routes/general";
const routeGeneralFiles = fs.readdirSync(routesGeneral).filter((file) => !file.includes("conf") && !file.includes("custom"));

const routesMember = "./routes/member";
const routeMemberFiles = fs.readdirSync(routesMember).filter((file) => !file.includes("conf") && !file.includes("custom"));
/* -------------------------------------------------------------------------- */
/*                                    Docs                                    */
/* -------------------------------------------------------------------------- */
const { swaggerUi, swagger_theme_default, swaggerDocument } = require("../../docs/index");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, swagger_theme_default));

routeAdminFiles.forEach((file) => {
  const route = path.resolve(routesAdmin, file);
  app.use(require(route));
});
routeMemberFiles.forEach((file) => {
  const route = path.resolve(routesMember, file);
  app.use(require(route));
});
routeGeneralFiles.forEach((file) => {
  const route = path.resolve(routesGeneral, file);
  app.use(require(route));
});
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = {
  app,
  port,
  server,
};
