// src/controllers/chatController.js
import Chat from "../models/Chat.js";
import User from "../models/User.js";

// create chat (or return existing between two users)
export const createChat = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user._id;

    if (!receiverId) {
      return res.status(400).json({ message: "receiverId required" });
    }

    // Fetch receiver to check they exist
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    // Look for existing chat with both members
    let chat = await Chat.findOne({ members: { $all: [senderId, receiverId] } })
      .populate("members", "name email role photo");

    if (!chat) {
      chat = await Chat.create({ members: [senderId, receiverId] });
      // Populate the newly created chat
      chat = await Chat.findById(chat._id).populate("members", "name email role photo");
    }

    // Format response with otherUser
    const otherUser = chat.members.find(member => member._id.toString() !== senderId.toString());

    const formattedChat = {
      _id: chat._id,
      members: chat.members,
      otherUser: {
        _id: otherUser._id,
        name: otherUser.name,
        email: otherUser.email,
        role: otherUser.role,
        photo: otherUser.photo,
      },
      lastMessage: chat.lastMessage,
      updatedAt: chat.updatedAt,
      createdAt: chat.createdAt
    };

    return res.status(200).json(formattedChat);
  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const getChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({ members: { $in: [userId] } })
      .populate("members", "name email role photo")
      .sort({ updatedAt: -1 });

    // Format chats and filter out those with deleted/invalid users
    const formattedChats = chats
      .map(chat => {
        const otherUser = chat.members.find(member => member && member._id.toString() !== userId.toString());

        // Skip this chat if other user doesn't exist (deleted account)
        if (!otherUser || !otherUser._id) {
          return null;
        }

        return {
          _id: chat._id,
          members: chat.members,
          otherUser: {
            _id: otherUser._id,
            name: otherUser.name,
            email: otherUser.email,
            role: otherUser.role,
            photo: otherUser.photo,
          },
          lastMessage: chat.lastMessage,
          updatedAt: chat.updatedAt,
          createdAt: chat.createdAt
        };
      })
      .filter(chat => chat !== null);

    res.status(200).json(formattedChats);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
