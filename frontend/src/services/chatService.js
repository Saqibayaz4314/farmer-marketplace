// src/services/chatService.js
import api from "./api";

/**
 * Create or get existing chat with another user
 * @param {string} receiverId - ID of the user to chat with
 * @returns {Promise} Chat object
 */
export const createChat = async (receiverId) => {
  const token = localStorage.getItem("token");
  const response = await api.post(
    "/chats",
    { receiverId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

/**
 * Get all chats for the current user
 * @returns {Promise} Array of chat objects
 */
export const getChats = async () => {
  const token = localStorage.getItem("token");
  const response = await api.get("/chats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Send a message in a chat
 * @param {Object} messageData - { chatId, receiverId, text }
 * @returns {Promise} Created message object
 */
export const sendMessage = async (messageData) => {
  const token = localStorage.getItem("token");
  const response = await api.post("/messages", messageData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Get all messages for a specific chat
 * @param {string} chatId - Chat ID
 * @returns {Promise} Array of message objects
 */
export const getMessages = async (chatId) => {
  const token = localStorage.getItem("token");
  const response = await api.get(`/messages/${chatId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Edit a message
 * @param {string} messageId - Message ID
 * @param {string} text - New message text
 * @returns {Promise} Updated message object
 */
export const editMessage = async (messageId, text) => {
  const token = localStorage.getItem("token");
  const response = await api.put(
    `/messages/${messageId}`,
    { text },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

/**
 * Delete a message
 * @param {string} messageId - Message ID
 * @returns {Promise} Deletion confirmation
 */
export const deleteMessage = async (messageId) => {
  const token = localStorage.getItem("token");
  const response = await api.delete(`/messages/${messageId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Get total unread message count for logged-in user
 * @returns {Promise} { unreadCount: number }
 */
export const getUnreadCount = async () => {
  const token = localStorage.getItem("token");
  const response = await api.get("/messages/unread-count", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Mark all messages in a chat as read
 * @param {string} chatId - Chat ID
 * @returns {Promise} Success confirmation
 */
export const markChatAsRead = async (chatId) => {
  const token = localStorage.getItem("token");
  const response = await api.put(`/messages/read/${chatId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
