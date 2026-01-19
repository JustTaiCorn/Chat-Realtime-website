import http from "http";
import express from "express";
import { Server } from "socket.io";
import { socketAuthMiddleware } from "../middleware/socket.middleware.js";
import {getConversationForSocketIo} from "../controllers/conversation.controller.js";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  },
});
io.use(socketAuthMiddleware);
const onlineUsers = new Set();
io.on("connection", async (socket) => {
  const user = socket.user;
  console.log(socket.id);
  onlineUsers.add(user._id);
  io.emit("onlineUsers", Array.from(onlineUsers));
  const conversationIds = await getConversationForSocketIo(user._id);
  conversationIds.forEach((conversationId) => {
    socket.join(conversationId);
  });
  socket.on("join-conversation", (conversationId) => {
    socket.join(conversationId);
  });
  socket.join(user._id.toString());
  socket.on("disconnect", (data) => {
    console.log("socket disconect", socket.id);
    onlineUsers.delete(user._id);
    io.emit("onlineUsers", Array.from(onlineUsers));
  });
});

export { io, app, server };
