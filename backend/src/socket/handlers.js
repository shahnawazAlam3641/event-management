export const setupSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Join event room
    socket.on("join-event", (eventId) => {
      socket.join(`event:${eventId}`);
    });

    // Leave event room
    socket.on("leave-event", (eventId) => {
      socket.leave(`event:${eventId}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  const broadcastEventUpdate = (event) => {
    io.to(`event:${event._id}`).emit("event-updated", event);
  };

  return {
    broadcastEventUpdate,
  };
};
