module.exports = {
  setRequest: function (req, res, option = null) {
    let tableName = "_m_users";

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
            tableName: "_v_users",
            responseMode: "datatable",
            extraCondition: true,
            extraConditionQuery: "(is_delete=0)",
          };
        } else {
          reqOptions = {
            tableName,
            selectOperator: "or",
            selectCompare: "like",
            strictSelect: true,
            nextQuery: "insert",
            fields: {
              username: bodyParam.username,
            },
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
            username: bodyParam.username,
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
