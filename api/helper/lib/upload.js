/* -------------------------------------------------------------------------- */
/*          upload Helper - Pelengkap modul  - Thejagat, andibastian          */
/* -------------------------------------------------------------------------- */

const dotenv = require("dotenv");
dotenv.config();
const { isDirExists, createDir, addStringToFileName } = require("../index");
const multer = require("multer");

var uploadHelper = (module.exports = {
  storage: function (param) {
    return multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, param.location);
      },
      filename: function (req, file, cb) {
        const { id_data, label } = req.params;
        cb(null, id_data + "_" + label + "_" + Date.now() + path.extname(file.originalname));
      },
    });
  },
  uploadFile: function (param) {
    const location = param.location;
    if (!isDirExists(location)) {
      createDir(location);
    }
    return multer({ storage: storage });
  },
});
