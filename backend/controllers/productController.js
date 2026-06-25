import fs from "fs";
import path from "path";
import Product from "../models/Product.js";

/* ================================
   ➕ Add Product (Only for Farmers)
================================ */
export const addProduct = async (req, res) => {
  try {
    const { title, description, price, quantity, category, region } = req.body;

    // Ensure only farmers can add products
    if (req.user.role !== "farmer") {
      return res.status(403).json({ message: "Only farmers can add products" });
    }

    // Ensure main image is provided
    if (!req.files || !req.files.mainImage) {
      return res.status(400).json({ message: "Main image is required" });
    }

    // Extract image paths
    const mainImage = req.files.mainImage[0].path;
    const otherImages = req.files.otherImages
      ? req.files.otherImages.map((file) => file.path)
      : [];

    // Create new product
    const product = await Product.create({
      farmerId: req.user._id,
      title,
      description,
      price,
      quantity,
      category,
      region,
      mainImage,
      otherImages,
    });

    res.status(201).json({
      message: "✅ Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/* ================================
   📦 Get All Products (Public)
================================ */
/* ================================
   📋 Get All Products
================================ */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("farmerId", "name contact location photo")
      .sort({ createdAt: -1 });

    // Filter out products whose farmer was deleted (farmerId becomes null after populate)
    const validProducts = products.filter(p => p.farmerId !== null);

    res.status(200).json({
      success: true,
      count: validProducts.length,
      data: { products: validProducts }
    });
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

/* ================================
   🔍 Get Single Product by ID
================================ */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "farmerId",
      "name contact location photo"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      data: { product }
    });
  } catch (error) {
    console.error("Get Product By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

/* ================================
   ✏️ Update Product (Only Owner)
================================ */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ensure only the farmer who added can edit
    if (product.farmerId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this product" });
    }

    // Update main image if provided
    if (req.files && req.files.mainImage) {
      // delete old main image
      if (product.mainImage && fs.existsSync(path.resolve(product.mainImage))) {
        fs.unlinkSync(path.resolve(product.mainImage));
      }
      product.mainImage = req.files.mainImage[0].path;
    }

    // Update other images if provided
    if (req.files && req.files.otherImages) {
      // delete old other images
      if (product.otherImages && product.otherImages.length > 0) {
        product.otherImages.forEach((imgPath) => {
          const filePath = path.resolve(imgPath);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }
      product.otherImages = req.files.otherImages.map((file) => file.path);
    }

    // Update other fields
    const { title, description, price, quantity, category, region } = req.body;

    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = price;
    if (quantity) product.quantity = quantity;
    if (category) product.category = category;
    if (region) product.region = region;

    await product.save();

    res.status(200).json({
      message: "✅ Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/* ================================
   🗑️ Delete Product (Only Owner)
================================ */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ensure only owner can delete
    if (product.farmerId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this product" });
    }

    // Delete main image from server
    if (product.mainImage) {
      const mainImagePath = path.resolve(product.mainImage);
      if (fs.existsSync(mainImagePath)) {
        fs.unlinkSync(mainImagePath);
      }
    }

    // Delete other images
    if (product.otherImages && product.otherImages.length > 0) {
      product.otherImages.forEach((imgPath) => {
        const filePath = path.resolve(imgPath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    // Delete product record from MongoDB Atlas
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "✅ Product and associated images deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
