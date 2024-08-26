if (token) {
  window.getModalData = async function (param) {
    const modalElement = "#generalmodal";
    let isEdit = false;
    let isDelete = false;
    if (param.isEdit) {
      console.log(param.data);
      isEdit = param.isEdit;
      /* -------------------------------------------------------------------------- */
      /*                                    Data                                    */
      /* -------------------------------------------------------------------------- */
      app.setValueModal("#label", param.data.label);
      /*field_area*/
    } else {
      param.isEdit = isEdit;
    }

    if (param.isEdit || param.isDelete) {
      app.setValueModal("#id", param.data.id);
      app.setValueModal("#id_kategori", param.data.id_kategori);
      app.setValueModal("#judul", param.data.judul);
      app.setValueModal("#kategori", param.data.kategori);
      app.setValueModal("#stok", param.data.stok);
    }
    if (param.isDelete) {
      isDelete = param.isDelete;
    }

    let formData = {
      form_element: "#generalForm",
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
    /*                                Element Block                               */
    /* -------------------------------------------------------------------------- */
    //element
  };
}
