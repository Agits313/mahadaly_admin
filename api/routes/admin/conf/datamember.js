const { setDefaultNull } = require("../../../helper/index");

module.exports = {
  setRequest: function (req, res, option = null) {
    let tableName = "_d_member";

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
            tableName: "_v_d_member",
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
              email: bodyParam.email,
              phone: bodyParam.phon,
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
            email: bodyParam.email,
            phone: bodyParam.phon,
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
