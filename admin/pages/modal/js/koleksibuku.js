app.setScript("./applib/dropzone/dist/dropzone-min.js");
app.setCSS("./applib/dropzone/dist/dropzone.css");

if (token) {
  window.getModalData = async function (param) {
    Dropzone.autoDiscover = false;
    const modalElement = "#generalmodal";
    let isEdit = false;
    let isDelete = false;
    const uuid = app.genUUID();
    $("#id_file").val(uuid);

    /* -------------------------------------------------------------------------- */
    /*                                   Editor                                   */
    /* -------------------------------------------------------------------------- */
    const summerNoteOption = {
      tabsize: 2,
      height: 180,
      disableResizeEditor: true,
      toolbar: [
        ["style", ["bold", "italic", "underline", "clear"]],
        ["font", ["strikethrough", "superscript", "subscript"]],
        ["para", ["ul", "ol", "paragraph"]],
        ["table", ["table"]],
        ["view", ["fullscreen", "codeview"]],
        ["insert", ["link"]],
      ],
    };
    setTimeout(() => {
      $("#sinopsis").summernote({
        placeholder: "Sinopsis BUku",
        ...summerNoteOption,
      });
    }, 500);

    $("#sinopsis").on("summernote.init", function (we, e) {
      $(".loadingItem").addClass("d-none");
      $(".editor").removeClass("d-none");
    });

    $("#generalmodal").on("hidden.bs.modal", function (e) {
      $("#sinopsis").summernote("destroy");
      $(".editor").addClass("d-none");
      $(".loadingItem").removeClass("d-none");
    });

    app.setSelect2Modal("#id_kategori", "Pilih Kategori", {
      url: `${base_url_api}/kategoribuku/list`,
      method: "post",
      idKey: "id",
      textKey: "name",
    });

    if (param.isEdit) {
      console.log(param.data);
      isEdit = param.isEdit;
      /* -------------------------------------------------------------------------- */
      /*                                    Data                                    */
      /* -------------------------------------------------------------------------- */
      app.setValueModal("#judul", param.data.judul);
      app.setValueModal(
        "#id_kategori",
        {
          id: param.data.id_kategori,
          value: param.data.kategori,
        },
        "select"
      );
      app.setValueModal("#penulis", param.data.penulis);
      app.setValueModal("#tahun_terbit", param.data.tahun_terbit);
      app.setValueModal("#sinopsis", param.data.sinopsis);
    } else {
      param.isEdit = isEdit;
    }

    if (param.isEdit || param.isDelete) {
      app.setValueModal("#id", param.data.id);
    }
    if (param.isDelete) {
      isDelete = param.isDelete;
    }

    var fileCoverDropzone = new Dropzone("#contentCover", {
      url: `${base_url_api}/general/upload_temp`,
      paramName: "file",
      maxFilesize: 10,
      maxFiles: 1,
      acceptedFiles: ".jpg,.png,.jpeg",
      dictDefaultMessage: "Drag & drop or click here to upload image files",
      dictFallbackMessage: "Your browser does not support drag and drop file uploads.",
      dictFileTooBig: "File is too big ({{filesize}}MB). Max filesize: {{maxFilesize}}MB.",
      dictInvalidFileType: "You can't upload files of this type.",
      dictResponseError: "Server responded with {{statusCode}} code.",
      dictCancelUpload: "Cancel upload",
      dictCancelUploadConfirmation: "Cancel Upload ??",
      dictRemoveFile: "Remove file",
      dictMaxFilesExceeded: "You can not upload any more files.",
      autoProcessQueue: true,
      addRemoveLinks: true,
      init: function () {
        if (isEdit) {
          const fileCover = {
            name: `Cover File`,
            realName: param.data.cover,
            thumbnailUrl: `${base_url_api}/koleksibuku/${param.data.cover}`,
          };
          if (param.data.cover) {
            this.emit("addedfile", fileCover);
            this.emit("complete", fileCover);
            this.emit("thumbnail", fileCover, fileCover.thumbnailUrl);
          }
        }

        this.on("sending", function (file, xhr, formData) {
          formData.append("type_file", $("#type_content").val());
          formData.append("uuid", $("#id_file").val());
          formData.append("prefix", "cover");
          if (isEdit) {
            formData.append("id", $("#id").val());
          }
        });
        this.on("maxfilesreached", function () {
          this.options.autoProcessQueue = false;
        });
        this.on("addedfile", function (file) {
          if (this.files.length > this.options.maxFiles) {
            this.removeFile(file);
          }
        });
        this.on("removedfile", function (file) {
          this.options.autoProcessQueue = true;
          $("#removedCover").val(file.realName);
        });
      },
    });

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
