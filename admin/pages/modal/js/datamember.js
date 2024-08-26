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
      app.setValueModal("#fullname", param.data.fullname);
      /*field_area*/
    } else {
      param.isEdit = isEdit;
    }

    if (param.isEdit || param.isDelete) {
      app.setValueModal("#id", param.data.id);
      app.setValueModal("#fullname", param.data.fullname);
      app.setValueModal("#nickname", param.data.nickname);
      app.setValueModal("#email", param.data.email);
      app.setValueModal("#phone", param.data.phone);
      $("#password").prop("disabled", true);
      $(".gantipassword").removeClass("d-none");
      $(".gantipassword").on("click", function (e) {
        e.preventDefault();
        $("#password").prop("disabled", false);
        $("#password").focus();
      });
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
    setTimeout(() => {
      $("#password").val("");
    }, 500);
    if (!param.isEdit) {
      setTimeout(() => {
        $("#email,#phone").val("");
      }, 500);
    } else {
      $("#password").val("");
    }
  };
}
