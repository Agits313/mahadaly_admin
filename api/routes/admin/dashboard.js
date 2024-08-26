const express = require("express");
const router = express.Router();
const { dev_mode, setQuery, setResponse, setDefaultNull, validateMandatoryFields, getData, runQuery, constantMessage } = require("../../helper/index");

const mainurl = "/dashboard";

router.post(`${mainurl}/index`, async (req, res) => {
  /*
        #swagger.tags = ['Dashboard']
    */
  try {
    const queryKategori = `select * from _m_kategori_buku where is_delete='0' and is_active='1' order by name`;
    const getKategori = await getData(queryKategori);
    const listKategori = [];
    for (const key of getKategori) {
      const { id, name } = key;
      const getTotal = await getData(`select count(id) as total from _m_buku where id_kategori='${id}'`);
      listKategori.push({
        name: name,
        total: getTotal[0].total,
      });
    }
    const results = {
      listKategori,
    };
    const response =
      dev_mode === "development"
        ? {
            message: constantMessage.success,
            data: results,
          }
        : { message: constantMessage.success, data: results };
    setResponse(response, 200, res);
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

module.exports = router;
