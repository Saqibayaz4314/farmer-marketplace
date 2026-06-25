// src/services/aiService.js
import api from "./api";

/**
 * Ask AI assistant a question (General farming advice - no database access)
 * @param {string} prompt - User's question or prompt
 * @returns {Promise} AI response
 */
export const askAI = async (prompt) => {
  const response = await api.post("/gemini/ask", { prompt });
  return response.data;
};

/**
 * Ask AI with full marketplace database context + rate limiting
 * @param {string} prompt - User's question about the marketplace
 * @param {string} userId - Optional user ID for rate limiting
 * @returns {Promise} AI response with real data
 */
export const askMarketplaceAI = async (prompt, userId = null) => {
  const response = await api.post("/gemini/marketplace", { prompt, userId });
  return response.data;
};

/**
 * Get user's rate limit status
 * @param {string} userId - User's ID
 * @returns {Promise} Rate limit info (used, remaining, isPremium, resetDate)
 */
export const getRateLimitStatus = async (userId) => {
  const response = await api.get(`/gemini/rate-limit/${userId}`);
  return response.data;
};

/**
 * Get marketplace insights and statistics
 * @returns {Promise} Marketplace analytics data
 */
export const getMarketplaceInsights = async () => {
  const response = await api.get("/gemini/insights");
  return response.data;
};

/**
 * Get cheapest products, optionally filtered by category
 * @param {string} category - Optional category filter
 * @param {number} limit - Number of results (default 10)
 * @returns {Promise} Array of cheapest products
 */
export const getCheapProducts = async (category = null, limit = 10) => {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  params.append("limit", limit);

  const response = await api.get(`/gemini/products/cheap?${params.toString()}`);
  return response.data;
};

/**
 * Smart search for products
 * @param {Object} searchParams - { q, category, minPrice, maxPrice, region }
 * @returns {Promise} Array of matching products
 */
export const searchProducts = async (searchParams) => {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  const response = await api.get(`/gemini/products/search?${params.toString()}`);
  return response.data;
};

/**
 * Get all farmers with product counts
 * @returns {Promise} Array of farmers
 */
export const getAllFarmers = async () => {
  const response = await api.get("/gemini/farmers");
  return response.data;
};

/**
 * Get specific farmer info with their products
 * @param {string} farmerId - Farmer's ID
 * @returns {Promise} Farmer info with products
 */
export const getFarmerInfo = async (farmerId) => {
  const response = await api.get(`/gemini/farmers/${farmerId}`);
  return response.data;
};

/**
 * Get AI-suggested price for a product
 * @param {Object} productData - { title, category, region, quantity }
 * @returns {Promise} AI price suggestion
 */
export const getAIPriceSuggestion = async (productData) => {
  const prompt = `Suggest a fair market price for ${productData.title} in ${productData.category} category from ${productData.region}. Quantity: ${productData.quantity}. Give only the price in PKR.`;
  const response = await askMarketplaceAI(prompt);
  return response;
};

/**
 * Get farming tips from AI
 * @param {string} question - Farming-related question
 * @returns {Promise} AI farming tips
 */
export const getFarmingTips = async (question) => {
  const prompt = `As a farming expert, answer this question: ${question}`;
  const response = await askAI(prompt);
  return response;
};

/**
 * Get product quality check tips
 * @param {string} productName - Name of the product
 * @returns {Promise} Quality check tips
 */
export const getQualityCheckTips = async (productName) => {
  const prompt = `How to check quality of ${productName}? Give brief tips for buyers.`;
  const response = await askAI(prompt);
  return response;
};

/**
 * Get market insights
 * @param {string} category - Product category
 * @returns {Promise} Market insights
 */
export const getMarketInsights = async (category) => {
  const prompt = `Give market insights for ${category} products in Pakistan farmer marketplace.`;
  const response = await askMarketplaceAI(prompt);
  return response;
};

