// src/sockets/chatSocket.js
import jwt from "jsonwebtoken";
import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";

// Track online users: userId → Set of socketIds
const onlineUsers = new Map();

export const getOnlineUsers = () => onlineUsers;

export const initChatSocket = (io) => {
  io.on("connection", (socket) => {
    // Expect token in handshake auth: { token }
    const { token } = socket.handshake.auth || {};
    if (!token) {
      socket.disconnect(true);
      return;
    }

    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (err) {
      socket.disconnect(true);
      return;
    }

    // Store userId on socket for reference
    socket.userId = userId;
    console.log("Socket connected:", socket.id, "user:", userId);

    // ===== ONLINE STATUS =====
    // Add this socket to the user's set
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

    // Broadcast to all clients that this user is online
    io.emit("user_online", { userId });

    // Send the full list of online users to the newly connected client
    const onlineUserIds = Array.from(onlineUsers.keys());
    socket.emit("online_users_list", onlineUserIds);

    // ===== CHAT ROOMS =====
    socket.on("join_chat", (chatId) => {
      socket.join(String(chatId));
    });

    socket.on("leave_chat", (chatId) => {
      socket.leave(String(chatId));
    });

    // ===== SEND MESSAGE =====
    socket.on("send_message", async (data, ack) => {
      try {
        const { chatId, receiverId, text } = data;
        if (!chatId || !receiverId || !text) {
          if (ack) ack({ status: "error", message: "Missing fields" });
          return;
        }

        const sender = await User.findById(userId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
          if (ack) ack({ status: "error", message: "User not found" });
          return;
        }

        const message = await Message.create({
          chatId,
          senderId: userId,
          receiverId,
          text,
        });

        // Update chat's lastMessage
        await Chat.findByIdAndUpdate(chatId, { lastMessage: text, updatedAt: new Date() });

        // Emit to the chat room
        io.to(String(chatId)).emit("receive_message", {
          _id: message._id,
          chatId,
          senderId: userId,
          receiverId,
          text,
          createdAt: message.createdAt,
        });

        if (ack) ack({ status: "ok", message: "sent", data: message });
      } catch (err) {
        if (ack) ack({ status: "error", message: err.message });
      }
    });

    // ===== EDIT MESSAGE =====
    socket.on("edit_message", async (data, ack) => {
      try {
        const { messageId, text } = data;
        const message = await Message.findById(messageId);
        if (!message) return ack?.({ status: "error", message: "Not found" });
        if (message.senderId.toString() !== userId) return ack?.({ status: "error", message: "Unauthorized" });

        message.text = text;
        message.edited = true;
        await message.save();

        io.to(String(message.chatId)).emit("message_edited", { id: message._id, text, edited: true, updatedAt: message.updatedAt });
        ack?.({ status: "ok" });
      } catch (err) {
        ack?.({ status: "error", message: err.message });
      }
    });

    // ===== DELETE MESSAGE =====
    socket.on("delete_message", async (data, ack) => {
      try {
        const { messageId } = data;
        const message = await Message.findById(messageId);
        if (!message) return ack?.({ status: "error", message: "Not found" });
        if (message.senderId.toString() !== userId) return ack?.({ status: "error", message: "Unauthorized" });

        const chatId = message.chatId;
        await message.deleteOne();

        io.to(String(chatId)).emit("message_deleted", { id: messageId });
        ack?.({ status: "ok" });
      } catch (err) {
        ack?.({ status: "error", message: err.message });
      }
    });

    // ===== TYPING INDICATOR =====
    socket.on("typing", (chatId) => {
      socket.to(String(chatId)).emit("user_typing", { userId, chatId });
    });

    socket.on("stop_typing", (chatId) => {
      socket.to(String(chatId)).emit("user_stop_typing", { userId, chatId });
    });

    // ===== DISCONNECT =====
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);

      // Remove this socket from the user's set
      if (onlineUsers.has(userId)) {
        onlineUsers.get(userId).delete(socket.id);

        // If no more sockets for this user, they are offline
        if (onlineUsers.get(userId).size === 0) {
          onlineUsers.delete(userId);
          // Broadcast to all clients that this user is offline
          io.emit("user_offline", { userId });
        }
      }
    });
  });
};
