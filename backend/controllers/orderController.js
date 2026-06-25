// controllers/orderController.js
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

// 📦 Create a new order
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      deliveryFee,
      tax,
      total,
      deliveryNote,
    } = req.body;

    // Validate required fields
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order" });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city || !shippingAddress.province) {
      return res.status(400).json({ success: false, message: "Complete shipping address required" });
    }

    // Create order
    const order = await Order.create({
      userId: req.user._id,
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || "",
      })),
      shippingAddress,
      paymentMethod: paymentMethod || "cod",
      subtotal,
      deliveryFee: deliveryFee || 0,
      tax: tax || 0,
      total,
      deliveryNote: deliveryNote || "",
      status: "pending",
    });

    // Clear cart after successful order
    try {
      await Cart.findOneAndDelete({ userId: req.user._id });
    } catch (cartErr) {
      console.error("Cart clear error (non-critical):", cartErr);
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      data: { order },
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create order",
    });
  }
};

// 📋 Get my orders (for logged-in user)
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

// 🔍 Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("userId", "name email");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Only allow the order owner to view
    if (order.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to view this order" });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

// 🔄 Update order status (for farmers/admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};
