/* -------------------------------------------------------------------------- */
/*         Web Socket Starter, Project starter - Thejagat, andibastian        */
/* -------------------------------------------------------------------------- */

const socketIO = require("socket.io");
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
let paramsocket = {
  transports: ["websocket", "polling"],
  path: "/socket.io",
};
let io;
module.exports = {
  Connect: (server) => {
    io = new Server(server, {
      path: "/socket.io",
      ackTimeout: 30000,
    });
    const socketEvent = require("../socket/event");
    const { instrument } = require("@socket.io/admin-ui");
    instrument(io, { auth: false });
    io.on("connection", (socket) => {
      console.log(`Client connected: ${socket.id}`);
      socketEvent(socket, io);
    });
  },
  Emit: (event, message) => {
    io.emit(event, message);
  },
};
