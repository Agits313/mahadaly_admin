const express = require("express");
const router = express.Router();
const { dev_mode, setQuery, setResponse, setDefaultNull, validateMandatoryFields, isDirExists, createDir } = require("../../helper/index");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const mainurl = "/general";
const uploadDir = "./" + process.env.UPLOAD_DIR + "/temp";

if (!isDirExists(uploadDir)) {
  createDir(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const { uuid, prefix, id } = req.body;
    let uniqueFilename = uuid;
    if (prefix) {
      uniqueFilename = `${prefix}-${uuid}`;
    }
    const fileExtension = file.originalname.split(".").pop();
    const getUniqueFilename = (filename, extension, count, id = null) => {
      if (!id) {
        if (count > 0) {
          return `${filename}-${count}.${extension}`;
        } else {
          return `${filename}-0.${extension}`;
        }
      } else {
        const randomNumber = Math.floor(Math.random() * 900000) + 100000;
        const newFileName = id.toString() + randomNumber.toString().padStart(6, "0");
        console.log(id, newFileName);
        return `${filename}-${newFileName}.${extension}`;
      }
    };
    let count = 0;
    let filename = getUniqueFilename(uniqueFilename, fileExtension, count, id);
    while (fs.existsSync(path.join(uploadDir, filename))) {
      count++;
      filename = getUniqueFilename(uniqueFilename, fileExtension, count, id);
    }

    cb(null, filename);
  },
});

const upload = multer({ storage: storage });
router.post(`${mainurl}/upload_temp`, upload.single("file"), async (req, res) => {
  /*
  #swagger.tags = ['General']
  #swagger.requestBody = {
      required: true,
      content: {
          "application/json": {
              schema: {
                  $ref: "#/components/schemas/GeneralUploadFile"
              }  
          }
      }
    }
  */
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileName = req.file.originalname;
    const filePath = req.file.path;

    res.status(200).json({ fileName, filePath });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
