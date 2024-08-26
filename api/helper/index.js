/* -------------------------------------------------------------------------- */
/*    Main Helper - Pelengkap modul project starter - Thejagat, andibastian   */
/* -------------------------------------------------------------------------- */

const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const dev_mode = process.env.DEV_MODE;
const { constantMessage, excludeKeys } = require("./lib/constant");
const { setResponse } = require("./lib/response");
const { getData, runQuery, setQuery, insertLogUser, connection, connectionNoDb } = require("./lib/query");
const fs = require("fs");
const util = require("util");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const readFileAsync = util.promisify(fs.readFile);

var helper = (module.exports = {
  dev_mode,
  constantMessage,
  excludeKeys,
  getData,
  runQuery,
  setQuery,
  insertLogUser,
  setResponse,
  connection,
  connectionNoDb,
  setDefaultNull: function (data) {
    if (data == "" || data == "undefined" || typeof data == "undefined" || data == null || data == "null" || data == " ") {
      return null;
    } else {
      return data;
    }
  },
  getDateOnly: function (ts = null) {
    if (!ts) {
      ts = Date.now();
    }
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    return year + "-" + month + "-" + date;
  },
  toDay: function () {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    const formattedToday = `${year}-${month}-${day}`;
    return formattedToday;
  },
  toDayDateTime: function () {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  },
  calculateTimeDifference: function (dateTimeString1, dateTimeString2) {
    const date1 = new Date(dateTimeString1);
    const date2 = new Date(dateTimeString2);
    const timeDifferenceInSeconds = Math.abs((date2 - date1) / 1000);
    const hours = Math.floor(timeDifferenceInSeconds / 3600);
    const minutes = Math.floor((timeDifferenceInSeconds % 3600) / 60);
    const seconds = Math.floor(timeDifferenceInSeconds % 60);
    function formatTime(hours, minutes, seconds) {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return formatTime(hours, minutes, seconds);
  },
  unixTimetoDatetime: function (unixtime) {
    var date = new Date(unixtime * 1000);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var formattedDate = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    return formattedDate;
  },
  convertISOtoDatetime: function (iso8601String) {
    var date = new Date(iso8601String);
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    var hours = String(date.getHours()).padStart(2, "0");
    var minutes = String(date.getMinutes()).padStart(2, "0");
    var seconds = String(date.getSeconds()).padStart(2, "0");
    var formattedDate = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    return formattedDate;
  },
  getTimeFromDatetime: function (datetimeString) {
    const date = new Date(datetimeString);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const time = `${hours}:${minutes}:${seconds}`;
    return time;
  },
  indonesianDate: function (dateString) {
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const dateParts = dateString.split("-");
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const day = parseInt(dateParts[2]);
    const formattedDate = `${days[new Date(dateString).getDay()]}, ${day} ${months[month - 1]} ${year}`;
    return formattedDate;
  },
  generateSalt: function () {
    const saltLength = 7;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let salt = "";
    for (let i = 0; i < saltLength; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      salt += chars.charAt(randomIndex);
    }
    return salt;
  },
  isDirExists: function (directoryPath) {
    try {
      fs.accessSync(directoryPath, fs.constants.F_OK);
      return true;
    } catch (error) {
      return false;
    }
  },
  createDir: function (directoryPath) {
    fs.mkdir(directoryPath, { recursive: true }, (error) => {
      if (error) {
        console.error("Error creating directory:", error);
      } else {
        //console.log("Directory created successfully");
      }
    });
  },
  addStringToFileName: function (filePath, newString) {
    const directory = path.dirname(filePath);
    const fileName = path.basename(filePath, path.extname(filePath));
    const fileExtension = path.extname(filePath);
    const newFileName = fileName + "_" + newString + fileExtension;
    const newFilePath = path.join(directory, newFileName);
    return newFilePath;
  },
  validateMandatoryFields: function (fields, requiredFields) {
    for (const field of requiredFields) {
      if (!fields[field]) {
        return false;
      }
    }
    return true;
  },
  hashPassword: async function (plaintextPassword, saltRound = 10) {
    const hash = await bcrypt.hash(plaintextPassword, saltRound);
    return hash;
  },
  isValidLatitude: function (latitude) {
    return typeof latitude === "number" && latitude >= -90 && latitude <= 90;
  },
  isValidLongitude: function (longitude) {
    return typeof longitude === "number" && longitude >= -180 && longitude <= 180;
  },
  validateCoordinates: function (latitude, longitude) {
    return helper.isValidLatitude(latitude) && helper.isValidLongitude(longitude);
  },
  responseHasParent: function (data, subName = "submenuList") {
    const organizedData = [];
    const dataMap = {};

    data.data.forEach((item) => {
      dataMap[item.id] = { ...item, [subName]: [] };
    });

    data.data.forEach((item) => {
      if (item.parent !== 0 && dataMap[item.parent]) {
        dataMap[item.parent][subName].push(dataMap[item.id]);
      } else {
        organizedData.push(dataMap[item.id]);
      }
    });

    return organizedData;
  },
  /* -------------------------------------------------------------------------- */
  /*                                    Files                                   */
  /* -------------------------------------------------------------------------- */
  readFile: async function (filePath) {
    try {
      const data = await readFileAsync(filePath, "utf8");
      // console.log(`File content:\n${data}`);
      return data;
    } catch (err) {
      console.error(`Error reading file: ${err.message}`);
      return err;
    }
  },
  copyDir: async function (src, dest) {
    if (!fs.existsSync(dest)) {
      await fs.mkdirSync(dest, { recursive: true }, () => {});
    }
    return new Promise(async (resolve, reject) => {
      try {
        await fs.cpSync(src, dest, { recursive: true, force: true });
        resolve(`Folder "${path.basename(src)}" successfully copied to "${path.basename(dest)}".`);
      } catch (err) {
        reject(err);
      }
    });
  },
  rmDir: async function (dir) {
    return new Promise(async (resolve, reject) => {
      try {
        await fs.rmSync(dir, { recursive: true, force: true });
        resolve(`Remove dir ${path.basename(dir)} successfully`);
      } catch (error) {
        reject(error);
      }
    });
  },

  /* -------------------------------------------------------------------------- */
  /*                                 Web Socket                                 */
  /* -------------------------------------------------------------------------- */
  setSocketIDSystem: async function (socket_id, socket_event) {
    return new Promise(async (resolve, reject) => {
      try {
        await helper.runQuery(`select count(id) as total from _d_system`, []).then(async (res) => {
          let total = res[0].total;
          if (!total) {
            await helper.runQuery(`insert into _d_system (socket_id,socket_event) values ('${socket_id}','${socket_event}')`);
          } else {
            await helper.runQuery(`update _d_system set socket_id='${socket_id}', socket_event='${socket_event}'`);
          }
        });
        resolve("ok");
      } catch (error) {
        reject(`Error, ${error}`);
      }
    });
  },
  getSocketIDSystem: async function () {
    return new Promise(async (resolve, reject) => {
      try {
        await runQuery(`select socket_id,socket_event from _d_system`, []).then((res) => {
          resolve(res[0]);
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  generateNumberLeadingZero: function (number, length) {
    const numString = String(number);
    const numDigits = numString.length;
    const leadingZeros = "0".repeat(length - numDigits);
    return {
      number,
      generated: leadingZeros + numString,
    };
  },
});
