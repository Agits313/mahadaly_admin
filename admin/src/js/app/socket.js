if (token) {
  var dataUser = app.dataUser();
  let paramsocket = {
    transports: ["websocket", "polling"],
    path: "/socket.io",
  };
  window.socket = io(base_url_socket, paramsocket);
  socket.on("connect", () => {
    console.log("Socket Connected (web) " + socket.id);
  });
  socket.on("error", (error) => {
    console.log("Socket error:", error);
  });
  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected. Reason:", reason);
  });

  // from window.menu
  socket.on("set-push-event", (message) => {
    console.log("Receive event");
  });

  socket.on("push-messages", (message) => {
    console.log(message);
    let messageType = message.detail.type;

    if (messageType == "page") {
      let messageMenu = message.detail.menu;
      if (menu == messageMenu) {
        tabledata.ajax.reload();
      }
    }
  });
}
