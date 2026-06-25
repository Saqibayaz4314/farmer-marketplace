import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  switchRole,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadProfilePhoto } from "../middleware/uploadProfileMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, uploadProfilePhoto, updateProfile);
router.put("/change-password", protect, changePassword);
router.put("/switch-role", protect, switchRole);

// 📧 Password Reset (Public routes — no auth needed)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
