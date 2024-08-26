/* -------------------------------------------------------------------------- */
/*   Query Module - Pelengkap modul project starter - Thejagat, andibastian   */
/* -------------------------------------------------------------------------- */

const { connection } = require("../../conf/index");
const { constantMessage, excludeKeys } = require("../lib/constant");
const { setResponse } = require("../lib/response");
const bcrypt = require("bcrypt");

var queryHelper = (module.exports = {
  insertActivity: function (label, endpoint, id_user, id_level, detail, connection) {
    connection.query(`insert into _cc_log_activity (id_user,id_level,label,endpoint,detail) values 
        ('${id_user}','${id_level}','${label}','${endpoint}','${detail}')`);
  },
  insertLogHistory: function (param) {
    const tableName = param.tableName;
    const activity_data = JSON.stringify(param.activity);
    let query = `insert into ${tableName} (id_user,id_connection,token,activity_name,menu,menu_title,activity_data)     
        values ('${param.iduser}','${param.id_connection}','${param.token}','${param.activity_name}','${param.menu}','${param.title}','${activity_data}')`;
    return new Promise((resolve, reject) => {
      connection.query(query, [], (error, results) => {
        if (!error) {
          let output = results;
          resolve(output);
        } else {
          console.log(error);
          resolve(error);
        }
      });
    });
  },
  /**
   *
   * @param {string} query
   * @returns {Promise}
   */
  getData: function (query) {
    return new Promise((resolve, reject) => {
      connection.query(query, [], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
  /**
   *
   * @param {string} query
   * @param {array} array_param
   * @returns {Promise}
   */
  runQuery: function (query, array_param = []) {
    return new Promise((resolve, reject) => {
      connection.query(query, array_param, (error, results) => {
        if (!error) {
          resolve(results);
        } else {
          console.log(error);
          reject(error);
        }
      });
    });
  },
  generateQuery: function (queryType, param = null) {
    const tableName = param.tableName;
    if (!queryType) {
      throw new Error('Invalid query type. Supported types are "insert", "update", "delete" and "select".');
    }
    let query;
    let countQuery;
    let extraCondition = param.extraCondition;
    let conditions = null;
    let selectMode = param.selectMode;
    let fieldCompare = param.fieldCompare;
    const selectCompare = param.selectCompare || "=";
    const selectOperator = param.selectOperator || "AND";
    const fields = param.fields;
    switch (queryType) {
      case "select":
        if (param === null || typeof param !== "object" || Object.keys(param).length === 0) {
          query = `select * from ${tableName}`;
        } else {
          if (!param.responseMode) {
            if (param.hasOwnProperty("fields")) {
              conditions = Object.keys(fields)
                .filter((key) => !excludeKeys.includes(key))
                .map((key) => `${key} ${selectCompare} ?`)
                .join(` ${selectOperator} `);
              if (selectCompare == "like") {
                conditions = `(${conditions})`;
              }
              if (selectMode == "edit") {
                conditions = Object.keys(fields)
                  .filter((key) => !excludeKeys.includes(key) && key !== param.fieldCompare)
                  .map((key) => `${key} like ?`)
                  .join(` OR `);
                conditions = `(${conditions})`;
              }
            }
          }
          /* -------------------------------------------------------------------------- */
          /*                                Default Mode                                */
          /* -------------------------------------------------------------------------- */
          query = `select * from ${tableName}`;
          if (conditions) {
            if (selectMode == "edit") {
              conditions += ` and ${fieldCompare} != ? `;
            }
            query += ` where ${conditions}`;
            if (extraCondition) {
              query += ` and ${param.extraConditionQuery} `;
            }
          } else {
            if (param.extraCondition) {
              query += ` where ${param.extraConditionQuery} `;
            }
          }
          /* -------------------------------------------------------------------------- */
          /*                               DataTables Mode                              */
          /* -------------------------------------------------------------------------- */

          if (param.responseMode === "datatable") {
            let request = param.bodyReq;
            query = `select  *, (SELECT COUNT(*) FROM ${tableName} WHERE is_delete = 0) AS totalRow from ${tableName}`;

            let limit = request.length || 10;

            //Temporary solution
            if (!request.length) {
              limit = 100;
            }
            console.log(request);

            const page = request.start / limit + 1;
            let offset = (page - 1) * limit;
            if (isNaN(offset)) {
              offset = 0;
            }

            let search = request.search; //default for select2
            let columns, orderBy, orderDir;
            if (search.hasOwnProperty("value")) {
              search = search.value; //datatables
              columns = parseInt(request.order[0].column);
              orderBy = request.columns[columns].data;
              orderDir = request.order[0].dir || "asc";
            } else {
              orderBy = "id";
              orderDir = "asc";
            }

            if (search) {
              const searchConditions = param.cols.map((key) => `\`${key}\` LIKE '%${search}%'`).join(` OR `);
              if (conditions) {
                query += ` where (${conditions}) AND (${searchConditions}) `;
              } else {
                query += ` where ${searchConditions} `;
              }
              if (extraCondition) {
                query += ` and ${param.extraConditionQuery} `;
              }
            } else {
              if (conditions) {
                query += ` where ${conditions}`;
                if (extraCondition) {
                  query += ` and ${param.extraConditionQuery} `;
                }
              } else {
                query += ` where 1=1 `;
                if (extraCondition) {
                  query += ` and ${param.extraConditionQuery} `;
                }
              }
            }

            query += ` order by \`${orderBy}\` ${orderDir} limit ${limit} offset ${offset}`;
          }
        }
        break;
      case "insert":
        let cols = param.cols;
        if (typeof cols === "undefined") {
          cols = param;
        }
        const filteredData = cols.reduce((obj, key) => {
          obj[key] = param[key];
          return obj;
        }, {});
        const columns = Object.keys(filteredData)
          .map((column) => `\`${column}\``)
          .join(",");
        const values = Array(Object.keys(filteredData).length).fill("?").join(",");
        query = `insert into ${tableName} (${columns})  values (${values})`;
        break;
      case "update":
        if (!param || typeof param !== "object" || !param.cols || Object.keys(param.cols).length === 0) {
          return `For "update" query type, param object must contain non-empty conditions. ${JSON.stringify(param)}`;
        }
        const assignments = Object.values(param.cols)
          .filter((key) => key !== param.fieldCompare)
          .map((key) => `\`${key}\` = ?`)
          .join(",");
        query = `update ${tableName}  set ${assignments} where ${param.fieldCompare} = ? `;
        break;
      case "delete":
        let deleteMode = param.deleteMode || "hard";
        if (param.cols.length === 1) {
          conditions = `${param.cols[0]} ${selectCompare} ?`;
        } else {
          conditions = param.cols.map((key) => `${key} ${selectCompare} ?`).join(` ${selectOperator} `);
        }
        if (deleteMode == "soft") {
          query = `update ${tableName} set is_delete='1' where ${conditions}`;
        } else {
          query = `delete from ${tableName} where ${conditions}`;
        }
        break;
    }
    return query.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
  },
  getColumnList: function (tableName, param, bodyReq = null) {
    const query = `DESCRIBE ${tableName}`;
    return new Promise((resolve, reject) => {
      connection.query(query, [], (error, results) => {
        if (!error) {
          let fieldNames = results.map((result) => result.Field);
          if (bodyReq) {
            if (param && param.fieldCompare) {
              fieldNames = fieldNames.filter((fieldName) => {
                return bodyReq.hasOwnProperty(fieldName);
              });
            } else {
              fieldNames = fieldNames.filter((fieldName) => {
                return bodyReq.hasOwnProperty(fieldName);
              });
            }
          }
          console.log(fieldNames);
          resolve(fieldNames);
        } else {
          reject(error);
        }
      });
    });
  },
  generateBodyForm: function (cols, bodyReq) {
    const updatedBody = {
      matched: {},
      mismatched: {},
    };
    for (var col in bodyReq) {
      if (cols.includes(col)) {
        updatedBody.matched[col] = bodyReq[col];
      } else {
        updatedBody.mismatched[col] = bodyReq[col];
      }
    }
    return updatedBody;
  },
  objectValuesToArray: function (param, allownull = false, valuesMoveToEnd = [], inquery = 0) {
    let fields = param.fields;
    let result = Object.keys(fields).map((key) => {
      let value = fields[key];
      if (allownull && value === "") {
        return null;
      }
      if (param.selectCompare === "like" && !inquery) {
        if (key !== param.fieldCompare) {
          value = `%${value}%`;
        }
      }
      return value;
    });
    valuesMoveToEnd.forEach((value) => {
      if (result.includes(value)) {
        result = result.filter((item) => item !== value);
        result.push(value);
      }
    });
    return result;
  },
  objectKeysToArray: function (obj) {
    return Object.keys(obj).filter((key) => !excludeKeys.includes(key));
  },
  /* -------------------------------------------------------------------------- */
  /*                                Execute Query                               */
  /* -------------------------------------------------------------------------- */
  executeNextQuery: async function (param, bodyreq, res) {
    try {
      let result;
      let message;
      switch (param.nextQuery) {
        case "insert":
          result = await queryHelper.setQuery("insert", param, bodyreq, res);
          message = constantMessage.successInsert;
          break;
        case "update":
          result = await queryHelper.setQuery("update", param, bodyreq, res);
          message = constantMessage.successEdit;
          break;
        case "delete":
          result = await queryHelper.setQuery("delete", param, bodyreq, res);
          message = constantMessage.successEdit;
          break;
        default:
          message = constantMessage.error + " : Invalid nextQuery";
      }
      if (result.affectedRows > 0) {
        console.log(result);
        return {
          status: true,
          message,
          query: result.query,
          paramData: result.paramInsert || result.paramUpdate || result.paramDelete,
        };
      } else {
        return {
          status: false,
          message: "Invalid Command : " + result.query,
          code: 500,
        };
      }
    } catch (error) {
      return {
        status: false,
        message: error.toString(),
        code: 500,
      };
    }
  },
  setDefaultError: function (param, bodyReq, res) {
    switch (param.nextQuery) {
      case "insert":
        if (!bodyReq) {
          const response = { message: "Invalid body request" };
          setResponse(response, 400, res);
        }
        break;
      case "update":
      case "delete":
        let fieldCompare = param.fieldCompare;
        if (bodyReq[fieldCompare] == 0 || bodyReq[fieldCompare] == null) {
          const response = {
            message: `${constantMessage.errorInvalid}, ${fieldCompare}=${bodyReq[fieldCompare]}`,
          };
          setResponse(response, 400, res);
        }
        break;
    }
  },
  /* -------------------------------------------------------------------------- */
  /*                              Exported Function                             */
  /* -------------------------------------------------------------------------- */
  setQuery: async function (queryType, param = null, bodyreq = null, res) {
    queryHelper.setDefaultError(param, bodyreq, res);
    let query = "",
      runQuery = "",
      countQuery = "";
    const tableName = param.tableName;
    let strictSelect = param.strictSelect || false;
    console.log(`Param : ${JSON.stringify(param)}`);
    console.log(`strictSelect : ${strictSelect}`);
    let getColumns, bodyParam, paramInsert, paramUpdate, paramSelect, fieldCompare;
    switch (queryType) {
      case "select":
        if (param.responseMode == "datatable") {
          paramSelect = [];
          param.bodyReq = bodyreq;
          getColumns = await queryHelper.getColumnList(tableName, param);
          param.cols = getColumns;
        } else {
          if (param.hasOwnProperty("fields")) {
            paramSelect = queryHelper.objectValuesToArray(param);
          } else {
            console.log("empty fields param");
          }
        }
        fieldCompare = param.fieldCompare;
        if (param.selectMode == "edit") {
          paramSelect = queryHelper.objectValuesToArray(param, false, [bodyreq[fieldCompare]]);
        }
        query = queryHelper.generateQuery("select", param);

        runQuery = await queryHelper
          .runQuery(query, paramSelect)
          .then(async (results) => {
            results.status = true;
            if (strictSelect) {
              if (results.length > 0) {
                const fields = param.fields;
                const matchedFields = [];
                for (const row of results) {
                  for (const field in row) {
                    if (row[field] === fields[field]) {
                      matchedFields.push(field);
                    }
                  }
                }
                results.matched = matchedFields;
                const joinedmatched = matchedFields.join(", ");
                const message = constantMessage.errorDuplicate + " : ";
                if (matchedFields.length > 1) {
                  results.message = message + " " + joinedmatched;
                } else {
                  results.message = joinedmatched + " exist";
                }
                results.status = false;
              }
            } else {
              if (param.nextQuery == "delete") {
                if (results.length == 0) {
                  results.message = constantMessage.errorNotFound;
                  results.status = false;
                } else {
                  results.status = true;
                }
              }
            }

            console.log(`----------------------------------------`);
            console.log(`results : ${results.length}`);
            console.log(`strictSelect : ${strictSelect}`);
            console.log(`paramSelect : ${results.paramSelect}`);
            console.log(`Status : ${results.status}`);
            console.log(`nextQuery : ${param.nextQuery}`);
            console.log(`----------------------------------------`);

            if (param.nextQuery && results.status) {
              await queryHelper.executeNextQuery(param, bodyreq, res).then((nextQueryresult) => {
                results.message = nextQueryresult.message;
                results.status = nextQueryresult.status;
                switch (param.nextQuery) {
                  case "insert":
                    results.queryInsert = nextQueryresult.query;
                    results.paramInsert = nextQueryresult.paramData;
                    break;
                  case "update":
                    results.queryUpdate = nextQueryresult.query;
                    results.paramUpdate = nextQueryresult.paramData;
                    break;
                  case "delete":
                    results.queryDelete = nextQueryresult.query;
                    results.paramDelete = nextQueryresult.paramData;
                    break;
                }
              });
            } else {
              console.log("No NextQuery");
            }

            if (param.responseMode == "datatable") {
              let n = 0;
              let totalRow = "";
              let newResult = results.map((item) => {
                n++;
                if (typeof item.totalRow !== "undefined") {
                  totalRow = item.totalRow;
                  delete item.totalRow;
                }
                return item;
              });
              newResult.total = totalRow;
              results.data = newResult;
            } else {
              results.data = results;
            }

            results.paramSelect = paramSelect;
            results.query = query;

            if (results.status) {
              results.code = 200;
            } else {
              results.code = 400;
            }
            return results;
          })
          .catch((error) => {
            let output = {
              query: query,
              message: `${error}`,
              status: false,
              code: 500,
            };
            return output;
          });
        return runQuery;
        break;
      case "insert":
        getColumns = await queryHelper.getColumnList(tableName, param, bodyreq);
        param.cols = getColumns;
        bodyParam = queryHelper.generateBodyForm(getColumns, bodyreq);
        param.fields = bodyParam.matched;
        paramInsert = queryHelper.objectValuesToArray(param, true, [], 1);
        query = queryHelper.generateQuery("insert", param);
        return (runQuery = await queryHelper
          .runQuery(query, paramInsert)
          .then((results) => {
            results.paramInsert = paramInsert;
            results.query = query;
            return results;
          })
          .catch((error) => {
            return error;
          }));
        break;
      case "update":
        getColumns = await queryHelper.getColumnList(tableName, param, bodyreq);
        param.cols = getColumns;
        bodyParam = queryHelper.generateBodyForm(getColumns, bodyreq);
        param.fields = bodyParam.matched;
        fieldCompare = param.fieldCompare;
        paramUpdate = queryHelper.objectValuesToArray(param, true, [bodyreq[fieldCompare]], 1);
        query = queryHelper.generateQuery("update", param);
        console.log(query);
        console.log(paramUpdate);
        return (runQuery = await queryHelper
          .runQuery(query, paramUpdate)
          .then((results) => {
            results.paramUpdate = paramUpdate;
            results.query = query;
            return results;
          })
          .catch((error) => {
            return error;
          }));
        break;
      case "delete":
        getColumns = await queryHelper.getColumnList(tableName, param, bodyreq);
        param.cols = getColumns;
        bodyParam = queryHelper.generateBodyForm(getColumns, bodyreq);
        param.fields = bodyParam.matched;
        fieldCompare = param.fieldCompare;
        paramDelete = queryHelper.objectValuesToArray(param, false, [], 1);
        query = queryHelper.generateQuery("delete", param);
        console.log(query);
        console.log(paramDelete);
        return (runQuery = await queryHelper
          .runQuery(query, paramDelete)
          .then((results) => {
            results.paramDelete = paramDelete;
            results.query = query;
            return results;
          })
          .catch((error) => {
            return error;
          }));
        break;
    }
  },
  insertActivity: function (label, endpoint, id_user, id_level, detail, connection) {
    connection.query(`insert into _cc_log_activity (id_user,id_level,label,endpoint,detail) values 
    ('${id_user}','${id_level}','${label}','${endpoint}','${detail}')`);
  },
  insertLogHistory: function (param) {
    /*
    {
      "iduser": 1,
      "activity_name": "reload",
      "menu": "bnncabang",
      "title": "Bnncabang",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Imlk",
      "id_connection": "7YGOimQbp9Q1J8zGAAAP"
    }    
    */
    let activity_data = JSON.stringify(param);
    let query = `insert into _cc_log_user_history (id_user,id_connection,token,activity_name,menu,menu_title,activity_data)     
    values ('${param.iduser}','${param.id_connection}','${param.token}','${param.activity_name}','${param.menu}','${param.title}','${activity_data}')`;
    return new Promise((resolve, reject) => {
      connection.query(query, [], (error, results) => {
        if (!error) {
          let output = results;
          resolve(output);
        } else {
          console.log(error);
          resolve(error);
        }
      });
    });
  },
});
