const express = require("express");
const router = express.Router();
const { dev_mode, setQuery, setResponse, getData } = require("../../helper/index");
const { setRequest } = require("./conf/transaksi");

const mainurl = "/transaksi";

router.post(`${mainurl}`, async (req, res) => {
  /*
  #swagger.tags = ['Transaksi']
  #swagger.requestBody = {
      required: true,
      content: {
          "application/json": {
              schema: {
                  $ref: "#/components/schemas/TransaksiAdd"
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
router.patch(`${mainurl}`, (req, res) => {
  /*
    #swagger.tags = ['Transaksi']
    #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/TransaksiUpdate"
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
              queryUpdate: resultSelect.queryUpdate,
              paramSelect: resultSelect.paramSelect,
              paramUpdate: resultSelect.paramUpdate,
            }
          : { message: resultSelect.message };
      setResponse(response, resultSelect.code, res);
    } catch (error) {
      console.log(error);
    }
  });
});
router.delete(`${mainurl}`, (req, res) => {
  /*
    #swagger.tags = ['Transaksi']
    #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/TransaksiDelete"
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
    #swagger.tags = ['Transaksi']
    #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/TransaksiList"
        }
      }
    }
  }
  */
  const getsetting = await getData(`select * from _m_pengaturan`);
  let settingvalue = null;
  if (getsetting.length > 0) {
    settingvalue = getsetting[0];
  }
  setQuery("select", setRequest(req, res), req.body, res).then((resultSelect) => {
    console.log(resultSelect);

    try {
      for (const key of resultSelect) {
        key.setting = settingvalue;
      }
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
    #swagger.tags = ['Transaksi']
  }
  */
  const option = {
    tableName: "_m_Transaksis",
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
