const express = require("express");
const router = express.Router();
const { connection } = require("../../conf/index");
const { dev_mode, setQuery, setResponse, setDefaultNull, makeID, validateMandatoryFields, constantMessage, getData, runQuery, dateTimeFormat } = require("../../helper/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const mainurl = "/web";

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

router.post(`${mainurl}/register`, async (req, res) => {
  /*
    #swagger.tags = ['Public']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/MemberRegister"
          }
        }
      }
    }
  */

  let { nim, fullname, nickname, email, phone, password } = req.body;
  nim = setDefaultNull(nim);
  fullname = setDefaultNull(fullname);
  nickname = setDefaultNull(nickname);
  email = setDefaultNull(email);
  phone = setDefaultNull(phone);
  password = setDefaultNull(password);

  if (!fullname || !nickname || !email || !phone || !password) {
    const response =
      dev_mode === "development"
        ? {
            message: "Seluruh form wajib diisi",
            request: req.body,
          }
        : { message: "Seluruh form wajib diisi" };
    setResponse(response, 400, res);
  }

  let saltRound = 10;
  let hashPassword = await bcrypt.hash(password, saltRound);
  const queryMember = `select * from _d_member where email='${email}' or phone='${phone}'`;
  try {
    const getMember = await getData(queryMember);
    if (getMember.length == 0) {
      const queryInsert = `insert into _d_member (fullname,nickname,email,phone,password) values (?,?,?,?,?)`;
      connection.query(queryInsert, [fullname, nickname, email, phone, hashPassword], async (error, results) => {
        if (!error) {
          let idUser = results.insertId;
          let query = `select * from _v_d_member where email='${email}'`;
          let getdata = await getData(query);
          let dataUser = getdata[0];
          let detailUser = dataUser;
          let data = {
            id: dataUser.id_user,
            username: email,
            fullname: dataUser.fullname,
            email: dataUser.email,
            id_level: "default",
            is_delete: dataUser.is_delete,
            is_active: dataUser.is_active,
            is_superuser: false,
            menu: "default",
            detailUser,
          };
          const token = jwt.sign({ data }, process.env.TOKEN_SECRET, {
            expiresIn: process.env.TOKEN_EXPIRE,
          });
          // set Log
          const is_member = 1;
          getSavedToken(idUser).then(async (data) => {
            if (data != null) {
              if (Date.now() >= data.exp * 1000) {
                await runQuery(`update _log_user set is_expired='1',is_login='0' where id_user='${idUser}' and is_member='${is_member}'`);
                await runQuery(`update _log_user set is_expired='0' where id_user='${idUser}' and token='${token}'  and is_member='${is_member}'`);
              }
            } else {
              await runQuery(`insert into _log_user (id_user,is_login,token,is_member) values('${idUser}','1','${token}','${is_member}')`);
            }
          });
          // ------------------set Log------------------
          const response = dev_mode === "development" ? { data, token } : { data, token };
          setResponse(response, 200, res);
        } else {
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
    } else {
      const response =
        dev_mode === "development"
          ? {
              message: "Maaf, email / phone sudah terdaftar",
              query: queryMember,
            }
          : { message: "Maaf, email / phone sudah terdaftar" };
      setResponse(response, 400, res);
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

router.post(`${mainurl}/resetpassword`, async (req, res) => {
  let { email } = req.body;

  /*
    #swagger.tags = ['Public']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/Resetpassword"
          }
        }
      }
    }
  */
  email = setDefaultNull(email);
  if (!email) {
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

  try {
    const query = `select * from _d_member where email='${email}'`;
    const getDataMember = await getData(query);
    if (getDataMember.length == 0) {
      const response =
        dev_mode === "development"
          ? {
              message: "Email tidak ditemukan",
              request: req.body,
            }
          : { message: "Email tidak ditemukan" };
      setResponse(response, 400, res);
    } else {
      const fullname = getDataMember[0].fullname;
      const response =
        dev_mode === "development"
          ? {
              message: "OK",
              data: {
                email: email,
              },
            }
          : {
              message: "OK",
              data: {
                email: email,
              },
            };
      setResponse(response, 200, res);
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

router.post(`${mainurl}/updatepassword`, async (req, res) => {
  let { id, password1, password2 } = req.body;

  /*
    #swagger.tags = ['Public']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/MemberUpdatePassword"
          }
        }
      }
    }
  */
  password1 = setDefaultNull(password1);
  password2 = setDefaultNull(password2);

  if (!password1 || !password2) {
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

  try {
    if (password1 == password2) {
      const query = `select * from _d_member where id='${id}'`;
      const getDataMember = await getData(query);
      console.log(`getDataMember`, getDataMember);
      if (getDataMember.length > 0) {
        let saltRound = 10;
        let hashPassword = await bcrypt.hash(password1, saltRound);
        const queryUpdate = `update _d_member set password='${hashPassword}' where id='${id}'`;

        const updatePassword = await runQuery(queryUpdate);
        if (updatePassword) {
          const response =
            dev_mode === "development"
              ? {
                  message: constantMessage.success,
                }
              : { message: constantMessage.success };
          setResponse(response, 200, res);
        } else {
          const response =
            dev_mode === "development"
              ? {
                  message: "Invalid parameter",
                  request: req.body,
                }
              : { message: "Invalid parameter" };
          setResponse(response, 400, res);
        }
      } else {
        const response =
          dev_mode === "development"
            ? {
                message: "Invalid Request",
                request: req.body,
              }
            : { message: "Invalid Request" };
        setResponse(response, 400, res);
      }
    } else {
      const response =
        dev_mode === "development"
          ? {
              message: "Invalid Request",
              request: req.body,
            }
          : { message: "Invalid Request" };
      setResponse(response, 400, res);
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
module.exports = router;
