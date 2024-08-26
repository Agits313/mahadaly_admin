const express = require("express");
const router = express.Router();
const { dev_mode, setQuery, setResponse, getData, constantMessage, runQuery, setDefaultNull, isDirExists, createDir } = require("../../helper/index");
const { setRequest } = require("./conf/koleksibuku");
const fs = require("fs");
const path = require("path");
const mainurl = "/koleksibuku";

const uploadDir = "./" + process.env.UPLOAD_DIR + "/temp";
const targetDir = "./" + process.env.UPLOAD_DIR + "/koleksibuku";
if (!isDirExists(targetDir)) {
  createDir(targetDir);
}

const moveFiles = async (sourceDir, destinationDir, id_fileName) => {
  try {
    let coverFile = null;
    const files = await fs.promises.readdir(sourceDir);
    for (const file of files) {
      const sourceFile = path.join(sourceDir, file);
      const destinationFile = path.join(destinationDir, file);
      const sourceFileName = sourceFile.replace(`public/uploads/temp/`, ``);
      if (sourceFileName.startsWith("cover") && sourceFileName.includes(id_fileName)) {
        coverFile = file;
      }
      await fs.promises.rename(sourceFile, destinationFile);
      console.log(`File ${sourceFile} moved to ${destinationFile}`);
    }
    return { coverFile };
  } catch (err) {
    console.error("Error:", err);
    return { coverFile: null, materiFiles: null };
  }
};

router.post(`${mainurl}`, async (req, res) => {
  /*
  #swagger.tags = ['Koleksibuku']
  #swagger.requestBody = {
      required: true,
      content: {
          "application/json": {
              schema: {
                  $ref: "#/components/schemas/KoleksibukuAdd"
              }  
          }
      }
    }
  */
  const sourceDir = uploadDir;
  const destinationDir = targetDir;
  const { id_file: id_fileName } = req.body;
  let getFile = await moveFiles(sourceDir, targetDir, id_fileName);
  req.body.cover = getFile.coverFile;
  const { judul, penulis, tahun_terbit, id_kategori, sinopsis, cover } = req.body;
  try {
    const newBody = {
      id_kategori,
      judul,
      penulis,
      tahun_terbit,
      sinopsis,
      cover,
    };
    req.body = newBody;

    const querySelect = `select judul,tahun_terbit from _m_buku where judul like '%${judul}%' and tahun_terbit='${tahun_terbit}'`;
    const getBuku = await getData(querySelect);
    if (getBuku.length == 0) {
      const queryInsert = `insert into _m_buku (id_kategori,judul,penulis,tahun_terbit,sinopsis,cover) values ('${id_kategori}','${judul}','${penulis}','${tahun_terbit}','${sinopsis}','${cover}')`;

      const insertBuku = await runQuery(queryInsert);
      if (insertBuku) {
        const response =
          dev_mode === "development"
            ? {
                message: constantMessage.success,
              }
            : { message: constantMessage.success };
        setResponse(response, 200, res);
      }
    } else {
      const response =
        dev_mode === "development"
          ? {
              message: `Judul ${judul} pada tahun ${tahun_terbit} sudah tersedia`,
            }
          : { message: `Judul ${judul} pada tahun ${tahun_terbit} sudah tersedia` };
      setResponse(response, 500, res);
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
router.patch(`${mainurl}`, async (req, res) => {
  /*
    #swagger.tags = ['Koleksibuku']
    #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/KoleksibukuUpdate"
        }
      }
    }
  }
  */
  const sourceDir = uploadDir;
  const destinationDir = targetDir;
  const { id_file: id_fileName } = req.body;
  let { removedCover } = req.body;
  removedCover = setDefaultNull(removedCover);

  const queryCurrentFile = `select cover from _m_buku where id='${req.body.id}'`;
  const getCurrentFile = await getData(queryCurrentFile);
  let { cover: dbCover } = getCurrentFile[0];

  if (removedCover) {
    let getFile = await moveFiles(sourceDir, targetDir, id_fileName);
    console.log(`getFile`, getFile);
    if (getFile.coverFile) {
      req.body.cover = getFile.coverFile;
    } else {
      req.body.cover = null;
    }
  } else {
    req.body.cover = dbCover;
  }

  const { id, judul, penulis, tahun_terbit, id_kategori, sinopsis, cover } = req.body;
  const newBody = {
    id,
    id_kategori,
    judul,
    penulis,
    tahun_terbit,
    sinopsis,
    cover,
  };

  req.body = newBody;
  setQuery("select", setRequest(req, res), req.body, res).then((resultSelect) => {
    console.log(resultSelect);
    try {
      const response =
        dev_mode === "development"
          ? {
              message: resultSelect.message,
              query: resultSelect.query,
              queryUpdate: resultSelect.queryUpdate,
              paramSelect: resultSelect.paramSelect,
              paramUpdate: resultSelect.paramUpdate,
            }
          : { message: resultSelect.message };
      setResponse(response, resultSelect.code, res);
    } catch (error) {
      console.log(error);
    }
  });
});
router.delete(`${mainurl}`, (req, res) => {
  /*
    #swagger.tags = ['Koleksibuku']
    #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/KoleksibukuDelete"
        }
      }
    }
  }
  */
  setQuery("select", setRequest(req, res), req.body, res).then((resultSelect) => {
    console.log(resultSelect);
    try {
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
    #swagger.tags = ['Koleksibuku']
    #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/KoleksibukuList"
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
    #swagger.tags = ['Koleksibuku']
  }
  */
  const option = {
    tableName: "_m_Koleksibukus",
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
