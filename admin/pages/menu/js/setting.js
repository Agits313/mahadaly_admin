if (token) {
  (async () => {
    const getdata = await app.getData(`${base_url_api}/general/setting`);
    if (getdata) {
      const { denda_harian, max_day } = getdata.data;
      $("input[name=max_day]").val(max_day);
      $("input[name=denda_harian]").val(denda_harian);
    }

    let form = {
      form_element: ".settingForm",
      rules: {},
      messages: {},
      element_target: ".prosesdata",
      element_button: ".appSave",
      api_url: `${base_url_api}/general/setting`,
      button_text: `Simpan`,
    };
    app.form(form, function (data) {
      if (data.status) {
        alert("Penyimpanan berhasil");
      }
    });
  })();
}
