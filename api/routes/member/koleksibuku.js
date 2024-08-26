const express = require("express");
const router = express.Router();
const { dev_mode, setQuery, setResponse, setDefaultNull, validateMandatoryFields, getData, constantMessage } = require("../../helper/index");

const mainurl = "/web";

router.post(`${mainurl}/kategoribuku`, async (req, res) => {
  /*
    #swagger.tags = ['Public']
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/KategoriBuku"
                }
            }
        }
    }
  */
  let { search } = req.body;
  search = setDefaultNull(search);
  try {
    const queryKategori = `select * from _m_kategori_buku where is_delete='0' and is_active='1' order by \`name\` `;
    const getDataKategori = await getData(queryKategori);
    for (const key of getDataKategori) {
      const { id } = key;
      key.totalBuku = 0;
      const queryBuku = `select * from _m_buku where id_kategori='${id}' and is_active='1'`;
      const getDataBuku = await getData(queryBuku);
      if (getDataBuku.length > 0) {
        key.totalBuku = getDataBuku.length;
      }
    }
    const results = getDataKategori;
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

router.post(`${mainurl}/koleksibuku`, async (req, res) => {
  /*
    #swagger.tags = ['Public']
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/KoleksiBuku"
                }
            }
        }
    }
  */
  const { id_kategori, search } = req.body;

  if (!id_kategori) {
    const response =
      dev_mode === "development"
        ? {
            message: "Invalid parameter",
            request: req.body,
          }
        : { message: "Invalid parameter" };
    setResponse(response, 400, res);
    return false;
  }

  try {
    const query = `select * from _m_buku where id_kategori='${id_kategori}'`;
    const getDataBuku = await getData(query);
    for (const key of getDataBuku) {
      key.stok = 0;
      key.cover = setDefaultNull(key.cover);
      key.coverPath = null;
      if (key.cover) {
        key.coverPath = `koleksibuku/${key.cover}`;
      }
      const getStok = await getData(`select stok from _d_stok_buku where id_buku='${key.id}' and id_kategori='${key.id_kategori}'`);
      if (getStok.length > 0) {
        key.stok = getStok[0].stok;
      }
    }
    const results = getDataBuku;
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
