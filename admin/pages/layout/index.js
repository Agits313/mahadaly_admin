if (token) {
  (async () => {
    const dataUser = app.dataUser();
    const getMenu = await app.postData(`${base_url_api}/menu/list`, {
      data: {
        id_level: dataUser.data.id_level,
      },
    });

    let content = "",
      paramHasSubmenu = "";
    let n = 0;
    let classMenu = "app_menu isMenu";
    for (const key of getMenu.data) {
      console.log(key);
      const { id, label, link, icon, submenuList } = key;
      n++;
      isactive = "";
      if (menu == link) {
        isactive = "active";
      }
      let isMaintenance = "";
      if (link == "#") {
        isMaintenance = "isInProgress";
      }
      if (submenuList.length > 0) {
        paramHasSubmenu = `data-toggle="collapse" data-target="#menu-${id}" aria-expanded="true" aria-controls="menu-${id}"`;
        content += `<li class="menu-item ${isactive} d-flex justify-content-center align-items-center flex-column">
          <a href="#" class="menu-link" ${paramHasSubmenu}>
            <div>${icon}<span class="menu-label"> ${label}</span></div>
            <img src="/img/custom/icon/chevron-down.svg" class="menu-arrow" />
          </a>`;

        /* -------------------------------------------------------------------------- */
        /*                                Submenu List                                */
        /* -------------------------------------------------------------------------- */
        content += `<ul class="menu collapse" data-parent="#main-menu" id="menu-${id}">`;
        let classSubMenu = "app_menu isMenu";
        for (const valsub of submenuList) {
          content += `<li class="menu-item">
            <a href="#" class="menu-link ${classSubMenu}" data-menu="${valsub.link}">
              <div>${valsub.icon} <span class="menu-label">${valsub.label}</span></div>
            </a>
          </li>`;
        }
        content += `</ul></li>`;
      } else {
        content += `<li class="menu-item ${isactive} d-flex justify-content-center">
          <a href="#" class="menu-link ${classMenu} ${isMaintenance}" data-menu="${link}">
            <div>${icon}<span class="menu-label"> ${label}</span></div>
          </a>
        </li>`;
      }
    }
    $(".menuList").html(content);
    app.setScript(`js/app/event.js`);
  })();

  var screenHeight = window.innerHeight - 330;
  var miniTableScreenHeight = window.innerHeight - 500;
  var screenHeightCustom = screenHeight + 80;
  const pageLength = 25;
  var defaultOptionTable = {
    processing: true,
    serverSide: true,
    pageLength: pageLength,
    scrollY: screenHeight + "px",
    scrollX: true,
    info: true,
    language: {
      search: "",
      searchPlaceholder: "Pencarian...",
      processing: `<img style='width:100px; height:100px;' src='img/custom/load2.gif' class="filter-darkblue" /> <div class="text-dark fw-semibold">Load...</div>`,
      paginate: {
        previous: '<i class="fas fa-chevron-left fz-12"></i>',
        next: '<i class="fas fa-chevron-right fz-12"></i>',
      },
      info: "&nbsp;&nbsp;dari total: <span class='text-blue fw-semibold ps-1'>_TOTAL_</span>",
      lengthMenu: "<span class='pe-2'>Menampilkan</span>_MENU_",
    },
    dom: '<"custom-dt mb-3"<"button-wrap row row-cols-1 row-cols-md-2 row-cols-xl-4 row-cols-xxxxl-5 g-3"<"col f-wrap"f>>r>t<"d-lg-flex justify-content-between align-items-start mt-3 prop-bottom"<"d-flex align-items-center"li>p>',
    drawCallback: function (settings) {
      var api = this.api();
      $(api.table().container()).find(".dataTables_length select").addClass("form-select");
      var empty_note = $(api.table().container()).find(".dataTables_empty").html();
      var empty_img = '<img src="img/custom/data-empty.svg" />';
      if ($(api.table().container()).find("td").hasClass("dataTables_empty")) {
        $(api.table().container()).find("table").addClass("h-100");
      } else {
        $(api.table().container()).find("table").removeClass("h-100");
      }
      $(api.table().container())
        .find(".dataTables_empty")
        .html(`<div class="d-flex align-items-center justify-content-center flex-column">${empty_img}<span class="fw-semibold mt-2">${empty_note}</span></div>`);
    },
    preDrawCallback: function (settings) {
      var api = this.api();
      $(api.table().container()).find(".dataTables_processing").removeClass("card");
    },
    createdRow: function (row, data, index) {
      var pageInfo = tabledata.page.info();
      var pageStart = pageInfo.start;
      var currentIndex = pageStart + index + 1;
      $("td:eq(0)", row).html(currentIndex);
    },
    initComplete: function (settings, json) {},
  };
  var defaultOptionTable2 = {
    processing: true,
    serverSide: true,
    pageLength: pageLength,
    scrollY: screenHeight + 50 + "px",
    scrollX: true,
    info: true,
    language: {
      search: "",
      searchPlaceholder: "Pencarian...",
      processing: `<img style='width:100px; height:100px;' src='img/custom/load2.gif' class="filter-darkblue" /> <div class="text-dark fw-semibold">Load...</div>`,
      paginate: {
        previous: '<i class="fas fa-chevron-left fz-12"></i>',
        next: '<i class="fas fa-chevron-right fz-12"></i>',
      },
      info: "&nbsp;&nbsp;dari total: <span class='text-blue fw-semibold ps-1'>_TOTAL_</span>",
      lengthMenu: "<span class='pe-2'>Menampilkan</span>_MENU_",
    },
    dom: '<"custom-dt mb-3"<"button-wrap row row-cols-1 row-cols-md-2 row-cols-xl-4 row-cols-xxxxl-5 g-3"<"col f-wrap"f>>r>t<"d-lg-flex justify-content-between align-items-start mt-3 prop-bottom"<"d-flex align-items-center"li>p>',
    drawCallback: function (settings) {
      var api = this.api();
      $(api.table().container()).find(".dataTables_length select").addClass("form-select");
      var empty_note = $(api.table().container()).find(".dataTables_empty").html();
      var empty_img = '<img src="img/custom/data-empty.svg" />';
      if ($(api.table().container()).find("td").hasClass("dataTables_empty")) {
        $(api.table().container()).find("table").addClass("h-100");
      } else {
        $(api.table().container()).find("table").removeClass("h-100");
      }
      $(api.table().container())
        .find(".dataTables_empty")
        .html(`<div class="d-flex align-items-center justify-content-center flex-column">${empty_img}<span class="fw-semibold mt-2">${empty_note}</span></div>`);
    },
    preDrawCallback: function (settings) {
      var api = this.api();
      $(api.table().container()).find(".dataTables_processing").removeClass("card");
    },
    createdRow: function (row, data, index) {
      var pageInfo = tabledata.page.info();
      var pageStart = pageInfo.start;
      var currentIndex = pageStart + index + 1;
      $("td:eq(0)", row).html(currentIndex);
    },
    initComplete: function (settings, json) {},
  };
  var defaultOptionState = {
    processing: true,
    serverSide: true,
    stateSave: true,
    pageLength: pageLength,
    scrollY: screenHeight + 50 + "px",
    scrollX: true,
    searchDelay: 2000,
    info: true,
    language: {
      search: "",
      searchPlaceholder: "Pencarian...",
      processing: `<img style='width:100px; height:100px;' src='img/custom/load2.gif' class="filter-darkblue" /> <div class="text-dark fw-semibold">Load...</div>`,
      paginate: {
        previous: '<i class="fas fa-chevron-left fz-12"></i>',
        next: '<i class="fas fa-chevron-right fz-12"></i>',
      },
      info: "&nbsp;&nbsp;dari total: <span class='text-blue fw-semibold ps-1'>_TOTAL_</span>",
      lengthMenu: "<span class='pe-2'>Menampilkan</span>_MENU_",
    },
    dom: '<"custom-dt mb-3"<"button-wrap row row-cols-1 row-cols-md-2 row-cols-xl-4 row-cols-xxxxl-5 g-3"<"col f-wrap"f>>r>t<"d-lg-flex justify-content-between align-items-start mt-3 prop-bottom"<"d-flex align-items-center"li>p>',
    drawCallback: function (settings) {
      var api = this.api();
      $(api.table().container()).find(".dataTables_length select").addClass("form-select");
      var empty_note = $(api.table().container()).find(".dataTables_empty").html();
      var empty_img = '<img src="img/custom/data-empty.svg" />';
      if ($(api.table().container()).find("td").hasClass("dataTables_empty")) {
        $(api.table().container()).find("table").addClass("h-100");
      } else {
        $(api.table().container()).find("table").removeClass("h-100");
      }
      $(api.table().container())
        .find(".dataTables_empty")
        .html(`<div class="d-flex align-items-center justify-content-center flex-column">${empty_img}<span class="fw-semibold mt-2">${empty_note}</span></div>`);
    },
    preDrawCallback: function (settings) {
      var api = this.api();
      $(api.table().container()).find(".dataTables_processing").removeClass("card");
    },
    stateSaveCallback: function (settings, data) {
      data.menu = menu;
      console.log(`stateSaveCallback`, settings);
      const tableId = $(this).attr("id");
      const nameState = `StateDataTable`;
      let getState = storage.getItem(nameState);
      if (getState) {
        getState = JSON.parse(getState);
        console.log("Storage Exists", getState);
        getState.start = data.start;
        storage.setItem(nameState, JSON.stringify(getState));
      } else {
        console.log("No Storage");
        storage.setItem(nameState, JSON.stringify(data));
      }
    },
    stateLoadCallback: function (settings) {
      const getState = JSON.parse(storage.getItem("StateDataTable"));
      console.log(`stateValue`, getState);
      return getState;
    },
    createdRow: function (row, data, index) {
      var pageInfo = tabledata.page.info();
      var pageStart = pageInfo.start;
      var currentIndex = pageStart + index + 1;
      $("td:eq(0)", row).html(currentIndex);
    },
    initComplete: function (settings, data) {
      const nameState = `StateDataTable`;
      let getState = storage.getItem(nameState);
      if (getState) {
        console.log("Storage Exists INIT");
        getState = JSON.parse(getState);
        console.log(`getState INIT`, getState);
        // data.start = getState.start;
        // storage.setItem(nameState, JSON.stringify(data));
        // console.log(settings);
      }
    },
  };
  var defaultOptionTableStatic = {
    processing: false,
    serverSide: false,
    pageLength: pageLength,
    scrollY: screenHeight - 150 + "px",
    scrollX: true,
    info: true,
    searching: false,
    info: true,
    language: {
      processing: `<img style='width:100px; height:100px;' src='img/custom/load2.gif' class="filter-darkblue" /> <div class="text-dark fw-semibold">Load...</div>`,
      paginate: {
        previous: '<i class="fas fa-chevron-left fz-12"></i>',
        next: '<i class="fas fa-chevron-right fz-12"></i>',
      },
      info: "&nbsp;&nbsp;dari total: <span class='text-blue fw-semibold ps-1'>_TOTAL_</span>",
      lengthMenu: "<span class='pe-2'>Menampilkan</span>_MENU_",
    },
    dom: '<"custom-dt mb-3"<"button-wrap row row-cols-1 row-cols-md-2 row-cols-xl-4 row-cols-xxxxl-5 g-3"<"col f-wrap"f>>r>t<"d-lg-flex justify-content-between align-items-start mt-3 prop-bottom"<"d-flex align-items-center"li>p>',
    drawCallback: function (settings) {
      var api = this.api();
      var empty_note = $(api.table().container()).find(".dataTables_empty").html();
      var empty_img = '<img src="img/custom/data-empty.svg" />';
      if ($(api.table().container()).find("td").hasClass("dataTables_empty")) {
        $(api.table().container()).find("table").addClass("h-100");
      } else {
        $(api.table().container()).find("table").removeClass("h-100");
      }
      $(api.table().container())
        .find(".dataTables_empty")
        .html(`<div class="d-flex align-items-center justify-content-center flex-column">${empty_img}<span class="fw-semibold mt-2">${empty_note}</span></div>`);
    },
    preDrawCallback: function (settings) {
      var api = this.api();
      $(api.table().container()).find(".dataTables_processing").removeClass("card");
    },
    createdRow: function (row, data, index) {
      var pageInfo = tabledata.page.info();
      var pageStart = pageInfo.start;
      var currentIndex = pageStart + index + 1;
      $("td:eq(0)", row).html(currentIndex);
    },
    initComplete: function (settings, json) {},
  };
  var OptionTableWithPrint = {
    createdRow: function (row, data, index) {
      $("td:eq(0)", row).html(index + 1);
    },
    processing: true,
    serverSide: true,
    pageLength: pageLength,
    scrollY: screenHeight + "px",
    scrollX: true,
    info: true,
    language: {
      search: "",
      searchPlaceholder: "Pencarian...",
      processing: `<img style='width:100px; height:100px;' src='img/custom/load2.gif' class="filter-darkblue" /> <div class="text-dark fw-semibold">Load...</div>`,
      paginate: {
        previous: '<i class="fas fa-chevron-left"></i>',
        next: '<i class="fas fa-chevron-right"></i>',
      },
      info: "Jumlah data: <span class='text-blue fw-semibold ps-1'>_TOTAL_</span>",
      lengthMenu: "<span class='pe-2'>Menampilkan</span>_MENU_",
    },
    dom: '<"d-flex justify-content-between custom-dt mb-2"<"w-100"<"col f-wrap"f>>r>t<"d-md-flex justify-content-between align-items-start mt-3 prop-bottom"<"d-flex align-items-center"li><"mt-3 mt-md-0"p>>',
    buttons: [
      {
        extend: "print",
        text: "Print",
        exportOptions: {
          columns: ":visible",
        },
      },
      {
        extend: "pdfHtml5",
        text: "PDF",
        exportOptions: {
          columns: ":visible",
        },
      },
    ],
    drawCallback: function (settings) {
      var api = this.api();
      $(api.table().container()).find(".dataTables_length select").addClass("form-select");
      var empty_note = $(api.table().container()).find(".dataTables_empty").html();
      var empty_img = '<img src="img/custom/data-empty.svg" />';
      if ($(api.table().container()).find("td").hasClass("dataTables_empty")) {
        $(api.table().container()).find("table").addClass("h-100");
      } else {
        $(api.table().container()).find("table").removeClass("h-100");
      }
      $(api.table().container())
        .find(".dataTables_empty")
        .html(`<div class="d-flex align-items-center justify-content-center flex-column">${empty_img}<span class="fw-semibold mt-2">${empty_note}</span></div>`);
    },
    preDrawCallback: function (settings) {
      var api = this.api();
      $(api.table().container()).find(".dataTables_processing").removeClass("card");
    },
    initComplete: function (settings, json) {},
  };
  var minimOptionTableMenuRoles = {
    processing: true,
    serverSide: true,
    scrollY: miniTableScreenHeight + "px",
    scrollX: false,
    responsive: false,
    info: false,
    paginate: false,
    filter: false,
    language: {
      processing: `<img style='width:100px; height:100px;' src='img/custom/load2.gif' class="filter-darkblue" /> <div class="text-dark fw-semibold">Load...</div>`,
    },
    preDrawCallback: function (settings) {
      var api = this.api();
      $(api.table().container()).find(".dataTables_processing").removeClass("card");
    },
  };
}
