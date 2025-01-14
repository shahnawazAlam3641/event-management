const Event = require("../models/Event");

const setupSocketHandlers = (io) => {
  // io.on("connection", (socket) => {
  //   console.log("A user connected");

  //   socket.on("join-event", ({ eventId, userId }) => {
  //     socket.join(eventId);

  //     // Fetch the event and update attendees
  //     Event.findById(eventId).then((event) => {
  //       if (!event.attendees.some((attendee) => attendee.user.toString() === userId)) {
  //         event.attendees.push({ user: userId });
  //         event.save();
  //       }
  //     });

  //     // Emit active users and user count
  //     const activeUsers = Array.from(io.sockets.adapter.rooms.get(eventId) || []);
  //     io.to(eventId).emit("user-joined", activeUsers.length);
  //     io.to(eventId).emit("active-users", activeUsers);
  //   });

  //   socket.on("chat-message", (message) => {
  //     io.to(message.eventId).emit("chat-message", message);
  //   });

  //   socket.on("leave-event", ({ eventId, userId }) => {
  //     socket.leave(eventId);

  //     // Emit updated user count
  //     const activeUsers = Array.from(io.sockets.adapter.rooms.get(eventId) || []);
  //     io.to(eventId).emit("user-joined", activeUsers.length);
  //     io.to(eventId).emit("active-users", activeUsers);
  //   });
  // });

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
