// src/services/authService.js
import api from "./api";

// Register user
export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  // Save token in localStorage
  if (response.data.success && response.data.data.token) {
    localStorage.setItem("token", response.data.data.token);
    const { token, ...userWithoutToken } = response.data.data;
    localStorage.setItem("user", JSON.stringify(userWithoutToken));
  }
  return response.data;
};

// Login user
export const loginUser = async (userData) => {
  const response = await api.post("/auth/login", userData);
  if (response.data.success && response.data.data.token) {
    localStorage.setItem("token", response.data.data.token);
    const { token, ...userWithoutToken } = response.data.data;
    localStorage.setItem("user", JSON.stringify(userWithoutToken));
  }
  return response.data;
};

// Get user profile (protected route)
export const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

// Update user profile — supports FormData (for photo upload) or JSON
export const updateProfile = async (profileData) => {
  const isFormData = profileData instanceof FormData;
  const config = isFormData
    ? { headers: { "Content-Type": "multipart/form-data" } }
    : {};

  const response = await api.put("/auth/profile", profileData, config);
  // Update localStorage with new user data
  if (response.data.success && response.data.data?.user) {
    const currentUser = getCurrentUser();
    const updatedUser = { ...currentUser, ...response.data.data.user };
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }
  return response.data;
};

// Change password (protected route)
export const changePassword = async (passwordData) => {
  const response = await api.put("/auth/change-password", passwordData);
  return response.data;
};

// Forgot password (public route)
export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

// Reset password with token (public route)
export const resetPassword = async (token, password) => {
  const response = await api.post(`/auth/reset-password/${token}`, { password });
  return response.data;
};

// 🔄 Switch role (farmer ↔ buyer)
export const switchRole = async () => {
  const response = await api.put("/auth/switch-role");
  if (response.data.success && response.data.data) {
    // Update localStorage with new role and token
    localStorage.setItem("token", response.data.data.token);
    const { token, ...userWithoutToken } = response.data.data;
    localStorage.setItem("user", JSON.stringify(userWithoutToken));
  }
  return response.data;
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
