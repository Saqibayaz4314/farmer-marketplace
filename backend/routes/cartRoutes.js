import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  updateCartItem,
} from "../controllers/cartController.js";

const router = express.Router();

// POST — Add item to cart
router.post("/add", addToCart);

// GET — Get user's cart
router.get("/:userId", getCart);

// PUT — Update cart item quantity
router.put("/update", updateCartItem);

// DELETE — Remove item
router.delete("/remove", removeFromCart);

// DELETE — Clear all items
router.delete("/clear", clearCart);

export default router;
