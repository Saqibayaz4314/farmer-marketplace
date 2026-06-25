// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";

import path from "path";
import { fileURLToPath } from "url";

// Routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import geminiRoute from "./routes/geminiRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

// Socket handler
import { initChatSocket } from "./sockets/chatSocket.js";

// Email verification
import { verifyEmailConnection } from "./utils/emailService.js";

// Load environment variables
dotenv.config();

// Initialize app and server
const app = express();
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Ejs setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration for Express
app.use(cors({
  origin: "http://localhost:5173", // Frontend origin
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// gemini api setup
app.use("/api/gemini", geminiRoute);

// EJS test route
app.get("/test-gemini", (req, res) => {
  res.render("index", { response: null }); // default null
});


app.post("/test-gemini", async (req, res) => {
  const { prompt } = req.body;
  try {
    const aiResponse = await fetch("http://localhost:5000/api/gemini/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await aiResponse.json();
    res.render("index", { response: data.response });
  } catch (err) {
    console.error(err);
    res.render("index", { response: "Error occurred!" });
  }
});


// Make io accessible to all routes/controllers
app.set("io", io);


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/gemini", geminiRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("🌾 Farmer-to-Buyer Marketplace API is running...");
});

// Connect to MongoDB Atlas
connectDB();

// Verify SMTP email connection
verifyEmailConnection();

// Initialize chat socket handlers
initChatSocket(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
