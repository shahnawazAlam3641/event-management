// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { useSelector } from "react-redux";
// import io from "socket.io-client";

// const socket = io(import.meta.env.VITE_WS_URL);

// const EventPage = () => {
//   const { id: eventId } = useParams();
//   const { user, token } = useSelector((store) => store.auth);
//   const [eventDetails, setEventDetails] = useState(null);
//   const [chatMessages, setChatMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const [userCount, setUserCount] = useState(0);
//   const [onlineUsers, setOnlineUsers] = useState([]);

//   useEffect(() => {
//     // Fetch event details
//     const fetchEvent = async () => {
//       const response = await fetch(
//         `${import.meta.env.VITE_BACKEND_URL}events/${eventId}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         setEventDetails(data.event);
//         setUserCount(data.event.attendees.length);

//         // Join the WebSocket room
//         socket.emit("join-event", { eventId, userId: user?._id });
//       } else {
//         console.error("Failed to fetch event details");
//       }
//     };

//     fetchEvent();

//     return () => {
//       socket.emit("leave-event", { eventId, userId: user?._id });
//     };
//   }, [eventId, token, user]);

//   useEffect(() => {
//     // Listen for incoming messages
//     socket.on("chat-message", (newMessage) => {
//       setChatMessages((prev) => [...prev, newMessage]);
//     });

//     // Listen for active users
//     socket.on("active-users", (users) => {
//       setOnlineUsers(users);
//     });

//     return () => {
//       socket.off("chat-message");
//       socket.off("active-users");
//     };
//   }, []);

//   const handleSendMessage = () => {
//     if (message.trim()) {
//       const chatMessage = {
//         eventId,
//         message,
//         user,
//         timestamp: new Date().toISOString(),
//       };

//       // Emit message to server
//       socket.emit("chat-message", chatMessage);

//       // Optimistically update chat messages
//       // setChatMessages((prev) => [
//       //   ...prev,
//       //   { ...chatMessage, isCurrentUser: true },
//       // ]);

//       setMessage("");
//     }
//   };

//   if (!eventDetails) return <p>Loading event details...</p>;

//   return (
//     <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
//       {/* Event Details */}
//       <div className="col-span-1 bg-gray-100 p-4 rounded-lg">
//         <img
//           src={eventDetails.imageUrl}
//           alt={eventDetails.title}
//           className="w-full h-48 object-cover rounded-lg mb-4"
//         />
//         <h1 className="text-2xl font-bold mb-2">{eventDetails.title}</h1>
//         <p className="text-gray-700">{eventDetails.description}</p>
//         <p className="text-gray-500 mt-2">
//           <strong>Category:</strong> {eventDetails.category}
//         </p>
//         <p className="text-gray-500">
//           <strong>Start Date:</strong>{" "}
//           {new Date(eventDetails.startDate).toLocaleString()}
//         </p>
//         <p className="text-gray-500">
//           <strong>End Date:</strong>{" "}
//           {new Date(eventDetails.endDate).toLocaleString()}
//         </p>
//         <p className="text-gray-500 mt-2">
//           <strong>{userCount}</strong> users have joined this event.
//         </p>
//       </div>

//       {/* Chat Section */}
//       <div className="col-span-2">
//         <h2 className="text-xl font-bold">Event Chat</h2>
//         <p className="text-gray-500 mb-2">
//           Active Users: {onlineUsers.length}{" "}
//           {onlineUsers.map((u) => u?.fullName).join(", ")}
//         </p>
//         <div className="border p-4 h-64 overflow-y-scroll rounded-lg bg-white">
//           {chatMessages.map((msg, index) => (
//             <div
//               key={index}
//               className={`flex ${
//                 msg.user._id === user._id ? "justify-end" : "justify-start"
//               }`}
//             >
//               <div
//                 className={`p-2 rounded-lg max-w-xs ${
//                   msg.user._id === user._id ? "bg-blue-100" : "bg-gray-200"
//                 }`}
//               >
//                 <p className="text-sm font-semibold">
//                   {msg.user._id === user._id ? "You" : msg?.user?.fullName}
//                 </p>
//                 <p className="text-gray-700">{msg?.message}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//         <form onSubmit={(e) => e.preventDefault()} className="mt-4 flex">
//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="Type your message..."
//             className="border rounded-lg p-2 flex-grow"
//           />
//           <button
//             onClick={handleSendMessage}
//             className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
//           >
//             Send
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EventPage;

import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_WS_URL);

const EventPage = () => {
  const { id: eventId } = useParams();
  const { user, token } = useSelector((store) => store.auth);
  const [eventDetails, setEventDetails] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userCount, setUserCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Fetch event details
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}events/${eventId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setEventDetails(data.event);
          setUserCount(data.event.attendees.length);

          // Join the WebSocket room
          socket.emit("join-event", { eventId, userId: user?._id });
        } else {
          console.error("Failed to fetch event details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();

    return () => {
      socket.emit("leave-event", { eventId, userId: user?._id });
    };
  }, [eventId, token, user]);

  useEffect(() => {
    // Listen for incoming messages
    socket.on("chat-message", (newMessage) => {
      setChatMessages((prev) => [...prev, newMessage]);
    });

    // Listen for active users
    socket.on("active-users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("chat-message");
      socket.off("active-users");
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom when chatMessages update
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const chatMessage = {
        eventId,
        message,
        user,
        timestamp: new Date().toISOString(),
      };

      // Emit message to server
      socket.emit("chat-message", chatMessage);

      // Optimistically update chat messages
      // setChatMessages((prev) => [
      //   ...prev,
      //   { ...chatMessage, isCurrentUser: true },
      // ]);

      setMessage("");
    }
  };

  if (loading) {
    return <p>Loading..........</p>;
  }

  if (!eventDetails) return <p>Loading event details...</p>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Event Details */}
      <div className="col-span-1 bg-gray-100 p-4 rounded-lg">
        <img
          src={eventDetails.imageUrl}
          alt={eventDetails.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <h1 className="text-2xl font-bold mb-2">{eventDetails.title}</h1>
        <p className="text-gray-700">{eventDetails.description}</p>
        <p className="text-gray-500 mt-2">
          <strong>Category:</strong> {eventDetails.category}
        </p>
        <p className="text-gray-500">
          <strong>Start Date:</strong>{" "}
          {new Date(eventDetails.startDate).toLocaleString()}
        </p>
        <p className="text-gray-500">
          <strong>End Date:</strong>{" "}
          {new Date(eventDetails.endDate).toLocaleString()}
        </p>
        <p className="text-gray-500 mt-2">
          <strong>{userCount}</strong> users have joined this event.
        </p>
      </div>

      {/* Chat Section */}
      <div className="col-span-2">
        <h2 className="text-xl font-bold">Event Chat</h2>
        <p className="text-gray-500 mb-2">
          Active Users: {onlineUsers.length}{" "}
          {onlineUsers.map((u) => u?.fullName).join(", ")}
        </p>
        <div
          className="border p-4 h-64 overflow-y-scroll rounded-lg bg-white"
          ref={chatContainerRef}
        >
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.user._id === user._id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-2 rounded-lg max-w-xs ${
                  msg.user._id === user._id ? "bg-blue-100" : "bg-gray-200"
                }`}
              >
                <p className="text-sm font-semibold">
                  {msg.user._id === user._id ? "You" : msg?.user?.fullName}
                  <span className="text-xs text-gray-500 ml-2">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </p>
                <p className="text-gray-700">{msg?.message}</p>
              </div>
            </div>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="mt-4 flex"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="border rounded-lg p-2 flex-grow"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventPage;
