const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const { connection } = require("../../conf/index");
const { dev_mode, getData, runQuery, setResponse, constantMessage, setDefaultNull, generateNumberLeadingZero } = require("../../helper/index");
const moment = require("moment");

const mainurl = "/transaksi";

const getStok = async (idbuku) => {
  const getdata = await getData(`select stok from _d_stok_buku where id_buku='${idbuku}'`);
  return getdata[0];
};

const updateStok = async (idbuku, stok) => {
  const update = await runQuery(`update _d_stok_buku set stok='${stok}' where id_buku='${idbuku}'`);
};

router.post(`${mainurl}/add`, async (req, res) => {
  const { id, id_member } = req.body;

  try {
    const query = `select max(nomor) as max from _d_transaksi`;
    const getdata = await getData(query);
    const maxNumber = getdata[0].max;
    const newNumber = maxNumber + 1;
    const generateNumber = generateNumberLeadingZero(newNumber, 8);
    const { generated, number } = generateNumber;
    const nomor_transaksi = `TR/${id_member}-${generated}`;

    const queryInsert = `insert into _d_transaksi(nomor,nomor_transaksi,id_member) values ('${number}','${nomor_transaksi}','${id_member}')`;
    const insertTransaksi = await runQuery(queryInsert);
    const idTransaksi = insertTransaksi.insertId;

    if (idTransaksi) {
      const pengaturan = await getData(`select * from _m_pengaturan`);
      const detailPengaturan = pengaturan[0];
      const { max_day } = detailPengaturan;

      /* -------------------------------------------------------------------------- */
      /*                           insert detail pinjaman                           */
      /* -------------------------------------------------------------------------- */
      const dateMoment = moment().add(3, "days");
      const tanggal_kembali = moment(dateMoment).format("YYYY-MM-DD hh:mm:ss");

      for (let i = 0; i < id.length; i++) {
        const idbuku = id[i];
        const stokBuku = await getStok(idbuku);
        const newStok = stokBuku.stok - 1;
        const queryDetail = `insert into _d_transaksi_detail (id_transaksi,id_member,id_buku,tanggal_kembali) values ('${idTransaksi}','${id_member}','${idbuku}','${tanggal_kembali}')`;
        await runQuery(queryDetail);
        await updateStok(idbuku, newStok);
      }

      const results = {
        nomor_transaksi,
        id_member,
        tanggal_kembali,
      };
      const response =
        dev_mode === "development"
          ? {
              message: constantMessage.success,
              data: results,
            }
          : { message: constantMessage.success, data: results };
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

module.exports = router;
