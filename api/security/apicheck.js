/* -------------------------------------------------------------------------- */
/*           Security API - Project starter - Thejagat, andibastian           */
/* -------------------------------------------------------------------------- */

const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  apiKeyCheck:(req, res, next) {
    const apiKey = req.headers["apikey"];
    const env_apiKey = process.env.API_KEY;
    if (!apiKey || apiKey !== env_apiKey) {
      return res.status(401).json({
        status: false,
        message: "Akses tidak diizinkan, pastikan anda menggunakan API Key valid",
      });
    }
    next();
  },
  apiKeyTokenCheck:(req, res, next){
    const apiKey = req.headers["apikey"];
    const tokenKey = req.headers["tokenKey"];
    const env_apiKey = process.env.API_KEY;

    if (!apiKey || apiKey !== env_apiKey) {
      return res.status(401).json({
        status: false,
        message: "Akses tidak diizinkan, pastikan anda menggunakan API Key valid",
      });
    }
    next();
  },
  validateToken:(req,res,next){
    
  }
};
