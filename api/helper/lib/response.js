/* -------------------------------------------------------------------------- */
/*     Basic Res- Pelengkap modul project starter - Thejagat, andibastian     */
/* -------------------------------------------------------------------------- */
const dotenv = require("dotenv");
dotenv.config();
const dev_mode = process.env.DEV_MODE;

module.exports = {
  setResponse: function (response_source = {}, http_status = 200, res) {
    const { data = null, error = false } = response_source;
    const finalResponse = response_source || {
      status: false,
      message: "Error, no response source",
    };
    if (data !== null) {
      finalResponse.status = true;
      finalResponse.data = data;
    }
    if (dev_mode == "development") {
      finalResponse.debug = true;
    }
    if (error || http_status !== 200) {
      finalResponse.status = false;
    } else {
      finalResponse.status = true;
    }
    return res.status(http_status).json(finalResponse);
  },
};
