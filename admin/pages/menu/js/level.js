if (token) {
  let today = app.toDay();
  let dataUser = app.dataUser();

  const url = `${base_url_api}/level/list`;
  var tabledata = $(".tabledata").DataTable({
    ajax: {
      url: url,
      method: "post",
      dataSrc: "data",
      headers: headerData,
    },
    columns: [
      { data: "id", searchable: false },
      { data: "main_label" },
      //routedata
      {
        data: null,
        searchable: false,
        orderable: false,
        render: function (row) {
          return `<div class="d-flex actionData">
            <button type="button" class="btn link-icon-green appTableButton isModal isEdit py-0" data-hasform="true" data-title="Edit Level" data-modal="level" data-id="${row.id}">
                <i class="fas fa-edit"></i>
            </button>
            <button type="button" class="btn link-icon-red appTableButton isModal isDelete py-0" data-hasform="true" data-title="Delete Level" data-modal="level" data-label="${row.label}" data-id="${row.id}">
                <i class="fas fa-trash-alt"></i>
            </button></div>`;
        },
      },
    ],
    ...defaultOptionTable,
  });
  const psTable = new PerfectScrollbar(".dataTables_scrollBody");

  app.setScript(`js/app/event_data.js`);
}
