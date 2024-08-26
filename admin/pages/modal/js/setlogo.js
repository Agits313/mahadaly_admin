if (token) {
  window.getModalData = async function (param) {
    const modalElement = "#generalmodal";
    let rowdata = $("#rowdata").val();
    rowdata = JSON.parse(rowdata);
    $("#projectname").val(rowdata.label);
    param.isEdit = true;
    app.setValueModal("#projectname", rowdata.label);
    app.setValueModal("#id", rowdata.id);
    app.setValueModal("#project_path", rowdata.project_path);

    $("#filelogo").on("change", function () {
      $(this).simpleUpload(`${base_url_api}/project/addlogo`, {
        start: function (file) {
          console.log(file);
          console.log("upload started");
        },

        progress: function (progress) {
          console.log("upload progress: " + Math.round(progress) + "%");
        },

        success: function (data) {
          console.log("upload successful!");
          console.log(data);
          $("#filelogo").prop("disabled", true);
          $("#logo").val(data.file.path);
        },

        error: function (error) {
          const errordata = error.xhr.responseJSON;
          alert(`Error : ${errordata.message}`);
        },
      });
    });

    let formData = {
      form_element: "#generalForm",
      method: "patch",
      rules: {},
      messages: {},
      element_target: ".prosesdata",
      element_button: ".appSave",
      api_url: `${base_url_api}/project/setlogo`,
      button_text: `Simpan`,
      table: ".tabledata",
      isEdit: param.isEdit,
    };
    console.log(formData);
    app.form(formData);
    /* -------------------------------------------------------------------------- */
    /*                                Element Block                               */
    /* -------------------------------------------------------------------------- */
    //element
  };
}
