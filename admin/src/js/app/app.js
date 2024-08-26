let current_url = document.location.href;
var storage = window.localStorage;
let userid = storage.getItem("userid");
let email = storage.getItem("email");
let token = storage.getItem("token");
let iduser = storage.getItem("iduser");

let headerData = {
  apiKey: api_key,
};
let menu;
var isLoaded = false;
var ajaxLoad;
var intervalId = null;

let is_layout_multiple = 0;
let url_split = current_url.split("/");
let last_urlpath = url_split.pop();
last_urlpath = last_urlpath.replace("#", "");
var modalData = {};
if (typeof geolocation == "undefined") {
  geolocation = navigator.geolocation;
}

var url = "";
var passedParam;
$.ajaxSetup({
  cache: false,
  headers: headerData,
  global: false,
});

var app = {
  getData: function (url) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: url,
        async: true,
        dataType: "json",
        success: function (data) {
          resolve(data);
        },
        error: function (err) {
          reject(err);
        },
      });
    });
  },
  postData: async function (url, param) {
    let data = {};
    if (param && param.data) {
      data = param.data;
    }

    return $.ajax({
      method: "POST",
      url: url,
      async: true,
      data: data,
    }).then((response) => {
      return response;
    });
  },
  deleteData: async function (url, param) {
    const data = param.data;
    return $.ajax({
      method: "DELETE",
      url: url,
      async: true,
      data: data,
    }).then((response) => {
      return response;
    });
  },
  withLoading: function (fn) {
    return function () {
      loading("Mohon tunggu..");
      const result = fn.apply(this, arguments);
      result.finally(closeLoading);
      return result;
    };
  },
  login: function (element) {
    if (!element) {
      element = ".form_login";
    }
    let formdata = {
      form_element: element,
      rules: {
        username: "required",
        password: "required",
      },
      messages: {
        username: "Username wajib diisi!",
        password: "Password wajib diisi!",
      },
      element_target: ".prosesdata",
      element_button: ".button_login",
      api_url: `${base_url_api}/auth/login`,

      button_text: `<img src="assets/img/custom/login.svg" class="icon-3 me-2">Login`,
    };

    this.form(formdata, function (data) {
      if (data.status) {
        storage.setItem("token", data.token);
        document.location.reload();
      }
    });
  },
  logout: function (url = null) {
    let dataUser = this.dataUser();
    let param = {
      data: {
        id: dataUser.data.id,
      },
    };
    if (!url) {
      url = `${base_url_api}/auth/logout`;
    }

    const logoutProcess = this.withLoading(() => {
      return new Promise((resolve, reject) => {
        this.postData(url, param)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
    logoutProcess()
      .then((res) => {
        if (res.status) {
          if (typeof socket !== "undefined") {
            socket.emit("logout", `User ${dataUser.data.fullname} Logged Out`);
          }
          $(app_root).html("");
          storage.clear();
          document.location = "home";
        } else {
          alert(`error ${res.message}`);
        }
      })
      .catch((err) => {
        //force logout
        $(app_root).html("");
        storage.clear();
        document.location = "home";
      });
  },
  isLogin: function () {
    token = storage.getItem("token");
    let output = false;
    if (token && token !== "undefined" && typeof token !== "undefined") {
      output = true;
    } else {
      storage.clear();
    }
    return output;
  },
  validatePassword: function (element1, element2) {
    var password = $(element1).val();
    var confirmPassword = $(element2).val();

    if (password === "" || confirmPassword === "") {
      return false;
    }

    if (password !== confirmPassword) {
      return false;
    }
    return true;
  },
  dataUser: function () {
    if (token) {
      let decode = this.parseJWT(token);
      return decode;
    }
  },
  isExpired: function () {
    if (token) {
      let decode = this.parseJWT(token);
      if (Date.now() >= decode.exp * 1000) {
        return true;
      } else {
        return false;
      }
    }
  },
  isUrlExists: async function (url) {
    try {
      const response = await fetch(url, { method: "HEAD" });
      if (response.ok) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  },
  setDefaultTitle: function (text) {
    $("title").html(text);
  },
  setMenu: function (usermenu = null) {
    if (!this.isLogin() && last_urlpath !== "register") {
      menu = "login";
    } else {
      let isExpired = this.isExpired(token);
      if (isExpired) {
        this.logout();
      } else {
        if (!usermenu || typeof usermenu === "undefined") {
          menu = "home";
          if (last_urlpath == "register") {
            menu = "register";
          }
          if (last_urlpath && token && last_urlpath !== "login") {
            menu = last_urlpath.replace(".html", "");
            menu = menu.replace("#", "");
          }
        } else {
          menu = usermenu;
        }
      }
    }
    console.log(menu, last_urlpath);
    return menu;
  },
  getPrefixFile: function () {
    let prefix_file = ".";
    return prefix_file;
  },
  isMultipleLayout: function (token) {
    let output = 0;
    return output;
  },
  setLayout: function (is_multiple = 0, callback) {
    let file, filejs;
    let prefix_file = this.getPrefixFile();
    if (is_multiple == 1) {
      if (menu == "home") {
        file = `${prefix_file}/layout/index.html`;
        filejs = `${prefix_file}/layout/index.js`;
      } else {
        file = `${prefix_file}/layout/nonhome.html`;
        filejs = `${prefix_file}/layout/nonhome.js`;
      }
    } else {
      file = `${prefix_file}/layout/index.html`;
      filejs = `${prefix_file}/layout/index.js`;
    }
    isLoaded = false;
    app.loadFile(file, function (html) {
      $(app_root).html(html);
      $("input[type=text]").attr("autocomplete", "off");
      app.loadScript(filejs);
      if (typeof callback !== "undefined") {
        callback();
      }
    });
  },
  setBartitle: function (param) {
    if (param.title.toLowerCase() !== "login" || param.title.toLowerCase() !== "register") {
      if (param.title.toLowerCase() == "home") {
        param.title = "Dashboard";
      }
      $(param.element).html(param.title);
    }
  },
  getStorage: function (key) {
    let output = false;
    if (storage.getItem(key)) {
      output = true;
    }
    return output;
  },
  loadFile: function (url, callback) {
    console.log(`Load ${url}`);
    if (!isLoaded) {
      ajaxLoad = $.ajax({
        url: url,
        dataType: "html",
        success: function (data) {
          if (typeof callback !== "undefined") {
            callback(data);
          } else {
            return data;
          }
          console.log("Done");
          isLoaded = true;
        },
        done: function (xhr, status) {
          console.log("Done");
          isLoaded = true;
        },
        error: function (xhr, status, error) {
          console.log(`Error ${url}, ${status} : ${error}`);
        },
        complete: function (xhr, status) {
          console.log(`${url} : ${isLoaded}`);
        },
      });
    }
  },
  setContent: async function (param, callback) {
    let prefix_file = this.getPrefixFile();
    let source = param.source;
    menu = param.menu;
    console.log(param);

    if (typeof include === "undefined") {
      alert("Modul mobileui include tidak tersedia");
      return;
    }

    if (!param.event) {
      await this.setLayout(is_layout_multiple, function () {
        console.log(`Debug 1# ${menu}`);
        if (menu) {
          let app_element = app_root_content;
          if (typeof param.title == "undefined") {
            param.title = "home";
          }
          let bartitle = app.setStringUpFirst(param.title);
          let elementContent = "#contentLayout";
          if (menu == "login" || menu == "register") {
            app_element = app_login;
            elementContent = "#contentLogin";
          }
          console.log(`Debug 2# ${app_element}`);
          console.log(`Debug 3# ${menu}`);

          app.setBartitle({
            element: ".app_bar_title",
            title: bartitle,
          });

          if (menu !== "login") {
            $(app_element).addClass("d-none");
            history.pushState({ menu: menu, title: bartitle }, menu, "/" + menu);
          } else {
            history.pushState({ menu: menu, title: bartitle }, menu, "/" + menu);
          }

          let urlfile = `${prefix_file}/menu/${menu}`;
          let checkELement = $(elementContent).length;
          console.log(`URL File ${urlfile}`);
          console.log(`Debug 4# ${checkELement}`);
          if (checkELement > 0) {
            elementContent = elementContent.replace("#", "");
            include(elementContent, urlfile, function () {
              app.loadScript(`${prefix_file}/menu/js/${menu}.js`);
              $(app_element).removeClass("d-none");
              let urlmodal = `${prefix_file}/modal/index.html`;
              app.loadScript(`js/app/event.js`);
              include("blockModal", urlmodal, function () {
                app.loadScript(`${prefix_file}/modal/index.js`);
              });
              if (typeof callback !== "undefined") {
                callback();
              }
            });
          } else {
            alert(`Element ${elementContent} tidak ditemukan`);
          }
        }
      });
    } else {
      //event menu
      if (menu) {
        let app_element = app_root_content;
        let bartitle = app.setStringUpFirst(param.title);
        if (menu == "login" || menu == "register") {
          app_element = app_root;
        }
        console.log(`Debug 2# ${app_element}`);
        app.setBartitle({
          element: ".app_bar_title",
          title: bartitle,
        });
        console.log(`Debug 3# ${menu}`);
        if (menu !== "login") {
          $(app_element).addClass("d-none");
          history.pushState({ menu: menu, title: bartitle }, menu, "/" + menu);
        } else {
          history.pushState({ menu: menu, title: bartitle }, menu, "/" + menu);
        }
        let elementContent = "#contentLayout";
        let urlfile = `${prefix_file}/menu/${menu}`;
        let checkELement = $(elementContent).length;
        console.log(`URL File ${urlfile}`);
        console.log(`Debug 4# ${checkELement}`);
        if (checkELement > 0) {
          include("contentLayout", urlfile, function () {
            app.loadScript(`${prefix_file}/menu/js/${menu}.js`);
            $(app_element).removeClass("d-none");
            let urlmodal = `${prefix_file}/modal/index.html`;
            app.loadScript(`js/app/event.js`);
            include("blockModal", urlmodal, function () {
              app.loadScript(`${prefix_file}/modal/index.js`);
            });
            if (typeof callback !== "undefined") {
              callback();
            }
          });
        } else {
          alert(`Element ${elementContent} tidak ditemukan`);
        }
      }
    }
  },
  setModal: async function (param) {
    const { modal, title, hasForm = false, setHeight = false } = param;
    let hasData = false;

    if (param.data) {
      hasData = true;
      modalData = param.data;
    }
    let isEdit = false;
    let isDelete = false;
    let isFile = false;

    // if (param.hasOwnProperty("isEdit")) {
    //   isEdit = JSON.parse(param.isEdit);
    // }
    if (param.hasOwnProperty("isDelete")) {
      isDelete = JSON.parse(param.isDelete);
    }
    if (param.hasOwnProperty("isFile")) {
      if (param.isFile) {
        isFile = JSON.parse(param.isFile);
      }
    }

    let urlModal = `modal/${modal}.html`;
    let isModalExist = await this.isUrlExists(urlModal).then((res) => {
      return res;
    });

    let urlModalJS = `modal/js/${modal}.js`;
    let isModalJSExist = await this.isUrlExists(urlModalJS).then((res) => {
      return res;
    });
    console.log(param);

    if (!isModalExist) {
      this.alert("404", `URL ${urlModal}`);
      return;
    }

    if (!isModalJSExist) {
      this.alert("404", `URL ${urlModalJS}`);
      return;
    }

    if (!isDelete) {
      include("contentModal", urlModal, function () {
        app.loadScript(`modal/js/${modal}.js`, function () {
          if (setHeight) {
            $("#generalmodal .modal-content").addClass("modalCustom-height");
          } else {
            $("#generalmodal .modal-content").removeClass("modalCustom-height");
          }

          /* -------------------------------------------------------------------------- */
          /*                                  Form init                                 */
          /* -------------------------------------------------------------------------- */
          let formClass = modal.replaceAll(" ", "");
          formClass = formClass.toLowerCase();
          if (hasForm) {
            console.log(formClass);
            let checkform = $("#generalmodal form").length;
            if (checkform == 0) {
              let modalContent = $("#generalmodal .modal-content");
              let form = $(`<form id="generalForm" class="${formClass}Form"></form>`);
              if (isFile) {
                form = $(`<form id="generalForm" enctype="multipart/form-data" class="${formClass}Form"></form>`);
              }

              modalContent.before(form);
              form.append(modalContent);
            } else {
              $("#generalmodal form").removeClass();
              $("#generalmodal form").addClass(`${formClass}Form`);
            }
            $("#generalmodal form input[type=text]").attr("autocomplete", "off");
            $("#generalmodal form input[type=email]").attr("autocomplete", "off");
            $("#generalmodal form input[type=number]").attr("autocomplete", "off");
          }
          $("#modalTitleGeneralId").html(title);
          $("#generalmodal").off("shown.bs.modal");

          if (param.setWidth) {
            $("#generalmodal .modal-dialog").removeClass("modal-lg");
            $("#generalmodal .modal-dialog").addClass("modal-xl");
          }
          $("#generalmodal").on("show.bs.modal", function (e) {
            $(this).addClass("generalmodal");
          });

          $("#generalmodal").on("shown.bs.modal", function (e) {
            $("#generalmodal form:first *:input[type=text]:first").focus();
            if (typeof getModalData !== "undefined") {
              getModalData(param).then((res) => {
                console.log("loaded");
              });
            }

            var screenHeight = $(window).height();
            var modalContent = $(this).find(".modal-content");
            var headerHeight = modalContent.find(".modal-header").outerHeight();
            var footerHeight = modalContent.find(".modal-footer").outerHeight();
            var availableHeight = screenHeight - (headerHeight + footerHeight);

            // Set the max-height of the modal's content
            modalContent.find(".modal-body").css("max-height", availableHeight + "px");
            if (!param.hasForm) {
              $(".modal-footer .appSave").addClass("d-none");
              $(".modal-footer .appCancel").html("Close");
            } else {
              $(".modal-footer .appSave").removeClass("d-none");
            }

            if (param.hideButton) {
              $(".modal-footer").addClass("d-none");
            } else {
              $(".modal-footer").removeClass("d-none");
            }
          });
          $("#generalmodal").on("hidden.bs.modal", function (e) {
            if (param.hasForm) {
              $("#generalForm")[0].reset();
            }

            $(this).removeClass("generalmodal");
          });

          $("#generalmodal").modal("show");
        });
      });
    } else {
      /* -------------------------------------------------------------------------- */
      /*                             Delete Modal - SWAL                            */
      /* -------------------------------------------------------------------------- */
      app.modalDelete(param);
    }
  },
  closeModal: function (element) {
    if (element) {
      $(element).modal("hide");
    } else {
      $("#generalmodal").modal("hide");
    }
  },
  setValueModal: function (element, value, type = "text") {
    if (type == "text") {
      $(`#generalmodal ${element}`).val(value);
    } else {
      if (type == "select") {
        if (value.id) {
          const newOption = new Option(value.value, value.id, true, true);
          $(`#generalmodal ${element}`).append(newOption);
          $(`#generalmodal ${element}`).trigger("change");
          $(`#generalmodal ${element}`).prop("disabled", false);
        }
      } else {
        $(`#generalmodal ${element}`).html(value);
      }
    }
  },
  /* -------------------------------------------------------------------------- */
  /*                              Select2 functions                             */
  /* -------------------------------------------------------------------------- */
  setSelect2: function (selector, placeholder, param = null) {
    const options = {
      placeholder: placeholder,
      allowClear: true,
    };
    let method = param.method ? param.method.toUpperCase() : "GET";
    if (param) {
      const { url, idKey, textKey } = param;
      options.ajax = {
        url: url,
        dataType: "json",
        method,
        delay: 250,
        minimumInputLength: 0,
        data: function (param) {
          return {
            search: param.term ? param.term : "",
          };
        },
        processResults: function (response) {
          return {
            results: response.data.map(function (item) {
              return { id: item[idKey], text: item[textKey] };
            }),
          };
        },
        cache: true,
      };
    }

    $(selector).select2(options);
    $(selector).on("select2:open", () => {
      $(selector).find(".select2-search__field").focus();
    });
  },
  setSelect2Modal: function (selector, placeholder, param = null) {
    const { url, idKey, textKey } = param;

    let modalElement = param.modalElement ? param.modalElement : "#generalmodal";
    let method = param.method ? param.method.toUpperCase() : "GET";
    let additionalData = param.data ? { ...param.data } : {};

    const options = {
      placeholder: placeholder,
      allowClear: true,
      dropdownParent: $(modalElement),
    };

    console.log(idKey, textKey);
    if (url && idKey && textKey) {
      options.ajax = {
        url: url,
        dataType: "json",
        method,
        delay: 250,
        minimumInputLength: 0,
        data: function (param) {
          return {
            search: param.term ? param.term : "",
            idKey,
            additionalData,
          };
        },
        processResults: function (response) {
          return {
            results: response.data.map(function (item) {
              return { id: item[idKey], text: item[textKey] };
            }),
          };
        },
        cache: true,
      };
    }

    $(selector).select2(options);
  },
  setChart: function (type = "column", idElement, param, urutan = 0) {
    return new Promise((resolve) => {
      let options;
      let seriesData = [
        {
          name: param.name,
          colorByPoint: true,
          data: param.data,
        },
      ];
      const optionsGeneral = {
        chart: {
          type: type,
        },
        title: {
          text: param.title,
          align: "left",
          margin: 30,
        },
        series: seriesData,
        navigation: {
          buttonOptions: {
            enabled: false,
          },
        },
        exporting: {
          buttons: {
            contextButton: {
              menuItems: ["downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG"],
            },
          },
        },
      };

      switch (type) {
        case "pie":
          options = {
            chart: {
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
            },
            legend: {
              layout: "vertical",
              align: "right",
              itemMarginBottom: 10,
              verticalAlign: "middle",
              labelFormat: "<b>{name}</b>: {percentage:.1f}% ({y:.0f})",
            },
            plotOptions: {
              pie: {
                allowPointSelect: true,
                cursor: "pointer",
                dataLabels: {
                  enabled: false,
                },
                showInLegend: true,
              },
            },
          };
          break;
        case "column":
          options = {
            legend: {
              enabled: false,
            },
            plotOptions: {
              series: {
                borderWidth: 0,
                dataLabels: {
                  enabled: true,
                  format: "{point.y:.0f}",
                },
              },
            },
            accessibility: {
              announceNewData: {
                enabled: true,
              },
            },
            xAxis: {
              type: "category",
            },
            yAxis: {
              title: {
                text: param.title,
              },
            },
            tooltip: {
              headerFormat: '<span style="font-size:12px">{series.name}</span><br>',
              pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.0f}</b><br/>',
            },
          };
          break;
        case "bar":
          options = {
            chart: {
              type: "bar",
            },
            legend: {
              enabled: false,
            },
            plotOptions: {
              series: {
                borderWidth: 0,
                dataLabels: {
                  enabled: true,
                  format: "{point.y:.0f}",
                },
              },
            },
            accessibility: {
              announceNewData: {
                enabled: true,
              },
            },
            xAxis: {
              type: "category",
            },
            yAxis: {
              title: {
                text: param.title,
              },
            },
            tooltip: {
              headerFormat: '<span style="font-size:12px">{series.name}</span><br>',
              pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.0f}</b><br/>',
            },
          };
          break;
      }
      function createChart(idElement) {
        Highcharts.setOptions({
          lang: {
            thousandsSep: ",",
          },
        });
        let chart = Highcharts.chart(idElement, Object.assign({}, options, optionsGeneral));
        $(idElement).removeClass("hideImportant");
        $(".chart_fullscreen_" + idElement).removeClass("d-none");
        $(".chart_fullscreen_" + idElement)
          .off()
          .on("click", function () {
            chart.fullscreen.toggle();
          });
      }

      createChart(idElement);

      resolve();
    });
  },
  loadScript: function (url, callback) {
    $.ajax({
      url: url,
      dataType: "script",
      async: true,
      success: function () {
        if (typeof callback !== "undefined") {
          callback();
        }
      },
      fail: function (e) {
        alert(`error load ${url}`);
      },
    });
  },
  addElement: function (selector, el_wrapper, init_text = 0) {
    var jumlahelement = $(selector).length;
    if (typeof el_wrapper !== "undefined") {
      wrapper = $(el_wrapper);
    } else {
      wrapper = $("body");
    }
    let default_text = "";
    if (init_text) {
      default_text = "Please wait..";
    }
    if (jumlahelement == 0) {
      if (selector.indexOf("#") >= 0) {
        var namaselector = selector.replace("#", "");
        wrapper.append(`<div id="${namaselector}">${default_text}</div>`);
      }
      if (selector.indexOf(".") >= 0) {
        var namaselector = selector.replace(".", "");
        wrapper.append(`<div class="${namaselector}">${default_text}</div>`);
      }
    }
  },
  deleteElement: function (selector) {
    var jumlahelement = $(selector).length;
    if (jumlahelement != 0) {
      $(selector).remove();
    }
  },
  extend: function () {
    var extended = {};
    var deep = false;
    var i = 0;
    var length = arguments.length;
    if (Object.prototype.toString.call(arguments[0]) === "[object Boolean]") {
      deep = arguments[0];
      i++;
    }
    var merge = function (obj) {
      for (var prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
          if (deep && Object.prototype.toString.call(obj[prop]) === "[object Object]") {
            extended[prop] = extend(true, extended[prop], obj[prop]);
          } else {
            extended[prop] = obj[prop];
          }
        }
      }
    };
    for (; i < length; i++) {
      var obj = arguments[i];
      merge(obj);
    }
    return extended;
  },
  timestamp: function () {
    var date;
    date = new Date();
    date =
      date.getUTCFullYear() +
      "-" +
      ("00" + (date.getUTCMonth() + 1)).slice(-2) +
      "-" +
      ("00" + date.getUTCDate()).slice(-2) +
      " " +
      ("00" + date.getUTCHours()).slice(-2) +
      ":" +
      ("00" + date.getUTCMinutes()).slice(-2) +
      ":" +
      ("00" + date.getUTCSeconds()).slice(-2);
    return date;
  },
  formatDate: function (date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("-");
  },
  dateOfMonth: function (month, year) {
    const firstDate = new Date(year, month, 1);
    const lastDate = new Date(year, month + 1, 0);
    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const yearShort = String(date.getFullYear()).substring(-2);
      return `${day}-${month}-${yearShort}`;
    };
    return {
      firstDate: formatDate(firstDate),
      lastDate: formatDate(lastDate),
    };
  },
  changeDateFormat: function (dateString) {
    const [month, day, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  },
  dateFormat: function (inputdate) {
    let result = inputdate.split("T");
    return result[0];
  },
  makeid: function (length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },
  array_sum: function (total, num) {
    return total + num;
  },
  unescapeHtml: function (unsafe) {
    return unsafe
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");
  },
  teks_headline: function (str, length, ending) {
    if (length == null) {
      length = 100;
    }
    if (ending == null) {
      ending = "...";
    }
    if (str.length > length) {
      return str.substring(0, length - ending.length) + ending;
    } else {
      return str;
    }
  },
  clean_tag: function (input) {
    input = this.unescapeHtml(input);
    return input.replace(/(<([^>]+)>)/gi, "");
  },
  number_format: function (number, decimals, decPoint, thousandsSep) {
    number = (number + "").replace(/[^0-9+\-Ee.]/g, "");
    var n = !isFinite(+number) ? 0 : +number;
    var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
    var sep = typeof thousandsSep === "undefined" ? "," : thousandsSep;
    var dec = typeof decPoint === "undefined" ? "." : decPoint;
    var s = "";
    var toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return "" + (Math.round(n * k) / k).toFixed(prec);
    };
    s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || "").length < prec) {
      s[1] = s[1] || "";
      s[1] += new Array(prec - s[1].length + 1).join("0");
    }
    return s.join(dec);
  },
  timetoSecond: function (time) {
    var actualTime = time.split(":");
    var totalSeconds;
    if (actualTime.length > 2) {
      totalSeconds = parseFloat(actualTime[0]) * 60 * 60 + parseFloat(actualTime[1]) * 60 + parseFloat(actualTime[2]);
    } else {
      totalSeconds = parseFloat(actualTime[0]) * 60 + parseFloat(actualTime[1]);
    }
    return totalSeconds;
  },
  kmtometer: function (jarak) {
    var meter;
    meter = parseFloat(jarak) * 1000;
    return meter;
  },
  unescapeHtml: function (unsafe) {
    return unsafe
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");
  },
  teks_headline: function (str, length, ending) {
    if (length == null) {
      length = 100;
    }
    if (ending == null) {
      ending = "...";
    }
    if (str.length > length) {
      return str.substring(0, length - ending.length) + ending;
    } else {
      return str;
    }
  },
  clean_tag: function (input) {
    input = this.unescapeHtml(input);
    return input.replace(/(<([^>]+)>)/gi, "");
  },
  number_format: function (number, decimals, decPoint, thousandsSep) {
    number = (number + "").replace(/[^0-9+\-Ee.]/g, "");
    var n = !isFinite(+number) ? 0 : +number;
    var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
    var sep = typeof thousandsSep === "undefined" ? "," : thousandsSep;
    var dec = typeof decPoint === "undefined" ? "." : decPoint;
    var s = "";
    var toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return "" + (Math.round(n * k) / k).toFixed(prec);
    };
    s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || "").length < prec) {
      s[1] = s[1] || "";
      s[1] += new Array(prec - s[1].length + 1).join("0");
    }
    return s.join(dec);
  },
  setMultipleScript: function (arr, path) {
    var _arr = $.map(arr, function (scr) {
      return this.loadScript(path || "" + scr);
    });
    _arr.push(
      $.Deferred(function (deferred) {
        $(deferred.resolve);
      })
    );
    return $.when.apply($, _arr);
  },
  setScript: function (url, callback) {
    this.loadScript(url, callback);
  },
  setCSS: function (url, string1 = null, string2 = null) {
    var head = document.getElementsByTagName("HEAD")[0];
    var link;
    if (typeof url == "object") {
      $.each(url, function (index, value) {
        link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = value;
        head.appendChild(link);
      });
    } else {
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.type = "text/css";
      link.href = url;
      head.appendChild(link);
    }
  },
  setEvent: function (param, callback) {
    const eventName = param.event;
    const element = param.element;
    if (eventName == "click") {
      $(element)
        .off()
        .on("click", function () {
          if (typeof callback !== "undefined") {
            callback();
          }
        });
    } else {
      $(element).on(eventName, function () {
        if (typeof callback !== "undefined") {
          callback();
        }
      });
    }
  },
  getSubstring: function (string, char1, char2) {
    return string.slice(string.indexOf(char1) + 1, string.lastIndexOf(char2));
  },
  ajaxRequest: function (paramrequest, callback) {
    loading("Please wait...");
    let param = paramrequest;
    console.log(param);
    $.ajax({
      method: paramrequest.method ? paramrequest.method.toUpperCase() : "POST",
      url: paramrequest.api_url,
      data: paramrequest.data,
    })
      .fail((res) => {
        const response = res.responseJSON;
        if (typeof callback !== "undefined") {
          $(param.element_button).prop("disabled", false);
          $(param.element_button).html(param.button_text);
          callback(response);
        } else {
          $(param.element_button).prop("disabled", false);
          $(param.element_button).html(param.button_text);
          $(param.element_target).addClass("error");
          if (typeof alert !== "undefined") {
            alert(response.message);
          } else {
            $(param.element_target).html(response.message);
          }
        }
        closeLoading();
      })
      .done((res, textStatus, jqXHR) => {
        if (typeof callback !== "undefined") {
          $(param.element_button).prop("disabled", false);
          $(param.element_button).html(param.button_text);
          callback(res);
        } else {
          $(param.element_target).html(res.message);
          $(param.element_button).prop("disabled", false);
          $(param.element_button).html(param.button_text);
          $(param.element_target).addClass("error");
        }
        if (param.table) {
          app.updateTable(param.table);
          app.closeModal();
          alert(res.message);
        }
        closeLoading();
      });
  },
  form: function (param, callback) {
    var form_element = param.form_element;
    let resetform = param.resetform;
    console.log(`isEdit A : ${param.isEdit}`);
    passedParam = param;
    console.log(passedParam);
    $(form_element).validate({
      rules: param.rules,
      messages: param.messages,
      errorElement: "em",
      errorPlacement: function (error, element) {
        error.addClass("help-block error");
        if (element.prop("type") === "checkbox") {
          error.insertAfter(element.parent("label"));
        } else if (element.prop("type") === "password") {
          error.insertAfter(element.parent(".password"));
          $(error).parent().find(".input-group.password").addClass("mb-1");
        } else {
          error.insertAfter(element);
          $(error).parent().find("input").addClass("mb-1");
        }
      },
      highlight: function (element, errorClass, validClass) {
        $(element).addClass("is-danger");
      },
      unhighlight: function (element, errorClass, validClass) {
        $(element).removeClass("is-danger");
      },
      submitHandler: function (form) {
        console.log(passedParam);
        param.method = passedParam.method;
        param.isEdit = passedParam.isEdit;
        $(param.element_button).prop("disabled", true);
        $(param.element_button).html("Please wait..");
        $(param.element_target).html("");
        $(param.element_target).removeClass("error");

        let dataSubmit = $(form).serialize();
        if (!param.isEdit) {
          dataSubmit = dataSubmit.replace(/id=[^&]*&?/, "");
        }
        // ajax request
        param.api_url + "?_=" + new Date().getTime();
        param.data = dataSubmit;
        app.ajaxRequest(param, callback);
      },
    });
  },
  parseJWT: function (token) {
    let base64Url = token.split(".")[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    let jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  },
  toDay: function () {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    const formattedToday = `${year}-${month}-${day}`;
    return formattedToday;
  },
  toDayDateTime: function () {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  },
  indonesianGreeting: function () {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    let greeting = "";

    if (currentHour >= 5 && currentHour <= 10) {
      greeting = "Selamat pagi";
    } else if (currentHour >= 11 && currentHour <= 15) {
      greeting = "Selamat siang";
    } else if (currentHour >= 15 && currentHour <= 18) {
      greeting = "Selamat sore";
    } else {
      greeting = "Selamat malam";
    }
    return greeting;
  },
  updateTable: function (element, payload) {
    var table = $(element).DataTable();
    table.settings()[0].ajax.data = function (d) {
      $.extend(d, payload);
    };
    table.ajax.reload();
  },
  splitDate: function (selectedDate) {
    let output = {
      startDate: "",
      endDate: "",
    };
    if (selectedDate && selectedDate != "") {
      selectedDate = selectedDate.replace(" - ", " ");
      selectedDate = selectedDate.replaceAll("/", "-");
      let splitDate = selectedDate.split(" ");
      let startDate = app.changeDateFormat(splitDate[0]);
      let endDate = app.changeDateFormat(splitDate[1]);
      output = {
        startDate: startDate,
        endDate: endDate,
      };
    }
    return output;
  },
  updateDataTable: function (element) {
    console.log(element);
    $(element).DataTable().ajax.reload();
  },
  modalDelete: function (param) {
    console.log(param);
    Swal.fire({
      title: `${param.title}`,
      html: "Hapus <b>" + param.data.main_label + "</b> ?<br><i>Seluruh data yang terkait akan terhapus</i>",
      icon: "warning",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      showCloseButton: true,
      showCancelButton: true,
      reverseButtons: true,
      customClass: {
        title: "fs-4 fw-semibold text-dark",
        icon: "text-danger",
        confirmButton: "btn btn-danger py-2 px-3",
        cancelButton: "btn btn-line py-2 px-3",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log(param);
        let idname = param.idname;

        let dataDelete = {
          [idname]: param.data ? param.data[idname] : undefined,
        };
        console.log(dataDelete);
        let deleteData = await app
          .deleteData(`${param.url}`, {
            data: dataDelete,
          })
          .then((res) => {
            return res;
          });

        if (deleteData.status) {
          app.updateDataTable(param.table);
        }
      }
    });
  },
  saveNotif: function (param) {
    let result = this.postData(`${base_url_api}/genera/save_notif`, {
      data: param,
    });
    return result;
  },
  checkFileExtension: function (url) {
    var imageExtensions = ["jpg", "jpeg", "png", "gif"];
    var videoExtensions = ["mp4", "avi", "mov", "wmv"];
    var pdfextension = ["pdf"];
    var extension = url.split(".").pop().toLowerCase();
    if (imageExtensions.includes(extension)) {
      return "image";
    } else if (videoExtensions.includes(extension)) {
      return "video";
    } else if (pdfextension.includes(extension)) {
      return "pdf";
    } else {
      return "unknown";
    }
  },
  shortFilename: function (filename) {
    var extractedFileName;
    if (filename) {
      var parts = filename.split("_");
      extractedFileName = parts[parts.length - 1];
    } else {
      extractedFileName = "";
    }
    return extractedFileName;
  },
  resetForm: function (element_form) {
    $(element_form + " input[type=text]").val("");
    $(element_form + " input[type=email]").val("");
    $(element_form + " input[type=number]").val("");
    $(element_form + " input[type=password]").val("");
    $(element_form + " select").val("");
    $(element_form + " textarea").val("");
    $(element_form + " .prosesdata").removeClass("error");
    $(element_form + " .prosesdata").html("");
    $(element_form)[0].reset();
  },
  setStringUpFirst: function (str) {
    return (str + "").replace(/^(.)|\s+(.)/g, function ($1) {
      return $1.toUpperCase();
    });
  },
  socketEmitter: function (param) {
    let socketEvent = "event";
    if (param.socketEvent) {
      socketEvent = param.socketEvent;
    }
    if (typeof socket !== "undefined" && token) {
      var dataUser = app.dataUser();
      socket.emit(socketEvent, {
        iduser: dataUser.data.id,
        activity_name: param.activity_name,
        menu: param.menu,
        title: param.title,
        data: param.data,
        token: token,
      });
    }
  },
  showToast: function (limit = 1, title, wrapper, param) {
    let toastElement = `<div class="toast notifAlert" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <strong class="mr-auto toast_title">${title}</strong>
        <small class="text-muted toast_date"></small>
        <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="toast-body toast_content">${param.subject}<br>${param.from}</div>
    </div>`;
    let checkElement = $(`${wrapper} .notifAlert`).length;
    if (checkElement < limit) {
      $(wrapper).append(toastElement);
      $(".notifAlert").toast("show");
    }
  },
  /*
  -------------------------
  // NOTE
  Mobile function
  -------------------------
  */
  alert: function (title, message) {
    alert({
      title: title,
      message: message,
      buttons: [
        {
          label: "OK",
          onclick: function () {
            closeAlert();
          },
        },
      ],
    });
  },
  getMapLocation: function (geolocation) {
    return new Promise((resolve, reject) => {
      if (typeof geolocation == "undefined") {
        geolocation = navigator.geolocation;
      }
      if (typeof geolocation !== "undefined") {
        geolocation.getCurrentPosition(
          function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const result = {
              status: true,
              latitude: latitude,
              longitude: longitude,
            };
            resolve(result);
          },
          function (error) {
            const result = {
              status: false,
              error: `${error.code}, ${error.message}`,
            };
            reject(result);
          }
        );
      } else {
        reject({ status: false, error: "Invalid location" });
      }
    });
  },
  isMobileBrowser: function () {
    const mobileRegex = /android|iphone|ipod|ipad|windows phone/i;
    return mobileRegex.test(navigator.userAgent);
  },
  getCredential: function () {
    let dataUser = app.dataUser();
    return new Promise((resolve, reject) => {
      app
        .postData(`${base_url_api}/profile/getcredential`, {
          data: {
            id_user: dataUser.data.id,
            id_employee: dataUser.data.id_employee,
          },
        })
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  arrayBufferToBase64: function (buffer) {
    const binaryArray = new Uint8Array(buffer);
    const binaryString = Array.from(binaryArray)
      .map((byte) => String.fromCharCode(byte))
      .join("");
    return btoa(binaryString);
  },
  enableLog: function (enable = false) {
    const originalConsoleLog = console.log;
    if (enable) {
      console.log = originalConsoleLog;
    } else {
      console.log = function () {};
    }
  },
  genUUID: function () {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16));
  },
};
