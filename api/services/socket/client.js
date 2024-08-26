/* -------------------------------------------------------------------------- */
/*           Socket client, project starter - Thejagat, andibastian           */
/* -------------------------------------------------------------------------- */

const io = require("socket.io-client");
let paramsocket = {
  transports: ["websocket", "polling"],
  path: "/socket.io",
};
// ----------------------------------------------
const socket = io("http://localhost:3000", paramsocket);
socket.on("connect", () => {
  console.log(`Socket connected from node ${socket.id}`);
});
socket.on("error", (error) => {
  console.log("Socket error:", error);
});
socket.on("disconnect", (reason) => {
  console.log("Socket disconnected. Reason:", reason);
});

module.exports = {
  socket,
  io,
};
