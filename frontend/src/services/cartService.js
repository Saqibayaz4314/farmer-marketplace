// src/services/cartService.js
import api from "./api";

/**
 * Add item to cart
 * @param {Object} cartItem - { userId, productId, name, price, image, quantity }
 * @returns {Promise} Updated cart object
 */
export const addToCart = async (cartItem) => {
  const response = await api.post("/cart/add", cartItem);
  return response.data;
};

/**
 * Get user's cart
 * @param {string} userId - User ID
 * @returns {Promise} Cart object with items
 */
export const getCart = async (userId) => {
  const response = await api.get(`/cart/${userId}`);
  return response.data;
};

/**
 * Remove item from cart
 * @param {string} userId - User ID
 * @param {string} productId - Product ID
 * @returns {Promise} Updated cart object
 */
export const removeFromCart = async (userId, productId) => {
  const response = await api.delete("/cart/remove", { 
    data: { userId, productId } 
  });
  return response.data;
};

/**
 * Clear all items from cart
 * @param {string} userId - User ID
 * @returns {Promise} Confirmation message
 */
export const clearCart = async (userId) => {
  const response = await api.delete("/cart/clear", { data: { userId } });
  return response.data;
};

/**
 * Update item quantity in cart
 * @param {string} userId - User ID
 * @param {string} productId - Product ID
 * @param {number} quantity - New quantity
 * @returns {Promise} Updated cart object
 */
export const updateCartItemQuantity = async (userId, productId, quantity) => {
  const response = await api.put("/cart/update", { 
    userId, 
    productId, 
    quantity 
  });
  return response.data;
};
