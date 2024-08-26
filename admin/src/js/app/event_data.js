var method = "post";

$(".app_button")
  .off()
  .on("click", function (e) {
    let isModal = $(this).hasClass("isModal");
    let isDelete = $(this).hasClass("isDelete");
    let isEdit = $(this).hasClass("isEdit");
    let isFile = $(this).data("isFile");
    let title = $(this).data("title");
    let urlname = $(this).data("modal");
    let setWidth = $(this).data("width");

    url = `${base_url_api}/${urlname}`;
    if (!title) {
      title = $(this).text();
      title = title.trim();
    }
    let menu = $(this).data("menu");
    let hasForm = $(this).data("hasform");
    let setHeight = $(this).data("height");
    let idname = $(this).data("idname");
    method = "post";
    if (isEdit) {
      method = "patch";
    }
    if (isDelete) {
      method = "delete";
    }
    let dataRow = $("#rowdata").val();
    if (dataRow) {
      dataRow = JSON.parse(dataRow);
    }
    if (isModal) {
      let paramModal = {
        modal: $(this).data("modal"),
        hasForm: hasForm,
        title: title,
        setHeight,
        setWidth,
        isEdit,
        isFile,
        isDelete,
        data: dataRow,
        url,
        method,
        table: ".tabledata",
        idname,
      };
      console.log(paramModal);
      app.setModal(paramModal);
    }

    app.socketEmitter({
      activity_name: "click",
      menu: menu,
      title: title,
    });
  });

/* -------------------------------------------------------------------------- */
/*                             Click inside table                             */
/* -------------------------------------------------------------------------- */
$(".tabledata tbody").on("click", ".appTableButton", function (e) {
  let dataRow = tabledata.row(e.target.closest("tr")).data();
  let isDelete = $(this).hasClass("isDelete");
  let isEdit = $(this).hasClass("isEdit");
  let isFile = $(this).data("isFile");
  let urlname = $(this).data("modal");
  let setWidth = $(this).data("width");
  url = `${base_url_api}/${urlname}`;
  console.log(isDelete, isEdit);
  let isModal = $(this).hasClass("isModal");
  let title = $(this).data("title");
  if (!title || title == "") {
    title = $(this).text();
    title = title.trim();
  }
  let menu = $(this).data("menu");
  let hasForm = $(this).data("hasform");
  let setHeight = $(this).data("height");
  let idname = $(this).data("idname");
  if (isEdit) {
    method = "patch";
  }
  if (isDelete) {
    method = "delete";
  }
  if (isModal) {
    let paramModal = {
      modal: $(this).data("modal"),
      hasForm: hasForm,
      title: title,
      setHeight,
      setWidth,
      isEdit,
      isDelete,
      isFile,
      data: dataRow,
      url,
      method,
      table: ".tabledata",
      idname,
    };
    console.log(paramModal);
    app.setModal(paramModal);
  }

  app.socketEmitter({
    socketEvent: "event",
    activity_name: "click",
    menu: menu,
    title: title,
  });
});
