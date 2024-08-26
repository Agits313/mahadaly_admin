const express = require("express");
const router = express.Router();
const { dev_mode, setQuery, setResponse, getData, runQuery, constantMessage } = require("../../helper/index");
const { setRequest } = require("./conf/stokbuku");

const mainurl = "/stokbuku";

router.post(`${mainurl}`, async (req, res) => {
  /*
  #swagger.tags = ['Stokbuku']
  #swagger.requestBody = {
      required: true,
      content: {
          "application/json": {
              schema: {
                  $ref: "#/components/schemas/StokbukuAdd"
              }  
          }
      }
    }
  */
  setQuery("select", setRequest(req, res), req.body, res).then((resultSelect) => {
    console.log(resultSelect);

    try {
      const response =
        dev_mode === "development"
          ? {
              message: resultSelect.message,
              query: resultSelect.query,
              queryInsert: resultSelect.queryInsert,
              paramSelect: resultSelect.paramSelect,
              paramInsert: resultSelect.paramInsert,
            }
          : { message: resultSelect.message };
      setResponse(response, resultSelect.code, res);
    } catch (error) {
      console.log(error);
    }
  });
});
router.patch(`${mainurl}`, async (req, res) => {
  /*
    #swagger.tags = ['Stokbuku']
    #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/StokbukuUpdate"
        }
      }
    }
  }
  */
  const { id: id_buku, id_kategori, stok } = req.body;

  if (!id_buku || !stok || !id_kategori) {
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
  console.log(req.body);
  try {
    const query = `select * from _d_stok_buku where id_buku='${id_buku}' and id_kategori='${id_kategori}'`;
    console.log(query);
    const getdatabuku = await getData(query);
    console.log(`check`, getdatabuku.length);
    let insert;
    if (getdatabuku.length == 0) {
      console.log("A");
      const insertQuery = `insert into _d_stok_buku (id_kategori,id_buku,stok) values ('${id_kategori}','${id_buku}','${stok}')`;
      insert = await runQuery(insertQuery);
    } else {
      console.log("B");
      const updateQuery = `update _d_stok_buku set stok='${stok}' where id_buku='${id_buku}' and id_kategori='${id_kategori}'`;
      insert = await runQuery(updateQuery);
    }
    const results = await getData(query);
    if (insert) {
      const response =
        dev_mode === "development"
          ? {
              message: constantMessage.success,
              data: results,
            }
          : { message: constantMessage.success, data: results };
      setResponse(response, 200, res);
    } else {
      const response =
        dev_mode === "development"
          ? {
              message: constantMessage.error,
            }
          : { message: constantMessage.error };
      setResponse(response, 500, res);
    }
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
router.delete(`${mainurl}`, (req, res) => {
  /*
    #swagger.tags = ['Stokbuku']
    #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/StokbukuDelete"
        }
      }
    }
  }
  */
  setQuery("select", setRequest(req, res), req.body, res).then((resultSelect) => {
    console.log(resultSelect);
    try {
      const response =
        dev_mode === "development"
          ? {
              message: resultSelect.message,
              query: resultSelect.query,
              queryDelete: resultSelect.queryDelete,
              paramSelect: resultSelect.paramSelect,
              paramDelete: resultSelect.paramDelete,
            }
          : { message: resultSelect.message };
      setResponse(response, resultSelect.code, res);
    } catch (error) {
      console.log(error);
    }
  });
});
router.post(`${mainurl}/list`, async (req, res) => {
  /*
    #swagger.tags = ['Stokbuku']
    #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/StokbukuList"
        }
      }
    }
  }
  */
  setQuery("select", setRequest(req, res), req.body, res).then((resultSelect) => {
    // console.log(resultSelect);
    for (const key of resultSelect) {
      let { stok } = key;
      if (!stok) {
        stok = 0;
        key.stok = stok;
      }
    }
    try {
      const defaultResponse = {
        message: resultSelect.message,
        data: resultSelect.data,
        draw: parseInt(req.body.draw),
        recordsTotal: resultSelect.data.total || 0,
        recordsFiltered: resultSelect.data.total || 0,
        start: parseInt(req.body.start),
        length: parseInt(req.body.length),
      };
      const response =
        dev_mode === "development"
          ? {
              ...defaultResponse,
              query: resultSelect.query,
              queryDelete: resultSelect.queryDelete,
              paramSelect: resultSelect.paramSelect,
              paramDelete: resultSelect.paramDelete,
            }
          : {
              ...defaultResponse,
            };
      setResponse(response, resultSelect.code, res);
    } catch (error) {
      console.log(error);
    }
  });
});

router.get(`${mainurl}/:id`, async (req, res) => {
  /*
    #swagger.tags = ['Stokbuku']
  }
  */
  const option = {
    tableName: "_m_Stokbukus",
    responseMode: "datatable",
  };
  setQuery("select", setRequest(req, res, option), req.params, res).then((resultSelect) => {
    try {
      let data = resultSelect.data;
      if (resultSelect.data.length == 1) {
        data = resultSelect.data[0];
      }
      const defaultResponse = {
        message: resultSelect.message,
        data: data,
        recordsTotal: resultSelect.data.total || 0,
        recordsFiltered: resultSelect.data.total || 0,
      };
      const response =
        dev_mode === "development"
          ? {
              ...defaultResponse,
              query: resultSelect.query,
              queryDelete: resultSelect.queryDelete,
              paramSelect: resultSelect.paramSelect,
              paramDelete: resultSelect.paramDelete,
            }
          : {
              ...defaultResponse,
            };

      setResponse(response, resultSelect.code, res);
    } catch (error) {
      console.log(error);
    }
  });
});
module.exports = router;
