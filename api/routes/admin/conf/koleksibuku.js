const { setDefaultNull } = require("../../../helper/index");

module.exports = {
  setRequest: function (req, res, option = null) {
    let tableName = "_m_buku";

    let reqOptions = {};
    const method = req.method;
    const bodyParam = req.body;
    const getParam = req.params;
    const path = req.route.path;

    switch (method) {
      case "GET":
        reqOptions = {
          tableName,
          fields: {
            id: getParam.id,
          },
        };
        break;
      case "POST":
        if (path.includes("list")) {
          reqOptions = {
            tableName: "_v_m_buku",
            responseMode: "datatable",
            extraCondition: true,
            extraConditionQuery: "(is_delete=0  and is_active=1)",
          };
        } else {
          reqOptions = {
            tableName,
            selectOperator: "or",
            selectCompare: "like",
            strictSelect: true,
            nextQuery: "insert",
            fields: {
              judul: bodyParam.judul,
              /*field_area*/
            },
            extraCondition: true,
            extraConditionQuery: "(is_delete=0 and is_active=1)",
          };
        }

        break;

      case "PATCH":
        reqOptions = {
          tableName,
          selectMode: "edit",
          selectOperator: "or",
          selectCompare: "like",
          fieldCompare: "id",
          strictSelect: true,
          nextQuery: "update",
          fields: {
            id: bodyParam.id,
            judul: bodyParam.judul,
            /*field_area*/
          },
        };
        break;

      case "DELETE":
        if (!option) {
          reqOptions = {
            tableName,
            fieldCompare: "id",
            nextQuery: "delete",
            deleteMode: "soft",
            fields: {
              id: bodyParam.id,
            },
          };
        } else {
          reqOptions = option;
        }
        break;
    }
    return reqOptions;
  },
};
