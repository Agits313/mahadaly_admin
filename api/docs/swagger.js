/* -------------------------------------------------------------------------- */
/*         Swagger Generator, Project starter - Thejagat, andibastian         */
/* -------------------------------------------------------------------------- */

const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" }); // versi 3

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const outputFile = "./docs/swagger.json";
const endpointsDirectory = "./routes";
let dev_mode = process.env.DEV_MODE;
let host = `localhost:${process.env.APP_PORT}`;
let schemes = ["http"];
if (dev_mode == "production") {
  host = process.env.HOST_NAME;
  schemes = [process.env.HOST_SCHEME];
}

const doc = {
  info: {
    title: "Perpustakaan",
    description: "Perpustakaan API Collection",
  },
  host: `localhost:${process.env.APP_PORT}`,
  schemes: schemes,
  components: {
    schemas: {
      Login: {
        userame: "admin",
        password: "admin$#",
      },
      Logout: {
        id: 0,
      },
      LoguserList: {
        start: 0,
        length: 10,
        search: "",
        order: [{ column: 0, dir: "asc" }],
        columns: [{ data: "id" }],
        orderDir: "asc",
      },
      LoguserAdd: {
        label: "loguser label",
      },
      LoguserUpdate: {
        label: "loguser label",
        id: 0,
      },
      LoguserDelete: {
        id: 0,
      },
      LevelList: {
        start: 0,
        length: 10,
        search: "",
        order: [{ column: 0, dir: "asc" }],
        columns: [{ data: "id" }],
        orderDir: "asc",
      },
      LevelAdd: {
        label: "level label",
      },
      LevelUpdate: {
        label: "level label",
        id: 0,
      },
      LevelDelete: {
        id: 0,
      },
      UsersList: {
        start: 0,
        length: 10,
        search: "",
        order: [{ column: 0, dir: "asc" }],
        columns: [{ data: "id" }],
        orderDir: "asc",
      },
      UsersAdd: {
        label: "users label",
      },
      UsersUpdate: {
        label: "users label",
        id: 0,
      },
      UsersDelete: {
        id: 0,
      },
      KategoribukuList: {
        start: 0,
        length: 10,
        search: "",
        order: [{ column: 0, dir: "asc" }],
        columns: [{ data: "id_kategori" }],
        orderDir: "asc",
      },
      KategoribukuAdd: {
        label: "kategoribuku label",
      },
      KategoribukuUpdate: {
        label: "kategoribuku label",
        id_kategori: 0,
      },
      KategoribukuDelete: {
        id_kategori: 0,
      },
      KoleksibukuList: {
        start: 0,
        length: 10,
        search: "",
        order: [{ column: 0, dir: "asc" }],
        columns: [{ data: "id" }],
        orderDir: "asc",
      },
      KoleksibukuAdd: {
        label: "koleksibuku label",
      },
      KoleksibukuUpdate: {
        label: "koleksibuku label",
        id: 0,
      },
      KoleksibukuDelete: {
        id: 0,
      },
      GeneralUploadFile: {
        file: "",
      },
      MemberRegister: {
        fullname: "Asep Budiman",
        nickname: "asepgombloh",
        email: "asep@asep.com",
        phone: "0818787878",
        password: "DanBegitulah",
      },
      Resetpassword: {
        email: "babang@babang.com",
      },
      MemberUpdatePassword: {
        id: 0,
        password1: "",
        password2: "",
      },
      KategoriBuku: {
        search: "",
      },
      KoleksiBuku: {
        id_kategori: 0,
        search: "",
      },
      DatamemberList: {
        start: 0,
        length: 10,
        search: "",
        order: [{ column: 0, dir: "asc" }],
        columns: [{ data: "id" }],
        orderDir: "asc",
      },
      DatamemberAdd: {
        label: "datamember label",
      },
      DatamemberUpdate: {
        label: "datamember label",
        id: 0,
      },
      DatamemberDelete: {
        id: 0,
      },
      StokbukuList: {
        start: 0,
        length: 10,
        search: "",
        order: [{ column: 0, dir: "asc" }],
        columns: [{ data: "id" }],
        orderDir: "asc",
      },
      StokbukuAdd: {
        label: "stokbuku label",
      },
      StokbukuUpdate: {
        label: "stokbuku label",
        id: 0,
      },
      StokbukuDelete: {
        id: 0,
      },
      TransaksiList: {
        start: 0,
        length: 10,
        search: "",
        order: [{ column: 0, dir: "asc" }],
        columns: [{ data: "id" }],
        orderDir: "asc",
      },
      TransaksiAdd: {
        label: "transaksi label",
      },
      TransaksiUpdate: {
        label: "transaksi label",
        id: 0,
      },
      TransaksiDelete: {
        id: 0,
      },
      //separator
    },
  },
};

function readFilesRecursively(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (!filePath.includes("static")) {
      if (fs.statSync(filePath).isDirectory()) {
        filelist = readFilesRecursively(filePath, filelist);
      } else {
        filelist.push(filePath);
      }
    }
  });
  return filelist;
}

const endpointFiles = readFilesRecursively(endpointsDirectory);

swaggerAutogen(outputFile, endpointFiles, doc);
