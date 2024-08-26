const { setDefaultNull } = require("../../../helper/index");

module.exports = {
  setRequest: function (req, res, option = null) {
    let tableName = "_m_menu_web";

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
          let extraConditionQuery = "(is_delete=0)";
          reqOptions = {
            tableName: "_v_m_web_menu",
            responseMode: "datatable",
            extraCondition: true,
            extraConditionQuery,
          };
        } else if (path.includes("public")) {
          let extraConditionQuery = "(is_delete=0 and is_active=1)";

          reqOptions = {
            tableName: "_v_m_web_menu",
            responseMode: "datatable",
            extraCondition: true,
            extraConditionQuery,
          };
        } else if (path.includes("section")) {
          let extraConditionQuery = `(is_delete=0 and is_active=1) and id_menu='${bodyParam.id_menu}'`;

          reqOptions = {
            tableName: "_m_web_section",
            responseMode: "datatable",
            extraCondition: true,
            extraConditionQuery,
          };
        } else {
          reqOptions = {
            tableName,
            selectOperator: "or",
            selectCompare: "like",
            strictSelect: true,
            nextQuery: "insert",
            fields: {
              /*field_area*/
              label: bodyParam.label,
            },
            extraCondition: true,
            extraConditionQuery: "(is_delete=0)",
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
            label: bodyParam.label,
            /*field_area*/
          },
          extraCondition: true,
          extraConditionQuery: "(is_delete=0)",
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
