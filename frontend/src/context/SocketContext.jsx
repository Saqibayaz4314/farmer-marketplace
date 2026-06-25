import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { getCurrentUser } from '../services/authService';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const user = getCurrentUser();

  useEffect(() => {
    // Only connect if user is authenticated
    if (!user || !user._id) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    // Connect to Socket.IO server
    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnected(false);
    });

    // ===== ONLINE STATUS EVENTS =====
    newSocket.on('online_users_list', (userIds) => {
      setOnlineUsers(new Set(userIds));
    });

    newSocket.on('user_online', ({ userId }) => {
      setOnlineUsers(prev => new Set([...prev, userId]));
    });

    newSocket.on('user_offline', ({ userId }) => {
      setOnlineUsers(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    setSocket(newSocket);

    // Cleanup on unmount or user change
    return () => {
      newSocket.disconnect();
    };
  }, [user?._id]);

  // Helper to check if a user is online
  const isUserOnline = useCallback((userId) => {
    return onlineUsers.has(userId);
  }, [onlineUsers]);

  const joinChat = (chatId) => {
    if (socket && chatId) {
      socket.emit('join_chat', chatId);
    }
  };

  const leaveChat = (chatId) => {
    if (socket && chatId) {
      socket.emit('leave_chat', chatId);
    }
  };

  const sendMessage = (messageData, callback) => {
    if (socket) {
      socket.emit('send_message', messageData, callback);
    }
  };

  const editMessage = (messageData, callback) => {
    if (socket) {
      socket.emit('edit_message', messageData, callback);
    }
  };

  const deleteMessage = (messageData, callback) => {
    if (socket) {
      socket.emit('delete_message', messageData, callback);
    }
  };

  const onReceiveMessage = (callback) => {
    if (socket) {
      socket.on('receive_message', callback);
    }
  };

  const onMessageEdited = (callback) => {
    if (socket) {
      socket.on('message_edited', callback);
    }
  };

  const onMessageDeleted = (callback) => {
    if (socket) {
      socket.on('message_deleted', callback);
    }
  };

  const offReceiveMessage = () => {
    if (socket) {
      socket.off('receive_message');
    }
  };

  const offMessageEdited = () => {
    if (socket) {
      socket.off('message_edited');
    }
  };

  const offMessageDeleted = () => {
    if (socket) {
      socket.off('message_deleted');
    }
  };

  const value = {
    socket,
    connected,
    onlineUsers,
    isUserOnline,
    joinChat,
    leaveChat,
    sendMessage,
    editMessage,
    deleteMessage,
    onReceiveMessage,
    onMessageEdited,
    onMessageDeleted,
    offReceiveMessage,
    offMessageEdited,
    offMessageDeleted
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
