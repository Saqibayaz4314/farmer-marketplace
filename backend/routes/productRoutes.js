import express from "express";
import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadProductImages } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Add product (farmer only)
router.post("/", protect, uploadProductImages, addProduct);

// Get all products
router.get("/", getProducts);

// Get single product
router.get("/:id", getProductById);

// Update product (farmer only)
router.put("/:id", protect, uploadProductImages, updateProduct);

// Delete product (farmer only)
router.delete("/:id", protect, deleteProduct);

export default router;
