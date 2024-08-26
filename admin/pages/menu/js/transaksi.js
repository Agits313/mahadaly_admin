if (token) {
  let today = app.toDay();
  let dataUser = app.dataUser();

  const url = `${base_url_api}/transaksi/list`;
  var tabledata = $(".tabledata").DataTable({
    ajax: {
      url: url,
      method: "post",
      dataSrc: "data",
      headers: headerData,
    },
    columns: [
      { data: "row_number", searchable: false },
      { data: "main_label" },
      { data: "judul" },
      {
        data: "fullname",
        render: function (data, type, row) {
          let nim = row.nim ? `<br>${row.nim}` : "";
          let output = `${row.fullname}${nim}`;
          return output;
        },
      },
      { data: "tanggal_pinjam" },
      {
        data: null,
        render: function (data, type, row) {
          const setting = row.setting;
          const { max_day } = setting;
          const start = moment(row.tanggal_pinjam, "YYYY-MM-DD");
          const end = moment(app.toDay());
          const days = moment.duration(start.diff(end));
          let durasi = days.asDays();
          durasi = Math.abs(durasi);
          let output = `<font color="green">${durasi}</font>`;
          if (durasi >= max_day) {
            output = `<font color="red">${durasi}</font>`;
          }
          return output;
        },
      },
      { data: "tanggal_dikembalikan" },
      {
        data: null,
        render: function (data, type, row) {
          const setting = row.setting;
          const { denda_harian, max_day } = setting;
          const start = moment(row.tanggal_pinjam, "YYYY-MM-DD");
          const end = moment(app.toDay());
          const days = moment.duration(start.diff(end));
          let durasi = days.asDays();
          durasi = Math.abs(durasi);
          let output = 0;
          if (durasi >= max_day) {
            output = durasi * denda_harian;
            output = app.number_format(output);
          }
          return output;
        },
      },
      {
        data: null,
        searchable: false,
        orderable: false,
        render: function (data, type, row) {
          return `<div class="d-flex actionData">
            <button type="button" class="btn link-icon-green appTableButton isModal isEdit py-0" data-hasform="true" data-title="Edit Transaksi" data-modal="transaksi" data-id="${row.id}" data-idname="id">
                <i class="fa-solid fa-user-check fa-lg"></i>
            </button>
            </div>`;
        },
      },
    ],
    ...defaultOptionTable,
  });
  const psTable = new PerfectScrollbar(".dataTables_scrollBody");
  // filterContent = `<div class="col d-flex justify-content-end">
  //     <button type="button" class="btn btn-fill w-md-down-100 fw-semibold app_button isModal" data-hasform="true" data-height="true"
  //       data-modal="transaksi" data-title="Input Data Transaksi">
  //       <i class="fas fa-plus fz-14 me-1"></i> Input Data
  //     </button>
  //   </div>`;
  // $(".custom-dt .button-wrap").addClass("justify-content-between").append(filterContent);

  app.setScript(`js/app/event_data.js`);
}
