if (token) {
  let today = app.toDay();
  let dataUser = app.dataUser();

  const url = `${base_url_api}/kategoribuku/list`;
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
      /*field_area*/
      {
        data: null,
        searchable: false,
        orderable: false,
        render: function (data, type, row) {
          return `<div class="d-flex actionData">
            <button type="button" class="btn link-icon-green appTableButton isModal isEdit py-0" data-hasform="true" data-title="Edit Kategoribuku" data-modal="kategoribuku" data-id="${row.id}" data-idname="id">
                <i class="fas fa-edit"></i>
            </button>
            <button type="button" class="btn link-icon-red appTableButton isModal isDelete py-0" data-hasform="true" data-title="Delete Kategoribuku" data-modal="kategoribuku" data-label="${row.label}" data-id="${row.id}"  data-idname="id">
                <i class="fas fa-trash-alt"></i>
            </button></div>`;
        },
      },
    ],
    ...defaultOptionTable,
  });
  const psTable = new PerfectScrollbar(".dataTables_scrollBody");
  filterContent = `<div class="col d-flex justify-content-end">
      <button type="button" class="btn btn-fill w-md-down-100 fw-semibold app_button isModal" data-hasform="true" data-height="true"
        data-modal="kategoribuku" data-title="Input Data Kategori">
        <i class="fas fa-plus fz-14 me-1"></i> Input Data
      </button>
    </div>`;
  $(".custom-dt .button-wrap").addClass("justify-content-between").append(filterContent);

  app.setScript(`js/app/event_data.js`);
}
