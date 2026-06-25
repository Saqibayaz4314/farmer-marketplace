// src/services/productService.js
import api from "./api";

/**
 * Get all products
 * @returns {Promise} Array of products
 */
export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

/**
 * Get single product by ID
 * @param {string} id - Product ID
 * @returns {Promise} Product object
 */
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

/**
 * Add new product (Farmer only)
 * @param {FormData} formData - Product data with images
 * @returns {Promise} Created product object
 */
export const addProduct = async (formData) => {
  const token = localStorage.getItem("token");
  const response = await api.post("/products", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Update existing product (Owner only)
 * @param {string} id - Product ID
 * @param {FormData} formData - Updated product data
 * @returns {Promise} Updated product object
 */
export const updateProduct = async (id, formData) => {
  const token = localStorage.getItem("token");
  const response = await api.put(`/products/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Delete product (Owner only)
 * @param {string} id - Product ID
 * @returns {Promise} Deletion confirmation
 */
export const deleteProduct = async (id) => {
  const token = localStorage.getItem("token");
  const response = await api.delete(`/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Get products by farmer ID
 * @param {string} farmerId - Farmer ID
 * @returns {Promise} Array of products
 */
export const getProductsByFarmer = async (farmerId) => {
  const response = await api.get(`/products?farmerId=${farmerId}`);
  return response.data;
};

/**
 * Filter products by category
 * @param {string} category - Product category
 * @returns {Promise} Array of filtered products
 */
export const getProductsByCategory = async (category) => {
  const response = await api.get(`/products?category=${category}`);
  return response.data;
};

/**
 * Search products
 * @param {string} searchTerm - Search query
 * @returns {Promise} Array of matching products
 */
export const searchProducts = async (searchTerm) => {
  const response = await api.get(`/products?search=${searchTerm}`);
  return response.data;
};
