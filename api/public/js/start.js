const hostname = `${window.location.protocol}//${window.location.hostname}`;
const linkRabbit = `${hostname}:4400`;
const linkLogs = `${hostname}:4500`;

$(function () {
  $(".linkRabbit").attr("href", linkRabbit);
  $(".linkLogs").attr("href", linkLogs);
});
