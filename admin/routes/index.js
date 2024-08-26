const express = require("express");
const router = express.Router();
const path = require("path");
let option_menu = {
  root: __dirname + "/../pages",
  headers: {},
};

router.use("/", express.static("pages"));
router.use("/menu", express.static("pages/menu"));
router.use("/pages", express.static("pages"));
router.use("/layout", express.static("pages/layout"));
router.use("/modal", express.static("pages/layout/modal"));
router.use("/js", express.static("src/js"));
router.use("/css", express.static("src/css"));
router.use("/img", express.static("src/img"));
router.use("/applib", express.static("./node_modules"));

router.get("/", (req, res) => {
  res.sendFile(`index.html`, option_menu);
});

router.get("/:menu", (req, res) => {
  let menu = req.params.menu;
  res.sendFile(`index.html`, option_menu);
});

module.exports = router;
