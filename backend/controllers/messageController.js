// src/controllers/messageController.js
import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";

// send message (REST) — will also emit via Socket if io is set on app
export const sendMessage = async (req, res) => {
  try {
    const { chatId, receiverId, text } = req.body;
    if (!chatId || !receiverId || !text) {
      return res.status(400).json({ message: "chatId, receiverId and text are required" });
    }

    // Validate that sender and receiver exist
    const sender = await User.findById(req.user._id);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    const message = await Message.create({
      chatId,
      senderId: req.user._id,
      receiverId,
      text,
    });

    // update chat lastMessage and updatedAt
    await Chat.findByIdAndUpdate(chatId, { lastMessage: text, updatedAt: new Date() });

    // Emit via socket if available
    const io = req.app.get("io");
    if (io) {
      io.to(String(chatId)).emit("receive_message", {
        _id: message._id,
        chatId,
        senderId: req.user._id,
        receiverId,
        text,
        createdAt: message.createdAt,
      });
    }

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chatId })
      .populate("senderId", "name email photo")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const editMessage = async (req, res) => {
  try {
    const { id } = req.params; // message id
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "text required" });

    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    if (message.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this message" });
    }

    message.text = text;
    message.edited = true;
    await message.save();

    // Emit edit event via socket
    const io = req.app.get("io");
    if (io) io.to(String(message.chatId)).emit("message_edited", { id: message._id, text, edited: true, updatedAt: message.updatedAt });

    res.status(200).json({ message: "Message updated", updatedMessage: message });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    if (message.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this message" });
    }

    await message.deleteOne();

    // Emit delete event
    const io = req.app.get("io");
    if (io) io.to(String(message.chatId)).emit("message_deleted", { id: message._id });

    res.status(200).json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Get total unread message count for the logged-in user
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiverId: req.user._id,
      read: false,
    });
    res.status(200).json({ unreadCount: count });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Mark all messages in a chat as read (where current user is receiver)
export const markAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    await Message.updateMany(
      { chatId, receiverId: req.user._id, read: false },
      { $set: { read: true } }
    );
    res.status(200).json({ success: true, message: "Messages marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
