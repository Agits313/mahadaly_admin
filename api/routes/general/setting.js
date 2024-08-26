const express = require("express");
const router = express.Router();
const { dev_mode, setQuery, setResponse, setDefaultNull, constantMessage, getData, runQuery } = require("../../helper/index");

const mainurl = "/general";

router.post(`${mainurl}/setting`, async (req, res) => {
  const { max_day, denda_harian } = req.body;
  if (!max_day || !denda_harian) {
    const response =
      dev_mode === "development"
        ? {
            message: "Invalid parameter",
            request: req.body,
          }
        : { message: "Invalid parameter" };
    return setResponse(response, 400, res);
  }
  try {
    const checkData = await getData(`select * from _m_pengaturan`);
    let query = `insert into _m_pengaturan (max_day,denda_harian) values (?,?)`;
    if (checkData.length > 0) {
      query = `update _m_pengaturan set max_day=?, denda_harian=?`;
    }
    let insert = await runQuery(query, [max_day, denda_harian]);
    const results = await getData(`select * from _m_pengaturan`);
    const response =
      dev_mode === "development"
        ? {
            message: constantMessage.success,
            data: results,
          }
        : { message: constantMessage.success, data: results };
    return setResponse(response, 200, res);
  } catch (error) {
    console.log(error);
    const response =
      dev_mode === "development"
        ? {
            message: constantMessage.error,
            error,
          }
        : { message: constantMessage.error, error };
    setResponse(response, 500, res);
  }
});

router.get(`${mainurl}/setting`, async (req, res) => {
  const query = `select * from _m_pengaturan`;
  const results = await getData(query);
  let output = "'";
  if (results.length > 0) {
    output = results[0];
  }

  const response =
    dev_mode === "development"
      ? {
          message: constantMessage.success,
          data: output,
        }
      : { message: constantMessage.success, data: output };
  return setResponse(response, 200, res);
});

module.exports = router;
