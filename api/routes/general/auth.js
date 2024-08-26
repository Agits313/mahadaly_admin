const express = require("express");
const router = express.Router();
const { dev_mode, setQuery, setResponse, getData, runQuery } = require("../../helper/index");
const { setRequest } = require("./conf/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const mainurl = "/auth";

const getSavedToken = (iduser) => {
  return new Promise((resolve, reject) => {
    getData(`select token from _log_user where id_user='${iduser}' and is_expired=0`).then((results) => {
      if (results.length) {
        let dataUser = results[0];
        let decoded = jwt.decode(dataUser.token);
        let output = {
          exp: decoded.exp,
          token: dataUser.token,
        };
        resolve(output);
      } else {
        resolve(null);
      }
    });
  });
};

router.post(`${mainurl}/login`, async (req, res) => {
  /*
  #swagger.tags = ['General']
  #swagger.requestBody = {
      required: true,
      content: {
          "application/json": {
              schema: {
                  $ref: "#/components/schemas/Login"
              }  
          }
      }
    }
  */
  const { username, password, is_member } = req.body;
  let query = `SELECT * FROM _m_users WHERE username = '${username}' and is_active = 1`;
  if (is_member && is_member == 1) {
    query = `select * from _d_member where email='${username}' and is_active='1'`;
  }
  let getdata = await getData(query);

  if (getdata.length > 0) {
    let dataUser = getdata[0];
    let hashPassword = dataUser.password;
    const isMatch = await bcrypt.compare(password, hashPassword);
    if (isMatch) {
      let data = {
        id: dataUser.id,
        username: username,
        fullname: dataUser.fullname,
        email: dataUser.email,
        id_level: dataUser.id_level,
        is_delete: dataUser.is_delete,
        is_active: dataUser.is_active,
      };

      const token = jwt.sign({ data }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRE,
      });

      let queryMember = ``,
        queryMemberExpired = ``;
      let queryInsertToken = `insert into _log_user (id_user,is_login,token) values('${dataUser.id}','1','${token}')`;
      if (is_member) {
        data.id_level = "default";
        queryMemberUpdate = `,is_member='1'`;
        queryMemberExpired = `and is_member='1'`;
        queryInsertToken = `insert into _log_user (id_user,is_login,token,is_member) values('${dataUser.id}','1','${token}','1')`;
      }

      // set Log
      getSavedToken(dataUser.id).then(async (data) => {
        // console.log(data);
        if (data != null) {
          if (Date.now() >= data.exp * 1000) {
            await runQuery(`update _log_user set is_expired='1',is_login='0' ${queryMember} where id_user='${dataUser.id}'`);
            await runQuery(`update _log_user set is_expired='0' where id_user='${dataUser.id}' and token='${token}' ${queryMemberExpired}`);
          }
        } else {
          await runQuery(queryInsertToken);
        }
      });
      // ------------------set Log------------------
      const response = dev_mode === "development" ? { data, token } : { token };
      setResponse(response, 200, res);
    }
  } else {
    const response = { message: "Invalid Username / Password" };
    setResponse(response, 401, res);
  }
});

router.post(`${mainurl}/logout`, async (req, res) => {
  /*
  #swagger.tags = ['General']
  #swagger.requestBody = {
      required: true,
      content: {
          "application/json": {
              schema: {
                  $ref: "#/components/schemas/Logout"
              }  
          }
      }
    }
  */
  const { id } = req.body;
  const query = `select * from _m_users where id='${id}'`;
  let getdata = await getData(query).then(async (result) => {
    return result;
  });

  if (getdata.length > 0) {
    let dataUser = getdata[0];
    await runQuery(`update _log_user set is_expired='1' where id_user='${id}'`);
    const response = { message: "Logout Success" };
    setResponse(response, 200, res);
  } else {
    const response = { message: "Invalid ID User" };
    setResponse(response, 401, res);
  }
});

module.exports = router;
