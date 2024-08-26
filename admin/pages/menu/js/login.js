$("img#show").click(function () {
  $(this).addClass("d-none").removeClass("d-block");
  $(this).parent().find("img#hide").addClass("d-block").removeClass("d-none");
  $(this).parent().parent().parent().find("input").attr("type", "password");
});
$("img#hide").click(function () {
  $(this).addClass("d-none").removeClass("d-block");
  $(this).parent().find("img#show").addClass("d-block").removeClass("d-none");
  $(this).parent().parent().parent().find("input").attr("type", "text");
});

app.login();
