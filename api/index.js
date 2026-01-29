// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");

// const app = express();
// app.use(cors());

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log("✅ User connected:", socket.id);

//   socket.on("send_message", (text) => {
//     io.emit("receive_message", {
//       text,
//       senderId: socket.id,
//     });
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ User disconnected:", socket.id);
//   });
// });

// server.listen(3001, () => {
//   console.log("🚀 Server running at http://localhost:3001");
// });
// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");

// const app = express();
// app.use(cors());

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log("✅ Connected:", socket.id);

//   // join room (default: global)
//   socket.on("join_room", (room) => {
//     socket.join(room);
//     console.log(`👤 ${socket.id} joined room: ${room}`);
//   });

//   // send message (global / room)
//   socket.on("send_message", ({ text, room }) => {
//     const payload = {
//       text,
//       senderId: socket.id,
//       room,
//     };

//     if (!room || room === "global") {
//       io.emit("receive_message", payload);
//     } else {
//       io.to(room).emit("receive_message", payload);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ Disconnected:", socket.id);
//   });
// });

// server.listen(3001, () => {
//   console.log("🚀 Server running at http://localhost:3001");
// });

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://hush-client.vercel.app/"],
  },
});

/**
 * DATA DI MEMORI
 * userName -> socketId
 * socketId -> userName
 */
const userToSocket = {};
const socketToUser = {};

io.on("connection", (socket) => {
  console.log("🔌 Connected:", socket.id);

  // REGISTER (WAJIB SETIAP CONNECT)
  socket.on("register", ({ userId, userName }) => {
    userToSocket[userName] = socket.id;
    socketToUser[socket.id] = userName;

    console.log("👤 ONLINE USERS:", userToSocket);
  });

  // PRIVATE CHAT (USERNAME BASED)
  socket.on("private_message", ({ toUserName, text }) => {
    const fromUserName = socketToUser[socket.id];
    const targetSocketId = userToSocket[toUserName];

    if (!targetSocketId) return;

    io.to(targetSocketId).emit("receive_private_message", {
      text,
      fromUserName,
    });
  });

  socket.on("disconnect", () => {
    const userName = socketToUser[socket.id];
    if (userName) {
      delete userToSocket[userName];
      delete socketToUser[socket.id];
      console.log("❌ Disconnected:", userName);
    }
  });
});

server.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3001");
});
