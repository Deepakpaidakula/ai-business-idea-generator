const { Server } = require("socket.io");

module.exports = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {
    console.log(" New client connected");

    socket.on("sendMessage", (msg) => {
      io.emit("receiveMessage", msg);
    });

    socket.on("disconnect", () => {
      console.log(" Client disconnected");
    });
  });
};
