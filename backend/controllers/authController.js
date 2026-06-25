import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import { sendEmail } from "../utils/emailService.js";
import { getWelcomeEmailTemplate, getForgotPasswordTemplate } from "../utils/emailTemplates.js";

dotenv.config();

// 🔐 Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// 🧾 Register a new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, location, contact, photo } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email"
      });
    }

    // Validate password length
    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long"
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      location,
      contact,
      photo,
    });

    // 📧 Send welcome email (non-blocking — doesn't fail registration if email fails)
    try {
      const welcomeHtml = getWelcomeEmailTemplate(user.name, user.role);
      await sendEmail(user.email, `Welcome to FarmLink, ${user.name}! 🌾`, welcomeHtml);
      console.log(`✅ Welcome email sent to ${user.email}`);
    } catch (emailError) {
      console.error("⚠️ Welcome email failed (non-critical):", emailError.message);
    }

    // Respond with token and user info
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    // Handle duplicate key error (unique fields)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists. Please use a different email."
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Server error during registration"
    });
  }
};

// 🔑 Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password"
      });
    }

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Respond
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error during login"
    });
  }
};

// 👤 Get user profile (Protected route)
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✏️ Update user profile (Protected route)
export const updateProfile = async (req, res) => {
  try {
    const { name, location, contact, photo } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update only provided fields
    if (name !== undefined) user.name = name.trim();
    if (location !== undefined) user.location = location.trim();
    if (contact !== undefined) user.contact = contact.trim();

    // Handle photo: uploaded file takes priority over text URL
    if (req.file) {
      // Multer uploaded a file — build the URL path
      user.photo = `/uploads/profiles/${req.file.filename}`;
    } else if (photo !== undefined) {
      user.photo = photo.trim();
    }

    await user.save();

    // Return updated user (without password)
    const updatedUser = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { user: updatedUser },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while updating profile",
    });
  }
};

// 🔑 Change password (Protected route)
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Set new password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while changing password",
    });
  }
};

// 📧 Forgot Password — sends reset email
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide your email address",
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if user exists or not (security best practice)
      return res.status(200).json({
        success: true,
        message: "If an account with this email exists, a password reset link has been sent.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token and save to DB
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save({ validateBeforeSave: false });

    // Build reset URL
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    // Send reset email
    try {
      const resetHtml = getForgotPasswordTemplate(user.name, resetUrl);
      await sendEmail(user.email, "🔑 Reset Your FarmLink Password", resetHtml);
      console.log(`✅ Password reset email sent to ${user.email}`);
    } catch (emailError) {
      // If email fails, clear the token
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save({ validateBeforeSave: false });

      console.error("❌ Password reset email failed:", emailError.message);
      return res.status(500).json({
        success: false,
        message: "Failed to send reset email. Please try again later.",
      });
    }

    res.status(200).json({
      success: true,
      message: "If an account with this email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error during password reset request",
    });
  }
};

// 🔐 Reset Password — validates token and sets new password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please provide a new password",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Hash the token from URL to compare with stored hash
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token. Please request a new password reset.",
      });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful! You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error during password reset",
    });
  }
};

// 🔄 Switch Role (Farmer ↔ Buyer)
export const switchRole = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Toggle role
    user.role = user.role === "farmer" ? "buyer" : "farmer";
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: `Switched to ${user.role} mode`,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error("Switch Role Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while switching role",
    });
  }
};
