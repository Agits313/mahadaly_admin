if (token) {
  window.getModalData = async function (param) {
    const modalElement = "#generalmodal";
    // app.setSelect2Modal("#tablename", "Pilih tabel", {
    //   url:`${base_url_api}/table`,
    //   modalElement,
    // });

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
    /*                                Element Block                               */
    /* -------------------------------------------------------------------------- */
    //element
  };
}
