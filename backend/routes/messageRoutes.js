// src/routes/messageRoutes.js
import express from "express";
import {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
  getUnreadCount,
  markAsRead,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/unread-count", protect, getUnreadCount);
router.put("/read/:chatId", protect, markAsRead);
router.get("/:chatId", protect, getMessages);
router.put("/:id", protect, editMessage);
router.delete("/:id", protect, deleteMessage);

export default router;
