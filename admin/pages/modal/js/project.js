if (token) {
  window.getModalData = async function (param) {
    let isEdit = false;
    let isDelete = false;
    let table_template;
    if (param.isEdit) {
      console.log(param.data);
      isEdit = param.isEdit;
      app.setValueModal("#label", param.data.label);
      app.setValueModal("#client", { value: param.data.client, id: param.data.id_client }, "select");
      app.setValueModal("#category", { value: param.data.category, id: param.data.id_category }, "select");
      app.setValueModal("#database", param.data.database);
      app.setValueModal("#project_value", param.data.project_value);
      app.setValueModal("#date_start", param.data.date_start);
      app.setValueModal("#date_end", param.data.date_end);
      app.setValueModal("#dbdriver", { value: param.data.label_dbdriver, id: param.data.dbdriver }, "select");
      table_template = JSON.parse(param.data.table_template);
    } else {
      param.isEdit = isEdit;
    }

    if (param.isEdit || param.isDelete) {
      app.setValueModal("#id", param.data.id);
    }
    if (param.isDelete) {
      isDelete = param.isDelete;
    }
    const modalElement = "#generalmodal";
    console.log(param);
    app.setSelect2Modal("#client", "Client", {
      url: `${base_url_api}/client/list`,
      idKey: "id",
      textKey: "name",
      modalElement,
      method: "post",
    });

    app.setSelect2Modal("#category", "Kategori", {
      url: `${base_url_api}/category/list`,
      idKey: "id",
      textKey: "label",
      modalElement,
      method: "post",
    });

    app.setSelect2Modal("#dbdriver", "Driver", {
      url: `${base_url_api}/dbdriver/list`,
      idKey: "id",
      textKey: "label",
      modalElement,
      method: "post",
    });
    app.setValueModal("#dbdriver", { value: "MYSQL", id: 1 }, "select");

    let formData = {
      form_element: ".projectForm",
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
    console.log(formData);
    $("#date_start,#date_end").datepicker({
      format: "yyyy-mm-dd",
    });

    /* -------------------------------------------------------------------------- */
    /*                              Checkbox Template                             */
    /* -------------------------------------------------------------------------- */
    let tableList = await app.postData(`${base_url_api}/tabletemplate/list`, { data: { search: "", idKey: "id" } }).then((res) => {
      return res;
    });
    console.log(tableList);

    let content = "";
    tableList.data.forEach((val) => {
      checked = "";
      if (isEdit) {
        if (table_template.includes(val.id.toString())) {
          checked = "checked";
        }
      }
      content += `<div class="form-check"><input class="form-check-input" name="table_template[]" type="checkbox" value="${val.id}" ${checked} /><label class="form-check-label" for=""> ${val.label} </label></div>`;
    });
    $(".tableList").html(content);

    app.form(formData);
    const psModal = new PerfectScrollbar(".modal-body", {
      wheelSpeed: 2,
    });
  };
}
