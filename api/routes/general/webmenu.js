const express = require("express");
const router = express.Router();
const { connection } = require("../../conf/index");
const { dev_mode, setQuery, setResponse, getData, constantMessage, runQuery } = require("../../helper/index");
const { setRequest } = require("./conf/webmenu");

const mainurl = "/webmenu";

router.post(`${mainurl}`, async (req, res) => {
  /*
  #swagger.tags = ['Admin - Web Menu']
  #swagger.requestBody = {
      required: true,
      content: {
          "application/json": {
              schema: {
                  $ref: "#/components/schemas/WebmenuAdd"
              }  
          }
      }
    }
  */

  console.log(req.body);
  const { label, icon, link, typecontent, section_label, section_title, deskripsi } = req.body;
  let { is_active } = req.body;
  if (!is_active) {
    req.body.is_active = 0;
  }

  try {
    const queryMenu = `select * from _m_menu_web where label like '%${label}%' and is_delete='0'`;
    const getMenu = await getData(queryMenu);
    if (getMenu.length == 0) {
      const queryInsert = `insert into _m_menu_web (label,icon,link,typecontent,is_active) values (?,?,?,?,?)`;

      connection.query(queryInsert, [label, icon, link, typecontent, is_active], async (error, result) => {
        const idMenu = result.insertId;

        let querySection = ``;
        for (let i = 0; i < section_label.length; i++) {
          let sectionLabel = section_label[i];
          sectionLabel = sectionLabel.replaceAll(" ", "_");
          sectionLabel = sectionLabel.toLowerCase();
          const sectionTitle = section_title[i];
          const sectionDeskripsi = deskripsi[i];
          console.log(sectionLabel, sectionTitle, sectionDeskripsi);
          querySection += `insert into _m_web_section (id_menu,label,title,deskripsi) values ('${idMenu}','${sectionLabel}','${sectionTitle}','${sectionDeskripsi}');`;
        }
        await runQuery(querySection);

        const response =
          dev_mode === "development"
            ? {
                message: constantMessage.success,
              }
            : { message: constantMessage.success };
        setResponse(response, 200, res);
      });
    } else {
      const response =
        dev_mode === "development"
          ? {
              message: constantMessage.errorDuplicate,
              query: queryMenu,
            }
          : { message: constantMessage.errorDuplicate };
      setResponse(response, 500, res);
    }
  } catch (error) {
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
router.patch(`${mainurl}`, async (req, res) => {
  /*
    #swagger.tags = ['Admin - Web Menu']
    #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/WebmenuUpdate"
        }
      }
    }
  }
  */
  const { id, label, icon, link, typecontent, section_title, deskripsi } = req.body;

  let { is_active, section_id, section_label } = req.body;
  if (!is_active) {
    req.body.is_active = 0;
    is_active = 0;
  }
  if (!section_id) {
    section_id = null;
  }
  const isEmptyArray = section_label.every((element) => element === "");

  if (isEmptyArray) {
    section_label = [];
  }
  req.body.section_label = section_label;

  try {
    const queryMenu = `select * from _m_menu_web where label like '%${label}%' and is_delete='0' and id!='${id}'`;
    const getMenu = await getData(queryMenu);
    if (getMenu.length == 0) {
      const queryInsert = `update _m_menu_web set label=?,icon=?,link=?,typecontent=?,is_active=? where id=?`;

      connection.query(queryInsert, [label, icon, link, typecontent, is_active, id], async (error, result) => {
        const idMenu = id;

        let querySection = ``;
        for (let i = 0; i < section_label.length; i++) {
          let sectionId;
          if (section_id) {
            sectionId = section_id[i];
          }
          let sectionLabel = section_label[i];
          sectionLabel = sectionLabel.replaceAll(" ", "_");
          sectionLabel = sectionLabel.toLowerCase();
          const sectionTitle = section_title[i];
          const sectionDeskripsi = deskripsi[i];
          console.log(sectionLabel, sectionTitle, sectionDeskripsi);
          if (sectionId) {
            querySection += `update _m_web_section set label='${sectionLabel}',title='${sectionTitle}',deskripsi='${sectionDeskripsi}' where id='${sectionId}' and id_menu='${idMenu}';`;
          } else {
            querySection += `insert into _m_web_section (id_menu,label,title,deskripsi) values ('${idMenu}','${sectionLabel}','${sectionTitle}','${sectionDeskripsi}');`;
          }
        }
        if (querySection) {
          await runQuery(querySection);
        }

        const response =
          dev_mode === "development"
            ? {
                message: constantMessage.success,
              }
            : { message: constantMessage.success };
        setResponse(response, 200, res);
      });
    } else {
      const response =
        dev_mode === "development"
          ? {
              message: constantMessage.errorDuplicate,
              query: queryMenu,
            }
          : { message: constantMessage.errorDuplicate };
      setResponse(response, 500, res);
    }
  } catch (error) {
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
router.delete(`${mainurl}`, (req, res) => {
  /*
    #swagger.tags = ['Admin - Web Menu']
    #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/WebmenuDelete"
        }
      }
    }
  }
  */
  setQuery("select", setRequest(req, res), req.body, res).then(async (resultSelect) => {
    console.log(resultSelect);
    try {
      const deleteSection = `delete from _m_web_section where id_menu='${req.body.id}'`;
      await runQuery(deleteSection);
      const response =
        dev_mode === "development"
          ? {
              message: resultSelect.message,
              query: resultSelect.query,
              queryDelete: resultSelect.queryDelete,
              paramSelect: resultSelect.paramSelect,
              paramDelete: resultSelect.paramDelete,
            }
          : { message: resultSelect.message };
      setResponse(response, resultSelect.code, res);
    } catch (error) {
      console.log(error);
    }
  });
});
router.post(`${mainurl}/list`, async (req, res) => {
  /*
    #swagger.tags = ['Admin - Web Menu']
    #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/WebmenuList"
        }
      }
    }
  }
  */
  setQuery("select", setRequest(req, res), req.body, res).then(async (resultSelect) => {
    try {
      for (const key of resultSelect) {
        key.section_list = null;
        if (key.total_section > 0) {
          const getSection = await getData(`select * from _m_web_section where id_menu='${key.id}'`);
          console.log(getSection);
          key.section_list = getSection;
        }
      }

      const defaultResponse = {
        message: resultSelect.message,
        data: resultSelect.data,
        draw: parseInt(req.body.draw),
        recordsTotal: resultSelect.data.total || 0,
        recordsFiltered: resultSelect.data.total || 0,
        start: parseInt(req.body.start),
        length: parseInt(req.body.length),
      };
      const response =
        dev_mode === "development"
          ? {
              ...defaultResponse,
              query: resultSelect.query,
              queryDelete: resultSelect.queryDelete,
              paramSelect: resultSelect.paramSelect,
              paramDelete: resultSelect.paramDelete,
            }
          : {
              ...defaultResponse,
            };
      setResponse(response, resultSelect.code, res);
    } catch (error) {
      console.log(error);
    }
  });
});

router.post(`${mainurl}/section`, async (req, res) => {
  /*
    #swagger.tags = ['Admin - Web Menu']
    #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/WebmenuListSection"
        }
      }
    }
  }
  */
  setQuery("select", setRequest(req, res), req.body, res).then(async (resultSelect) => {
    try {
      for (const key of resultSelect) {
        key.section_list = null;
        if (key.total_section > 0) {
          const getSection = await getData(`select * from _m_web_section where id_menu='${key.id}'`);
          console.log(getSection);
          key.section_list = getSection;
        }
      }

      const defaultResponse = {
        message: resultSelect.message,
        data: resultSelect.data,
        draw: parseInt(req.body.draw),
        recordsTotal: resultSelect.data.total || 0,
        recordsFiltered: resultSelect.data.total || 0,
        start: parseInt(req.body.start),
        length: parseInt(req.body.length),
      };
      const response =
        dev_mode === "development"
          ? {
              ...defaultResponse,
              query: resultSelect.query,
              queryDelete: resultSelect.queryDelete,
              paramSelect: resultSelect.paramSelect,
              paramDelete: resultSelect.paramDelete,
            }
          : {
              ...defaultResponse,
            };
      setResponse(response, resultSelect.code, res);
    } catch (error) {
      console.log(error);
    }
  });
});

router.post(`${mainurl}/public`, async (req, res) => {
  /*
    #swagger.tags = ['Public']
    #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/WebmenuList"
        }
      }
    }
  }
  */
  setQuery("select", setRequest(req, res), req.body, res).then((resultSelect) => {
    console.log(resultSelect);
    try {
      const defaultResponse = {
        message: resultSelect.message,
        data: resultSelect.data,
        draw: parseInt(req.body.draw),
        recordsTotal: resultSelect.data.total || 0,
        recordsFiltered: resultSelect.data.total || 0,
        start: parseInt(req.body.start),
        length: parseInt(req.body.length),
      };
      const response =
        dev_mode === "development"
          ? {
              ...defaultResponse,
              query: resultSelect.query,
              queryDelete: resultSelect.queryDelete,
              paramSelect: resultSelect.paramSelect,
              paramDelete: resultSelect.paramDelete,
            }
          : {
              ...defaultResponse,
            };
      setResponse(response, resultSelect.code, res);
    } catch (error) {
      console.log(error);
    }
  });
});

router.get(`${mainurl}/:id`, async (req, res) => {
  /*
    #swagger.tags = ['Admin - Web Menu']
  }
  */
  const option = {
    tableName: "_m_Webmenus",
    responseMode: "datatable",
  };
  setQuery("select", setRequest(req, res, option), req.params, res).then((resultSelect) => {
    try {
      let data = resultSelect.data;
      if (resultSelect.data.length == 1) {
        data = resultSelect.data[0];
      }
      const defaultResponse = {
        message: resultSelect.message,
        data: data,
        recordsTotal: resultSelect.data.total || 0,
        recordsFiltered: resultSelect.data.total || 0,
      };
      const response =
        dev_mode === "development"
          ? {
              ...defaultResponse,
              query: resultSelect.query,
              queryDelete: resultSelect.queryDelete,
              paramSelect: resultSelect.paramSelect,
              paramDelete: resultSelect.paramDelete,
            }
          : {
              ...defaultResponse,
            };

      setResponse(response, resultSelect.code, res);
    } catch (error) {
      console.log(error);
    }
  });
});
module.exports = router;
