// routes/geminiRoute.js
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import {
  askMarketplaceAI,
  getMarketplaceInsights,
  getCheapestProducts,
  searchProducts,
  getFarmerInfo,
  getAllFarmers,
  getRateLimitStatus
} from "../controllers/aiController.js";

dotenv.config();
const router = express.Router();

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ============================================
// NEW: Marketplace-Aware AI Endpoints
// ============================================

// POST /api/gemini/marketplace - AI with full database context
router.post("/marketplace", askMarketplaceAI);

// GET /api/gemini/insights - Marketplace statistics and analytics
router.get("/insights", getMarketplaceInsights);

// GET /api/gemini/products/cheap - Cheapest products (optional category filter)
router.get("/products/cheap", getCheapestProducts);

// GET /api/gemini/products/search - Smart product search
router.get("/products/search", searchProducts);

// GET /api/gemini/farmers - All farmers with product counts
router.get("/farmers", getAllFarmers);

// GET /api/gemini/farmers/:id - Specific farmer info with products
router.get("/farmers/:id", getFarmerInfo);

// GET /api/gemini/rate-limit/:userId - Check user's remaining AI requests
router.get("/rate-limit/:userId", getRateLimitStatus);

// ============================================
// Original: General Farming AI (no DB access)
// ============================================

// POST /api/gemini/ask - General farming advice
router.post("/ask", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt required" });
    }

    // System context message for Gemini
    const systemContext = `You are a helpful AI assistant for a Farmer Marketplace platform. 
You help farmers, buyers, and sellers with:
- Market prices and pricing strategies
- Product quality checking and farming best practices
- Crop management and harvest timing
- Product listings and marketplace navigation
- General farming and agricultural advice
- Market trends and seasonal insights

Provide practical, concise, and friendly responses. Use emojis when appropriate to make responses engaging.
If asked about something completely unrelated to farming/marketplace, politely redirect to your expertise areas.`;

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content with context
    const fullPrompt = `${systemContext}\n\nUser Question: ${prompt}\n\nAssistant:`;
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini Response:", text);

    res.json({ response: text });

  } catch (err) {
    console.error("Gemini API Error:", err.message);

    // Better error handling
    if (err.message?.includes("API key") || err.message?.includes("API_KEY")) {
      return res.status(500).json({
        error: "API configuration error. Please check the API key.",
        response: "I'm having trouble connecting to my AI service. Please try again later! 🤖"
      });
    }

    res.status(500).json({
      error: "Failed to get AI response. Please try again.",
      response: "I'm experiencing technical difficulties. Please try again in a moment! 😊"
    });
  }
});

export default router;
