module.exports = {
  setRequest: function (req, res, option = null) {
    let tableName = "_m_users";

    let reqOptions = {};
    const method = req.method;
    const bodyParam = req.body;

    switch (method) {
      case "POST":
        reqOptions = {
          tableName,
          strictSelect: true,
          isAuth: true,
          fields: {
            username: bodyParam.username,
            password: bodyParam.password,
          },
        };
        break;
    }
    return reqOptions;
  },
};
