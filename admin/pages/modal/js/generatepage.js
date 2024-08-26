if (token) {
  window.getModalData = async function (param) {
    const ps = new PerfectScrollbar(".modal-body", {
      wheelSpeed: 2,
      wheelPropagation: true,
      suppressScrollX: true,
    });
    const modalElement = "#generalmodal";
    let isEdit = false;
    let isDelete = false;
    if (param.isEdit) {
      console.log(param.data);
      isEdit = param.isEdit;
      /* -------------------------------------------------------------------------- */
      /*                                    Data                                    */
      /* -------------------------------------------------------------------------- */
      // app.setValueModal("#label", param.data.label);
    } else {
      param.isEdit = isEdit;
    }

    if (param.isEdit || param.isDelete) {
      app.setValueModal("#id", param.data.id);
    }
    if (param.isDelete) {
      isDelete = param.isDelete;
    }

    let formData = {
      form_element: ".projectsForm",
      method: param.method,
      rules: {},
      messages: {},
      element_target: ".prosesdata",
      element_button: ".appSave",
      api_url: param.url,
      button_text: `Simpan`,
      table: ".tabledata",
      isEdit: param.isEdit,
    };
    app.form(formData);

    /* -------------------------------------------------------------------------- */
    /*                                   Events                                   */
    /* -------------------------------------------------------------------------- */
    $(".addNewFieldTable")
      .off()
      .on("click", function () {
        let rowField = `<div class="row mt-2"><div class="col"><input type="text" class="form-control" placeholder="Nama kolom" /></div>
                      <div class="col"><input type="text" class="form-control" placeholder="Kolom sumber data" /></div></div>`;
        $(".rowTable").append(rowField);
        ps.update();
      });
    $(".addNewFieldForm")
      .off()
      .on("click", function () {
        let rowField = `<div class="row mt-2"><div class="col"><input type="text" class="form-control" placeholder="Nama kolom" /></div>
                      <div class="col"><input type="text" class="form-control" placeholder="Kolom sumber data" /></div></div>`;
        $(".rowForm").append(rowField);
        ps.update();
      });

    /* -------------------------------------------------------------------------- */
    /*                                Element Block                               */
    /* -------------------------------------------------------------------------- */
    //element
  };
}
