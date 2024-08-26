/* -------------------------------------------------------------------------- */
/*        Socket event client, project starter - Thejagat, andibastian        */
/* -------------------------------------------------------------------------- */

module.exports = function (socket, io) {
  socket.on("connect", () => {
    console.log(`Socket connected from web ${socket.id}`);
  });
  socket.on("error", (error) => {
    console.log("Socket error:", error);
  });
  socket.on("push", (message) => {
    console.log(`Received 'push' to 'push-messages' from client ${socket.id}, send as 'set-push-event'`);
    io.emit("set-push-event", message);
  });
  socket.on("event", async (message) => {
    message.id_connection = socket.id;
    const data = JSON.stringify({ data: message });
  });
  socket.on("message-received", (message) => {
    console.log(message);
  });
};
