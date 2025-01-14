const Event = require("../models/Event");

const setupSocketHandlers = (io) => {
  const roomUsers = {};

  io.on("connection", (socket) => {
    socket.on("join-event", ({ eventId, userId }) => {
      if (!roomUsers[eventId]) roomUsers[eventId] = new Set();
      roomUsers[eventId].add(userId);

      socket.join(eventId);
      io.to(eventId).emit("active-users", Array.from(roomUsers[eventId]));
    });

    socket.on("leave-event", ({ eventId, userId }) => {
      if (roomUsers[eventId]) {
        roomUsers[eventId].delete(userId);
        if (roomUsers[eventId].size === 0) delete roomUsers[eventId];
      }

      io.to(eventId).emit("active-users", Array.from(roomUsers[eventId] || []));
      socket.leave(eventId);
    });

    socket.on("chat-message", (message) => {
      io.to(message.eventId).emit("chat-message", message);
    });

    socket.on("disconnect", () => {
      for (const eventId in roomUsers) {
        roomUsers[eventId].delete(socket.userId);
        if (roomUsers[eventId].size === 0) delete roomUsers[eventId];

        io.to(eventId).emit(
          "active-users",
          Array.from(roomUsers[eventId] || [])
        );
      }
    });
  });
};

module.exports = setupSocketHandlers;
