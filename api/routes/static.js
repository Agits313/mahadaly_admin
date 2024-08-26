const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
dotenv.config();
router.get("/", (req, res) => {
  let file = path.resolve("public/pages/index.html");
  fs.readFile(file, (error, data) => {
    if (error) {
      console.error("Error reading file:", error);
      return;
    }
    const $ = cheerio.load(data);
    const element = $(".app_version");
    if (element.length > 0) {
      element.text(process.env.APP_VERSION);
    }
    res.send($.html());
  });
});
module.exports = router;
