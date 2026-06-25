import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "../components/Toast";
import { 
  FaPaperPlane, 
  FaImage, 
  FaSmile, 
  FaPhone, 
  FaVideo, 
  FaEllipsisV,
  FaChevronLeft,
  FaCheckDouble,
  FaCheck,
  FaTimes,
  FaRobot,
  FaUser,
  FaSeedling,
  FaDollarSign,
  FaShoppingCart,
  FaInfoCircle,
  FaSpinner
} from "react-icons/fa";
import { format } from "date-fns";
import { askMarketplaceAI } from "../services/aiService";
import { getChats, getMessages, sendMessage as sendMessageAPI, createChat, markChatAsRead } from "../services/chatService";
import { getCurrentUser } from "../services/authService";
import { useSocket } from "../context/SocketContext";

const Chat = () => {
  const location = useLocation();
  
  // Socket.IO connection
  const { 
    socket, 
    connected, 
    isUserOnline,
    joinChat, 
    leaveChat, 
    sendMessage: sendSocketMessage, 
    onReceiveMessage, 
    onMessageEdited, 
    onMessageDeleted,
    offReceiveMessage,
    offMessageEdited,
    offMessageDeleted
  } = useSocket();

  // Real chat data from API
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  
  // UI states
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  
  // Quick replies
  const [quickReplies, setQuickReplies] = useState([
    "What's the best price?",
    "How to check quality?",
    "Shipping options?",
    "Payment methods?"
  ]);

  // AI Rate limit counter (10 free requests)
  const [aiRequestCount, setAiRequestCount] = useState(0);
  const AI_REQUEST_LIMIT = 10;

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const user = getCurrentUser();
  const { toast } = useToast();
  
  console.log("Current user in Chat component:", user);
  console.log("User role:", user?.role);

  // AI messages state
  const [aiMessages, setAiMessages] = useState([{
    _id: 1,
    senderId: { _id: "ai", name: "Kisan Assistant" },
    text: "Hello! 🌾\n\nI'm Kisan Assistant, your Farmer Marketplace helper.\n\nHow can I help you today?\n\n💰 Find cheapest products\n👨‍🌾 Learn about farmers\n🛒 Shopping help\n📦 Search products\n\nTry asking: \"Which vegetable is the cheapest?\" or \"Tell me about farmers\"",
    createdAt: new Date(),
    isOwn: false
  }]);

  // Determine active chat type
  const activeChat = selectedChat?._id === "ai-assistant" ? "ai" : "seller";

  // AI Assistant Chat (separate from real chats)
  const aiAssistantChat = {
    _id: "ai-assistant",
    isAI: true,
    otherUser: {
      name: "Farm AI Assistant",
      photo: null,
      role: "ai",
      status: "Online"
    },
    messages: []
  };

  // Fetch all chats on mount
  useEffect(() => {
    fetchAllChats();
  }, []);

  // Handle incoming farmer ID from navigation (e.g., from Product Details)
  useEffect(() => {
    const handleIncomingFarmer = async () => {
      if (location.state?.farmerId) {
        const farmerId = location.state.farmerId;
        const farmerName = location.state.farmerName;
        
        console.log("🔗 Navigation state detected - Farmer ID:", farmerId);
        console.log("🔗 Farmer Name:", farmerName);
        console.log("🔗 Current chats loaded:", chats.length);
        console.log("🔗 Loading state:", loading);
        
        // Wait for chats to finish loading before checking
        if (loading) {
          console.log("⏳ Still loading chats, will retry...");
          return;
        }
        
        // Check if chat already exists with this farmer
        const existingChat = chats.find(chat => 
          chat._id !== "ai-assistant" && chat.otherUser?._id === farmerId
        );
        
        if (existingChat) {
          console.log("✅ Found existing chat with farmer:", existingChat);
          // Select existing chat
          setSelectedChat(existingChat);
        } else {
          console.log("📝 No existing chat found. Creating new chat with farmer...");
          // Create new chat with this farmer
          try {
            const response = await createChat(farmerId);
            console.log("✅ Chat creation API response:", response);
            
            // Backend now returns formatted chat with otherUser
            const newChat = response.data || response;
            console.log("✅ Extracted chat data:", newChat);
            
            // Use backend's otherUser if available, otherwise create manually
            const formattedChat = newChat.otherUser ? newChat : {
              ...newChat,
              otherUser: {
                _id: farmerId,
                name: farmerName || "Farmer",
                role: "farmer",
                status: "Online"
              }
            };
            
            console.log("✅ New chat created and formatted:", formattedChat);
            
            // Add to chats list and select it
            setChats(prev => {
              console.log("📝 Adding chat to existing chats. Previous count:", prev.length);
              return [formattedChat, ...prev];
            });
            setSelectedChat(formattedChat);
            
            console.log("🎉 Chat created successfully! Refreshing chat list...");
            // Refresh all chats to ensure consistency
            await fetchAllChats();
          } catch (error) {
            console.error("❌ Error creating chat:", error);
            console.error("❌ Error response:", error.response?.data);
            console.error("❌ Error status:", error.response?.status);
            toast.error("Failed to start chat with farmer. Please try again.");
          }
        }
        
        // Clear the state to prevent re-triggering
        console.log("🧹 Clearing navigation state");
        window.history.replaceState({}, document.title);
      }
    };
    
    // Only run when not loading initial chats
    if (!loading) {
      handleIncomingFarmer();
    }
  }, [location.state?.farmerId, loading, chats.length]);

  // Fetch messages when chat is selected
  useEffect(() => {
    if (selectedChat && selectedChat._id !== "ai-assistant") {
      fetchChatMessages(selectedChat._id);
      // Mark messages as read when opening a chat
      markChatAsRead(selectedChat._id).catch(() => {});
      // Join the chat room via socket
      if (socket && connected) {
        joinChat(selectedChat._id);
      }
    }

    // Cleanup: leave chat room when switching chats
    return () => {
      if (selectedChat && selectedChat._id !== "ai-assistant" && socket) {
        leaveChat(selectedChat._id);
      }
    };
  }, [selectedChat, socket, connected]);

  // Listen for real-time messages
  useEffect(() => {
    if (!socket || !connected) return;

    // Handle incoming messages
    const handleReceiveMessage = (message) => {
      console.log('📩 Received message:', message);
      
      // Only add message if it's for the current chat AND not sent by us
      if (selectedChat && message.chatId === selectedChat._id) {
        // Skip if this is our own message (already handled by optimistic update)
        if (message.senderId === user._id) {
          console.log('⏭️ Skipping own message (already in UI)');
          return;
        }
        
        const formattedMessage = {
          _id: message._id,
          chatId: message.chatId,
          senderId: message.senderId,
          receiverId: message.receiverId,
          text: message.text,
          createdAt: message.createdAt,
          isOwn: false
        };
        
        setMessages(prev => {
          // Prevent duplicates
          if (prev.some(m => m._id === message._id)) {
            console.log('⏭️ Duplicate message detected, skipping');
            return prev;
          }
          console.log('✅ Adding received message to UI');
          return [...prev, formattedMessage];
        });
      }
      
      // Update chat list with last message
      setChats(prevChats => 
        prevChats.map(chat => 
          chat._id === message.chatId 
            ? { ...chat, lastMessage: message.text, updatedAt: message.createdAt }
            : chat
        )
      );
    };

    // Handle message edits
    const handleMessageEdited = (data) => {
      console.log('✏️ Message edited:', data);
      setMessages(prev => 
        prev.map(msg => 
          msg._id === data.id 
            ? { ...msg, text: data.text, edited: true, updatedAt: data.updatedAt }
            : msg
        )
      );
    };

    // Handle message deletions
    const handleMessageDeleted = (data) => {
      console.log('🗑️ Message deleted:', data);
      setMessages(prev => prev.filter(msg => msg._id !== data.id));
    };

    onReceiveMessage(handleReceiveMessage);
    onMessageEdited(handleMessageEdited);
    onMessageDeleted(handleMessageDeleted);

    // Cleanup listeners
    return () => {
      offReceiveMessage();
      offMessageEdited();
      offMessageDeleted();
    };
  }, [socket, connected, selectedChat, user._id]);

  // Auto-scroll only when new messages arrive (not on every render)
  const prevMessagesLength = useRef(messages.length);
  useEffect(() => {
    if (messages.length > prevMessagesLength.current) {
      scrollToBottom();
      prevMessagesLength.current = messages.length;
    }
  }, [messages.length]);

  const fetchAllChats = async () => {
    try {
      setLoading(true);
      console.log("🔄 Starting fetchAllChats...");
      console.log("🔄 Current user:", user);
      console.log("🔄 User role:", user?.role);
      
      const data = await getChats();
      console.log("✅ Fetched chats raw data:", data);
      console.log("✅ Data type:", Array.isArray(data) ? "Array" : typeof data);
      console.log("✅ Data length:", Array.isArray(data) ? data.length : "N/A");
      
      // Backend returns array directly, not wrapped in data.data
      const chatsArray = Array.isArray(data) ? data : (data?.data || data?.chats || []);
      console.log("📊 Chats array length:", chatsArray.length);
      console.log("📊 Chats array content:", JSON.stringify(chatsArray, null, 2));
      
      if (chatsArray.length === 0) {
        console.warn("⚠️ No chats returned from backend!");
        console.warn("⚠️ This means either:");
        console.warn("   1. No chats exist in database");
        console.warn("   2. All chats were filtered out due to role mismatch");
        console.warn("   3. API request failed");
      }
      
      // Filter and format chats where the other user exists
      const validChats = chatsArray.filter(chat => {
        // Check if otherUser exists and has valid data
        if (!chat || !chat.otherUser || !chat.otherUser._id) {
          console.warn("❌ Filtered out chat with missing user:", chat?._id);
          return false;
        }
        console.log("✅ Valid chat found:", {
          chatId: chat._id,
          otherUser: chat.otherUser?.name,
          role: chat.otherUser?.role,
          lastMessage: chat.lastMessage
        });
        return true;
      }).map(chat => ({
        ...chat,
        // Ensure otherUser has all needed properties
        otherUser: {
          _id: chat.otherUser._id,
          name: chat.otherUser.name || chat.otherUser.username || "User",
          role: chat.otherUser.role || "buyer",
          email: chat.otherUser.email,
          photo: chat.otherUser.photo,
          status: chat.otherUser.status || "Online"
        }
      }));
      
      console.log("✅ Valid chats after filtering:", validChats);
      console.log("✅ Number of valid chats:", validChats.length);
      
      // For buyers: Add AI assistant as first chat
      // For farmers: AI assistant is available in sidebar but real chats take priority
      const allChats = user.role === "buyer" 
        ? [aiAssistantChat, ...validChats]
        : [aiAssistantChat, ...validChats];
      
      setChats(allChats);
      
      // Select first available chat
      if (!selectedChat && allChats.length > 0) {
        // For farmers, select first real chat if available, otherwise AI
        if (user.role === "farmer" && validChats.length > 0) {
          setSelectedChat(validChats[0]);
        } else {
          setSelectedChat(aiAssistantChat);
        }
      }
    } catch (error) {
      console.error("❌ ERROR fetching chats:", error);
      console.error("❌ Error details:", error.response?.data || error.message);
      console.error("❌ Error status:", error.response?.status);
      // Even if API fails, show AI assistant
      setChats([aiAssistantChat]);
      setSelectedChat(aiAssistantChat);
    } finally {
      console.log("🏁 fetchAllChats completed, loading set to false");
      setLoading(false);
    }
  };

  const fetchChatMessages = async (chatId) => {
    try {
      setLoadingMessages(true);
      const data = await getMessages(chatId);
      console.log("Fetched messages:", data);
      
      // Format messages with isOwn property
      const formattedMessages = (data || []).map(msg => ({
        ...msg,
        isOwn: msg.senderId?._id === user._id || msg.senderId === user._id
      }));
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, 100);
  };

  const handleSend = async () => {
    if (input.trim() === "" && !image) return;
    if (!selectedChat) return;

    const messageText = input.trim();
    setInput("");
    setImage(null);
    setImagePreview(null);

    // AI Assistant Chat
    if (selectedChat._id === "ai-assistant") {
      const userMessage = {
        _id: Date.now(),
        senderId: { _id: user._id, name: user.name },
        text: messageText,
        createdAt: new Date(),
        isOwn: true
      };
      
      setAiMessages(prev => [...prev, userMessage]);
      setIsAiTyping(true);
      
      try {
        // Check if limit already reached locally
        if (aiRequestCount >= AI_REQUEST_LIMIT) {
          setIsAiTyping(false);
          const limitMessage = {
            _id: Date.now() + 1,
            senderId: { _id: "ai", name: "Kisan Assistant" },
            text: "آپ کی 10 مفت گفتگو ختم ہو گئی ہیں۔ Premium لیں!\n\nYou've used all 10 free AI chats. Upgrade to Premium! 🌾",
            createdAt: new Date(),
            isOwn: false
          };
          setAiMessages(prev => [...prev, limitMessage]);
          return;
        }

        // Send userId for rate limiting
        const aiResponse = await askMarketplaceAI(messageText, user?._id);
        setIsAiTyping(false);
        
        // Update local counter
        setAiRequestCount(prev => prev + 1);
        
        // Check if rate limit reached from server
        if (aiResponse.limitReached) {
          setAiRequestCount(AI_REQUEST_LIMIT); // Set to max
          const limitMessage = {
            _id: Date.now() + 1,
            senderId: { _id: "ai", name: "Kisan Assistant" },
            text: aiResponse.response,
            createdAt: new Date(),
            isOwn: false
          };
          setAiMessages(prev => [...prev, limitMessage]);
          return;
        }
        
        const aiMessage = {
          _id: Date.now() + 1,
          senderId: { _id: "ai", name: "Kisan Assistant" },
          text: aiResponse.response,
          createdAt: new Date(),
          isOwn: false
        };
        
        setAiMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        console.error("AI Error:", error);
        setIsAiTyping(false);
        
        // Check if rate limit error
        if (error.response?.status === 429) {
          const limitMessage = {
            _id: Date.now() + 1,
            senderId: { _id: "ai", name: "Kisan Assistant" },
            text: error.response?.data?.response || "آپ کی مفت گفتگو ختم ہو گئی ہیں۔ Premium لیں! 🌾",
            createdAt: new Date(),
            isOwn: false
          };
          setAiMessages(prev => [...prev, limitMessage]);
          return;
        }
        
        const errorMessage = {
          _id: Date.now() + 1,
          senderId: { _id: "ai", name: "Kisan Assistant" },
          text: "I'm having trouble connecting. Please try again!",
          createdAt: new Date(),
          isOwn: false
        };
        
        setAiMessages(prev => [...prev, errorMessage]);
      }
      return;
    }

    // Real Chat with Seller - Use Socket.IO for instant delivery
    try {
      setSendingMessage(true);
      const receiverId = getOtherUserId(selectedChat);
      
      if (!receiverId) {
        console.error("No receiver ID found");
        toast.error("Cannot send message: receiver not found");
        setSendingMessage(false);
        return;
      }

      // If socket is connected, use real-time socket
      if (socket && connected && selectedChat._id !== "dummy-seller") {
        const messageData = {
          chatId: selectedChat._id,
          receiverId: receiverId,
          text: messageText
        };

        // Optimistically add message to UI
        const optimisticMessage = {
          _id: `temp-${Date.now()}`,
          chatId: selectedChat._id,
          senderId: user._id,
          receiverId: receiverId,
          text: messageText,
          createdAt: new Date(),
          isOwn: true,
          pending: true
        };
        
        setMessages(prev => [...prev, optimisticMessage]);

        // Send via socket with acknowledgment
        sendSocketMessage(messageData, (response) => {
          setSendingMessage(false);
          
          if (response.status === 'ok') {
            // Replace optimistic message with real one
            setMessages(prev => 
              prev.map(msg => 
                msg._id === optimisticMessage._id 
                  ? { ...response.data, isOwn: true, pending: false }
                  : msg
              )
            );
            console.log('✅ Message sent via socket');
          } else {
            // Remove optimistic message on error
            setMessages(prev => prev.filter(msg => msg._id !== optimisticMessage._id));
            toast.error(`Failed to send message: ${response.message}`);
            console.error('❌ Socket send error:', response);
          }
        });
      } else {
        // Fallback to HTTP API if socket not connected
        const messageData = {
          chatId: selectedChat._id,
          receiverId: receiverId,
          text: messageText
        };

        const sentMessage = await sendMessageAPI(messageData);
        
        // Add the message to UI
        const newMessage = {
          ...sentMessage,
          senderId: { _id: user._id, name: user.name },
          isOwn: true
        };
        
        setMessages(prev => [...prev, newMessage]);
        setSendingMessage(false);
        console.log('✅ Message sent via HTTP API');
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
      setSendingMessage(false);
    }
  };

  const getOtherUserId = (chat) => {
    if (!chat || !chat.members) return null;
    const otherMember = chat.members.find(member => {
      const memberId = member._id || member;
      return memberId !== user._id;
    });
    return otherMember?._id || otherMember;
  };

  const getOtherUser = (chat) => {
    if (chat._id === "ai-assistant") return chat.otherUser;
    if (!chat || !chat.members) return null;
    
    const otherMember = chat.members.find(member => {
      const memberId = member._id || member;
      return memberId !== user._id;
    });
    
    return otherMember;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImagePreview = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReply = (reply) => {
    setInput(reply);
  };

  const toggleAiAssistant = () => {
    setShowAiAssistant(!showAiAssistant);
    if (!showAiAssistant && selectedChat?._id !== "ai-assistant") {
      // Switch to AI assistant when toggling on
      setSelectedChat(aiAssistantChat);
    }
  };

  const switchChat = (chatType) => {
    if (chatType === "ai") {
      setSelectedChat(aiAssistantChat);
      setShowAiAssistant(true);
    } else {
      // Switch to first real chat if available
      const realChats = chats.filter(c => c._id !== "ai-assistant");
      if (realChats.length > 0) {
        setSelectedChat(realChats[0]);
        setShowAiAssistant(false);
      } else {
        // If no real chats, stay on AI assistant
        setSelectedChat(aiAssistantChat);
        setShowAiAssistant(true);
      }
    }
  };

  const handleSelectChat = (chat) => {
    console.log("Selected chat:", chat);
    setSelectedChat(chat);
    if (chat._id === "ai-assistant") {
      setShowAiAssistant(true);
      if (aiMessages.length === 0) {
        setAiMessages([{
          _id: 1,
          senderId: { _id: "ai", name: "AI Assistant" },
          text: "Hello! I'm your Farm AI Assistant 🌱\n\nI can help you with:\n\n💰 Product Prices - Ask me which products are cheapest or most expensive\n🥬 Browse Products - Search by category, region, or price range\n👨‍🌾 Find Farmers - Learn about farmers and their products\n📊 Market Insights - Get statistics and trends\n🌾 Farming Tips - General agricultural advice\n\nTry asking: \"Which vegetable is the cheapest?\" or \"Show me products under ₨500\"",
          createdAt: new Date(),
          isOwn: false
        }]);
      }
      console.log("AI Assistant selected");
    } else {
      setShowAiAssistant(false);
      joinChat(chat._id);
      console.log("Real chat selected, messages will be fetched via useEffect");
    }
  };

  const formatTime = (date) => {
    if (!date) return "";
    try {
      return format(new Date(date), "HH:mm");
    } catch {
      return "";
    }
  };

  // Display messages based on selected chat
  const currentChat = selectedChat?._id === "ai-assistant" ? aiMessages : messages;
  const isTypingActive = selectedChat?._id === "ai-assistant" ? isAiTyping : isTyping;

  // Check if user is a farmer
  const isFarmer = user?.role === "farmer";
  

  return (
    <div className="h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center p-2 sm:py-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Chat Container */}
      <div className="w-full max-w-7xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-1 min-h-0 border border-green-200/60 relative">
        
        {/* Sidebar - Only show for farmers */}
        {isFarmer && (
          <div className={`${showSidebar ? 'flex' : 'hidden'} lg:flex w-full lg:w-80 bg-gradient-to-b from-green-50 to-white border-r border-green-200 flex-col absolute lg:relative inset-0 z-10 lg:z-auto`}>
            {/* Sidebar Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4">
              <h2 className="text-xl font-bold">Conversations</h2>
              <p className="text-sm text-green-100">Your chats</p>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {/* AI Assistant */}
              <div
                onClick={() => handleSelectChat(aiAssistantChat)}
                className={`p-4 border-b border-green-100 cursor-pointer transition-all hover:bg-green-50 ${
                  selectedChat?._id === "ai-assistant" ? "bg-green-100 border-l-4 border-l-green-600" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
                    <FaRobot />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">Kisan Assistant</h3>
                    <p className="text-sm text-gray-500 truncate">Your farming expert</p>
                  </div>
                  {/* AI Request Counter Badge */}
                  <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                    aiRequestCount >= AI_REQUEST_LIMIT 
                      ? "bg-red-100 text-red-600" 
                      : aiRequestCount >= 7 
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                  }`}>
                    {AI_REQUEST_LIMIT}/{aiRequestCount}
                  </div>
                </div>
              </div>

              {/* Real Buyer Chats */}
              {loading ? (
                <div className="p-8 text-center">
                  <FaSpinner className="animate-spin text-green-600 text-3xl mx-auto mb-2" />
                  <p className="text-gray-500">Loading chats...</p>
                </div>
              ) : (
                <>
                  {chats
                    .filter(chat => chat._id !== "ai-assistant")
                    .map((chat) => {
                      // Format timestamp
                      const getTimeDisplay = (timestamp) => {
                        if (!timestamp) return "";
                        try {
                          const date = new Date(timestamp);
                          const now = new Date();
                          const diffInHours = (now - date) / (1000 * 60 * 60);
                          
                          if (diffInHours < 24) {
                            // Show time if today
                            return format(date, "HH:mm");
                          } else if (diffInHours < 48) {
                            // Show "Yesterday" if yesterday
                            return "Yesterday";
                          } else if (diffInHours < 168) {
                            // Show day name if within a week
                            return format(date, "EEEE");
                          } else {
                            // Show date if older
                            return format(date, "dd/MM/yy");
                          }
                        } catch (error) {
                          return "";
                        }
                      };

                      return (
                        <div
                          key={chat._id}
                          onClick={() => handleSelectChat(chat)}
                          className={`p-4 border-b border-green-100 cursor-pointer transition-all hover:bg-green-50 ${
                            selectedChat?._id === chat._id ? "bg-green-100 border-l-4 border-l-green-600" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {/* User Avatar */}
                            <div className="relative">
                              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                {chat.otherUser?.name?.charAt(0).toUpperCase() || "B"}
                              </div>
                              {/* Online indicator */}
                              <div className={`absolute bottom-0 right-0 w-3 h-3 ${isUserOnline(chat.otherUser?._id) ? 'bg-green-400' : 'bg-gray-400'} border-2 border-white rounded-full`}></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold text-gray-800 truncate">
                                  {chat.otherUser?.name || "Buyer"}
                                </h3>
                                {chat.updatedAt && (
                                  <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                                    {getTimeDisplay(chat.updatedAt)}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm text-gray-500 truncate flex-1">
                                  {chat.lastMessage || "Start a conversation..."}
                                </p>
                                {chat.unreadCount > 0 && (
                                  <span className="bg-green-600 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 flex-shrink-0">
                                    {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  }
                </>
              )}

              {/* Empty State */}
              {!loading && chats.filter(c => c._id !== "ai-assistant").length === 0 && (
                <div className="p-8 text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="font-semibold text-gray-800 mb-2">No Conversations Yet</h3>
                  <p className="text-sm text-gray-500 mb-4">Buyers will appear here when they message you</p>
                  <div className="bg-green-50 rounded-lg p-4 text-left">
                    <p className="text-xs text-gray-600">
                      <strong>💡 Tip:</strong> When buyers send you messages from product pages, their conversations will show up here.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <button 
                  className="lg:hidden p-2 hover:bg-green-500 rounded-xl transition-colors"
                  onClick={() => setShowSidebar(true)}
                >
                  <FaChevronLeft className="text-lg" />
                </button>
                
                {/* Chat Type Selector - Only for buyers */}
                {!isFarmer && (
                  <div className="flex bg-green-500 rounded-2xl p-1">
                    <button
                      onClick={() => switchChat("seller")}
                      className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                        activeChat === "seller" 
                          ? "bg-white text-green-700 shadow-lg" 
                          : "text-green-100 hover:bg-green-500"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <FaUser className="text-xs" />
                        Seller
                      </div>
                    </button>
                    <button
                      onClick={() => switchChat("ai")}
                      className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                        activeChat === "ai" 
                          ? "bg-white text-green-700 shadow-lg" 
                          : "text-green-100 hover:bg-green-500"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <FaRobot className="text-xs" />
                        AI Assistant
                      </div>
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl ${
                    activeChat === "seller" ? "bg-green-500" : "bg-purple-500"
                  }`}>
                    {activeChat === "seller" ? (isFarmer ? "�" : "�👨‍🌾") : "🤖"}
                  </div>
                  <div>
                    <h2 className="font-bold text-lg sm:text-xl">
                      {activeChat === "seller" 
                        ? (selectedChat?.otherUser?.name || (isFarmer ? "Buyer" : "Seller"))
                        : "Farm AI Assistant"
                      }
                    </h2>
                    <div className="flex items-center gap-2 text-green-100 text-sm">
                      <div className={`w-2 h-2 ${activeChat === 'ai' || (selectedChat?.otherUser?._id && isUserOnline(selectedChat.otherUser._id)) ? 'bg-green-300 animate-pulse' : 'bg-gray-400'} rounded-full`}></div>
                      <span>{activeChat === 'ai' ? 'Online' : (selectedChat?.otherUser?._id && isUserOnline(selectedChat.otherUser._id) ? 'Online' : 'Offline')}</span>
                      <span className="text-green-200">•</span>
                      <span>{activeChat === "seller" 
                        ? (selectedChat?.otherUser?.role || (isFarmer ? "Buyer" : "Seller"))
                        : "Your farming and market expert"
                      }</span>
                      {activeChat === "seller" && (
                        <>
                          <span className="text-green-200">•</span>
                          <span className={`flex items-center gap-1 ${connected ? 'text-green-200' : 'text-red-300'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-300' : 'bg-red-400'}`}></div>
                            {connected ? 'Live' : 'Offline'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {activeChat === "seller" && (
                <div className="flex items-center gap-2 sm:gap-4">
                  <button className="p-2 sm:p-3 hover:bg-green-500 rounded-xl transition-colors" title="Call">
                    <FaPhone className="text-lg" />
                  </button>
                  <button className="p-2 sm:p-3 hover:bg-green-500 rounded-xl transition-colors" title="Video Call">
                    <FaVideo className="text-lg" />
                  </button>
                  <button className="p-2 sm:p-3 hover:bg-green-500 rounded-xl transition-colors">
                    <FaEllipsisV className="text-lg" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-green-50/30 to-emerald-50/30">
          {/* Loading Messages State */}
          {loadingMessages ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <FaSpinner className="animate-spin text-green-600 text-4xl mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Loading messages...</p>
              </div>
            </div>
          ) : currentChat.length === 0 && selectedChat?._id !== "ai-assistant" ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Messages Yet</h3>
                <p className="text-gray-500">Start the conversation by sending a message!</p>
              </div>
            </div>
          ) : (
            currentChat.map((msg, index) => (
            <div
              key={msg._id || msg.id || index}
              className={`flex ${
                msg.sender === "user" || msg.isOwn ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex flex-col max-w-[85%] sm:max-w-[70%]">
                {(msg.sender === "ai" || msg.senderId?.name === "AI Assistant") && (
                  <div className="flex items-center gap-2 mb-1 px-2">
                    <FaRobot className="text-purple-500 text-sm" />
                    <span className="text-xs text-gray-500 font-medium">AI Assistant</span>
                  </div>
                )}
                <div
                  className={`rounded-3xl p-4 sm:p-5 ${
                    msg.sender === "user" || msg.isOwn
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white rounded-br-xl"
                      : (msg.sender === "ai" || msg.senderId?.name === "AI Assistant")
                      ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-bl-xl"
                      : "bg-white text-gray-800 border border-green-200 rounded-bl-xl shadow-sm"
                  }`}
                >
                  {msg.text && <p className="leading-relaxed">{msg.text}</p>}
                  {msg.image && (
                    <div className="mt-3 relative">
                      <img
                        src={msg.image}
                        alt="uploaded"
                        className="rounded-2xl max-w-full h-auto max-h-64 object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className={`flex items-center gap-2 mt-2 px-2 text-xs text-gray-500 ${
                  msg.sender === "user" || msg.isOwn ? "justify-end" : "justify-start"
                }`}>
                  <span>{formatTime(msg.timestamp || msg.createdAt)}</span>
                  {(msg.sender === "user" || msg.isOwn) && (
                    <span className="text-green-600">
                      {msg.read ? <FaCheckDouble /> : <FaCheck />}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )))}

          {/* Typing Indicator */}
          {isTypingActive && (
            <div className="flex justify-start">
              <div className={`rounded-3xl rounded-bl-xl p-4 shadow-sm ${
                activeChat === "ai" 
                  ? "bg-purple-500 text-white" 
                  : "bg-white border border-green-200"
              }`}>
                <div className="flex space-x-2">
                  <div className={`w-2 h-2 rounded-full animate-bounce ${
                    activeChat === "ai" ? "bg-white" : "bg-green-400"
                  }`}></div>
                  <div className={`w-2 h-2 rounded-full animate-bounce ${
                    activeChat === "ai" ? "bg-white" : "bg-green-400"
                  }`} style={{ animationDelay: "0.2s" }}></div>
                  <div className={`w-2 h-2 rounded-full animate-bounce ${
                    activeChat === "ai" ? "bg-white" : "bg-green-400"
                  }`} style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Replies for AI Chat */}
          {activeChat === "ai" && input === "" && !isAiTyping && (
            <div className="flex flex-wrap gap-2 justify-start mt-4">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                  className="bg-white border border-green-200 text-green-700 px-4 py-2 rounded-full text-sm hover:bg-green-50 transition-colors duration-200 shadow-sm"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="px-4 sm:px-6 py-3 border-t border-green-200 bg-green-50/50">
            <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-green-200 shadow-sm">
              <img
                src={imagePreview}
                alt="preview"
                className="w-16 h-16 object-cover rounded-xl"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Image ready to send</p>
                <p className="text-xs text-gray-500">Click send to share</p>
              </div>
              <button
                onClick={removeImagePreview}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-green-200 bg-white p-4 sm:p-6">
          <div className="flex items-end gap-3">
            <div className="flex gap-1 sm:gap-2">
              <label className="cursor-pointer p-2 sm:p-3 bg-green-100 hover:bg-green-200 transition-all duration-300 rounded-2xl text-green-700 hover:text-green-800">
                <FaImage className="text-lg sm:text-xl" />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
              <button className="p-2 sm:p-3 bg-green-100 hover:bg-green-200 transition-all duration-300 rounded-2xl text-green-700 hover:text-green-800">
                <FaSmile className="text-lg sm:text-xl" />
              </button>
            </div>

            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  activeChat === "seller" 
                    ? "Type your message to seller..." 
                    : "Ask AI Assistant about farming, prices, or market trends..."
                }
                rows="1"
                className="w-full border border-green-200 rounded-2xl px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 resize-none bg-green-50/50 transition-all duration-300 text-base"
                style={{ minHeight: "50px", maxHeight: "120px" }}
              />
            </div>

            <button
              onClick={handleSend}
              disabled={!input.trim() && !imagePreview}
              className={`p-3 sm:p-4 rounded-2xl transition-all duration-300 shadow-lg ${
                input.trim() || imagePreview
                  ? activeChat === "ai"
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white hover:shadow-xl hover:scale-105"
                    : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:shadow-xl hover:scale-105"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <FaPaperPlane className="text-lg sm:text-xl" />
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* AI Assistant Toggle Button - Only for buyers */}
      {!isFarmer && (
        <button
          onClick={toggleAiAssistant}
          className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
            activeChat === "ai" 
              ? "bg-purple-600 hover:bg-purple-700 text-white" 
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
          title="AI Farming Assistant"
        >
          <FaRobot className="text-xl" />
        </button>
      )}

      {/* AI Assistant Quick Actions - Only for buyers */}
      {!isFarmer && showAiAssistant && activeChat === "ai" && (
        <div className="fixed bottom-20 right-6 bg-white rounded-2xl shadow-2xl border border-green-200 p-4 w-64">
          <div className="flex items-center gap-2 mb-3">
            <FaRobot className="text-purple-500" />
            <span className="font-semibold text-gray-800">AI Assistant</span>
          </div>
          <div className="space-y-2">
            <button 
              onClick={() => handleQuickReply("What are current market prices for wheat?")}
              className="w-full text-left p-3 rounded-xl hover:bg-purple-50 transition-colors border border-purple-100"
            >
              <div className="flex items-center gap-2">
                <FaDollarSign className="text-purple-500 text-sm" />
                <span className="text-sm">Market Prices</span>
              </div>
            </button>
            <button 
              onClick={() => handleQuickReply("Give me farming tips for better yield")}
              className="w-full text-left p-3 rounded-xl hover:bg-purple-50 transition-colors border border-purple-100"
            >
              <div className="flex items-center gap-2">
                <FaSeedling className="text-purple-500 text-sm" />
                <span className="text-sm">Farming Tips</span>
              </div>
            </button>
            <button 
              onClick={() => handleQuickReply("How to check product quality?")}
              className="w-full text-left p-3 rounded-xl hover:bg-purple-50 transition-colors border border-purple-100"
            >
              <div className="flex items-center gap-2">
                <FaInfoCircle className="text-purple-500 text-sm" />
                <span className="text-sm">Quality Guide</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


export default Chat