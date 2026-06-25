import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    aiSuggestedPrice: {
      type: Number,
      default: null,
    },

    quantity: {
      type: Number,
      required: true,
    },

    // 🏷️ Predefined categories
    category: {
      type: String,
      enum: [
        "Vegetables",
        "Fruits",
        "Grains",
        "Dairy",
        "Pulses",
        "Spices",
        "Seeds",
        "Livestock",
        "Others",
      ],
      required: true,
    },

    region: {
      type: String,
      default: "",
    },

    // 🖼️ Images
    mainImage: {
      type: String,
      required: true, // every product must have a main image
    },

    otherImages: [
      {
        type: String, // URLs or file paths
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
