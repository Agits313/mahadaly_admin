const app_root = ".app";
const app_root_content = ".app_layout_content";
const app_login = ".app_login";
let isMobile = app.isMobileBrowser();

app.enableLog(true);

setPage = () => {
  var screenWidth = $(window).width();
  console.log("width: " + screenWidth);
  menu = app.setMenu();
  app.setDefaultTitle(`Perpustakaan - ${menu}`);
  switch (menu) {
    case "login":
    case "register":
      app.setContent({ menu: menu }, function () {
        $(".appLog").addClass("d-none");
      });
      break;
    default:
      console.log("Default");
      app.setContent({ menu: menu }, function () {
        $("body").addClass("bg-light");
        $(".appLog").removeClass("d-none");
      });
      break;
  }
};

$(function () {
  setPage();
});

$(window).on("popstate", function (e) {
  var state = e.originalEvent.state;
  if (state !== null) {
    menu = state.menu;
    console.log("popstate: " + menu);
    setPage();
  }
});
