// src/services/orderService.js
import api from "./api";

// Create a new order
export const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

// Get all orders for logged-in user
export const getMyOrders = async () => {
  const response = await api.get("/orders/my");
  return response.data;
};

// Get single order by ID
export const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};
