$("a").on("click", function (e) {
  e.preventDefault();
});

$(".app_menu")
  .off()
  .on("click", function (e) {
    $(".menu-item").removeClass("active");
    $(this).parent(".menu-item").addClass("active");
    let isInProgress = $(this).hasClass("isInProgress");
    if (isInProgress) {
      alert("In Progress");
      return false;
    }
    let isModal = $(this).hasClass("isModal");
    let isMenu = $(this).hasClass("isMenu");
    let title = $(this).data("title");

    if (!title) {
      title = $(this).text();
      title = title.trim();
    }

    let isFile = $(this).hasClass("isFile");
    let menu = $(this).data("menu");
    let hasForm = $(this).data("hasform");
    let setHeight = $(this).data("height");
    // console.log(isFile);
    if (isModal) {
      let paramModal = {
        modal: $(this).data("modal"),
        hasForm: hasForm,
        title: title,
        setHeight: setHeight,
      };
      app.setModal(paramModal);
    }
    if (isMenu) {
      if (menu !== "logout") {
        app.setMenu(menu);
        switch (menu) {
          case "login":
          case "register":
            app.setContent({ menu, title, event: e }, function () {
              $("body").removeClass("padding has-header has-footer");
              $(".app").removeClass("container py-3 px-3");
              $("#contentLayout").removeClass("app_layout_content");
            });

            break;
          default:
            app.setContent({ menu, title, event: e }, function () {
              $("body").addClass("bg-light");
            });
            break;
        }
      } else {
        function logout() {
          alert({
            title: "Logout",
            message: "Keluar dari aplikasi ?",
            buttons: [
              {
                label: "Ya, Keluar",
                onclick: function () {
                  app.logout();
                },
              },
              {
                label: "Batal",
                onclick: function () {
                  closeAlert();
                },
              },
            ],
          });
        }
        logout();
      }
    }

    app.socketEmitter({
      socketEvent: "event",
      activity_name: "click",
      menu: menu,
      title: title,
    });
    e.preventDefault();
  });
