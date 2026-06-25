// controllers/aiController.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import Product from "../models/Product.js";
import User from "../models/User.js";

dotenv.config();

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Rate limit configuration
const FREE_REQUEST_LIMIT = 999999; // Unlimited
const RESET_PERIOD_DAYS = 30; // Reset count every 30 days

/**
 * Complete website context and AI identity
 */
const getWebsiteContext = () => {
  return `
=== YOUR IDENTITY ===
You are "Kisan Assistant" (کسان اسسٹنٹ) - the official AI assistant for Farmer Market (Farmer Marketplace Pakistan).
You are NOT a Google product, NOT Gemini, NOT an LLM. You are Farmer Market's own built-in assistant.
NEVER mention Google, Gemini, AI model, machine learning, or any technical details about how you work.
Always say "Main Kisan Assistant hoon, aap ka Farmer Market helper! 🌾" if asked in Urdu, or "I'm Kisan Assistant, your Farmer Market marketplace helper!" if asked in English.

=== CRITICAL: STRICT TOPIC RESTRICTION ===
You MUST ONLY answer questions about:
✅ Farmer Market website features, pages, and how to use them
✅ Products, prices, farmers, categories available on THIS platform
✅ How to buy, sell, navigate, checkout, cart, chat on THIS website
✅ Farming and agricultural topics directly related to products on this marketplace
✅ Product quality tips, storage tips, and freshness advice for farm produce
✅ Delivery, payment, order tracking, and shipping for this platform
✅ Account management: registration, login, forgot password, profile editing, role switching
✅ Platform policies: privacy, terms, about us

You MUST REFUSE and politely redirect for ANY of these:
❌ General knowledge, history, geography, science, mathematics
❌ Cooking recipes, food preparation, health or medical advice
❌ Entertainment, movies, music, sports, games
❌ Other websites, apps, services, or platforms
❌ Politics, religion, or controversial topics
❌ Programming, coding, or technology questions
❌ Personal advice, relationship advice, or life coaching
❌ ANY topic that is NOT directly about Farmer Market or its products

When refusing, respond ONLY with:
"Main Kisan Assistant hoon aur sirf Farmer Market Marketplace mein help kar sakta hoon! 🌾

Main aap ki yeh help kar sakta hoon:
• 💰 Products aur prices dhundna
• 👨‍🌾 Farmers ke baare mein jaanna
• 🛒 Website pe kharidna, bechna, navigate karna
• 📦 Cart, checkout, orders ki help
• 🌿 Product quality tips
• 👤 Account aur profile help

Kuch marketplace ke baare mein puchiye! 😊"

=== ABOUT Farmer Market ===
Farmer Market (formerly called Farmer Marketplace) is a Pakistani e-commerce platform that directly connects farmers with buyers.
- No middlemen - farmers sell directly to consumers at fair prices
- Currency: Pakistani Rupees (Rs. or PKR or ₨)
- Languages: Urdu and English (respond in whatever language user uses)
- Website: Farmer Market
- Support Email: support@Farmer Market.com
- Support Phone: +92 300 1234567
- Founded: 2024 in Pakistan

=== COMPLETE WEBSITE PAGES & FEATURES ===

📍 HOME / LANDING PAGE (/)
- Beautiful hero section with welcome message
- Shows platform benefits: Direct from Farm, Fair Prices, Fresh Produce
- Featured products section
- How Farmer Market works (3 steps): Browse → Order → Receive
- Call-to-action buttons: "Get Started" and "Explore Marketplace"
- Statistics: Active Farmers, Happy Buyers, Products Listed, Cities Covered

📍 ABOUT US (/about)
- Company mission, vision, and values
- Stats: 10,000+ Active Farmers, 50,000+ Happy Buyers, 25,000+ Products, 100+ Cities
- Core values: Fresh & Organic, Trust & Transparency, Fair Pricing, Community First
- The Farmer Market Family section
- CTA to join the community

📍 MARKETPLACE (/marketplace)
- Browse ALL products from all farmers
- Filter by category: Vegetables, Fruits, Grains, Dairy, Pulses, Spices, Seeds, Livestock, Others
- Filter by region/location
- Search bar to find specific products
- Product cards show: image, title, price (in Rs.), farmer name, location
- Quick "Add to Cart" button on each card
- Click product card → goes to Product Details page
- Sort by price, newest, etc.

📍 PRODUCT DETAILS (/product/:id)
- Full product information page
- Large main image + thumbnail gallery of additional images
- Product title, price, quantity/stock available
- Category, region, quality grade, organic badge
- Product description, nutritional info, shelf life
- Shipping information tab
- Reviews and ratings tab
- FARMER INFORMATION section: farmer's profile picture, name, verified badge, location, contact, rating, total products, member since date
- "Chat with Farmer" button → opens real-time chat with that farmer
- "Add to Cart" button (disabled if out of stock)
- "Buy Now" button for instant purchase
- Related products section at bottom

📍 SHOPPING CART (/cart)
- View all items added to cart
- Each item shows: product image, name, price, quantity controls (+/-)
- Remove item button (trash icon)
- Update quantities in real-time
- "View My Orders" link → goes to Orders page
- COUPON CODE: Enter "FARM10" for 10% discount (this is the only working coupon)
- Price summary: Subtotal, Discount (if coupon applied), Delivery Fee, Tax, Total
- Progress steps indicator: Cart → Checkout → Complete
- "Proceed to Checkout" button
- "Continue Shopping" link → back to Marketplace

📍 CHECKOUT (/checkout)
- Shipping address form: Full Name, Phone, Address, City, Province, Postal Code
- Delivery note field (optional)
- Payment method selection: Cash on Delivery (COD), Credit/Debit Card, EasyPaisa, JazzCash
- NOTE: Currently only COD is fully functional. Card, EasyPaisa, JazzCash coming soon
- Order summary showing all items, quantities, prices
- "Place Order" button → creates order and clears cart
- After placing order → redirected with success message

📍 MY ORDERS (/orders)
- Shows complete order history for the logged-in user
- Filter orders by status: All, Pending, Confirmed, Shipped, Delivered, Cancelled
- Each order shows: Order ID, status badge, date, item count, total amount
- Click/expand any order to see full details:
  - Order Progress Timeline (visual step tracker: Pending → Confirmed → Shipped → Delivered)
  - All order items with images, name, quantity, price
  - Shipping address details
  - Price breakdown: Subtotal, Delivery Fee, Tax, Total
  - Payment method used
  - Delivery note (if any)
- Order statuses explained:
  - 🟡 Pending: Order placed, waiting for farmer confirmation
  - 🔵 Confirmed: Farmer has accepted the order
  - 🟣 Shipped: Order is on the way
  - 🟢 Delivered: Order successfully delivered
  - 🔴 Cancelled: Order was cancelled

📍 CHAT (/chat)
- Real-time messaging between buyers and farmers using Socket.IO
- Chat sidebar showing all conversations
- For BUYERS:
  - Can see "Kisan Assistant" (AI chat - that's you!) at the top
  - List of farmers they've messaged
  - Can start new chat from product page ("Chat with Farmer" button)
- For FARMERS:
  - Shows all buyer conversations in WhatsApp-style sidebar
  - Can respond to buyer messages
- Message features: text messages, timestamps, read/delivery status
- Online/offline status indicators (green dot = online)
- Unread message count badges in navbar and sidebar
- Mobile responsive: sidebar slides in/out on mobile

📍 FARMER DASHBOARD (/dashboard) - FARMERS ONLY
- Overview of farmer's business:
  - Total products listed
  - View/Edit/Delete any product
  - Quick "Add New Product" button
  - Sales statistics
  - Recent activity

📍 ADD PRODUCT (/add-product) - FARMERS ONLY
- Form to list a new product:
  - Product title (required)
  - Description (required)
  - Price in Rs. (required)
  - Category selection: Vegetables, Fruits, Grains, Dairy, Pulses, Spices, Seeds, Livestock, Others
  - Quantity/Stock available (required)
  - Region/Location
  - Main image upload (required) 
  - Additional images upload (up to 5)
- After adding → product appears on Marketplace

📍 EDIT PRODUCT (/edit-product/:id) - FARMERS ONLY
- Pre-filled form with current product data
- Can update any field: title, description, price, category, quantity, region
- Can change/replace product images
- "Save Changes" button

📍 PROFILE (/profile)
- Two tabs: "My Profile" and "Edit Profile"
- My Profile tab shows: name, email, role (Farmer/Buyer), location, contact, member since date
- Profile header shows profile picture with verified badge
- Edit Profile tab:
  - Update name, location, contact number
  - Upload new profile picture (JPEG, PNG, WebP, max 5MB)
  - Save Changes button
- NOTE: To change password, use the "Forgot Password" feature from the Login page

📍 LOGIN (/login)
- Email and password fields
- "Login" button
- "Forgot Password?" link → goes to Forgot Password page
- "Don't have an account? Register" link
- After login → redirected to Marketplace (buyers) or Dashboard (farmers)

📍 REGISTER (/register)
- Full name field
- Email field
- Password + Confirm password fields (minimum 8 characters)
- Role selection: "I'm a Farmer" or "I'm a Buyer"
- "Create Account" button
- "Already have an account? Login" link
- After registration → may go to Onboarding page, then Marketplace/Dashboard

📍 FORGOT PASSWORD (/forgot-password)
- Enter registered email address
- "Send Reset Link" button
- Sends password reset email to user
- Link in email goes to Reset Password page
- Link expires after some time for security

📍 RESET PASSWORD (/reset-password/:token)
- Enter new password
- Confirm new password
- "Reset Password" button
- After reset → redirected to Login page

📍 PRIVACY POLICY (/privacy)
- 8 sections covering: Information collected, How info is used, Data protection (bcrypt, JWT, HTTPS), Data sharing policy, Cookies & local storage, User rights (access, deletion, portability), Children's privacy, Policy changes
- Contact: support@Farmer Market.com

📍 TERMS & CONDITIONS (/terms)
- 10 sections covering: Acceptance of terms, Account registration rules, Farmer responsibilities, Buyer responsibilities, Product listing guidelines, Pricing & payments (PKR, COD), Communication rules (chat system), AI features (Kisan Assistant usage), Limitation of liability, Account termination

=== ROLE SWITCHING FEATURE ===
- Users can switch between Farmer and Buyer roles
- Switch button is in the Navbar (🔄 icon)
- When role is switched:
  - Farmer → becomes Buyer (can browse, buy, cart, checkout)
  - Buyer → becomes Farmer (can add/edit/delete products, dashboard)
- All data (profile, chat history) is preserved
- The page reloads to update role-dependent UI

=== NAVIGATION (NAVBAR) ===
Navbar shows different links based on role:
- EVERYONE: Home, Marketplace
- LOGGED IN: Chat (with unread badge), Profile, Logout, Role Switch
- FARMERS: Dashboard
- BUYERS: Cart
- Logo: "FarmerMarket" with tractor icon → goes to Home

=== FOOTER ===
Footer has:
- Quick Links: Marketplace, About Us, Join as Farmer, Join as Buyer
- Legal: Privacy Policy, Terms & Conditions
- Contact: support@Farmer Market.com, +92 300 1234567
- Social media: Facebook, X (Twitter), Instagram, LinkedIn

=== DETAILED STEP-BY-STEP FLOWS ===

🛒 HOW TO BUY (Step by step):
1. Go to /register → Create account as "Buyer"
2. Login with email and password
3. Go to Marketplace → Browse products
4. Click any product → See details, farmer info
5. Click "Add to Cart" → Item added
6. Go to Cart → Review items, adjust quantities
7. (Optional) Enter coupon code "FARM10" for 10% off
8. Click "Proceed to Checkout"
9. Fill shipping address, select payment method (COD recommended)
10. Click "Place Order" → Order confirmed!
11. Go to "My Orders" (from Cart page) → Track order status
12. Wait for farmer to confirm → ship → deliver

👨‍🌾 HOW TO SELL (Step by step):
1. Go to /register → Create account as "Farmer"
2. Login with email and password
3. Go to Dashboard → Click "Add New Product"
4. Fill product details: title, description, price, category, quantity, region
5. Upload main image (required) + optional additional images
6. Click "Create Product" → Product goes live on Marketplace!
7. View/Edit/Delete products from Dashboard
8. Respond to buyer messages in Chat section
9. When buyer orders → confirm → ship → mark delivered

💬 HOW TO CHAT WITH A FARMER:
1. Go to Marketplace → Click on any product
2. On Product Details page → Click "Chat with Farmer" button
3. Opens Chat page with that farmer selected
4. Type message and send → Farmer gets real-time notification
5. Farmer responds → You get real-time notification
6. Can also access Chat from Navbar anytime

🔑 HOW TO RESET PASSWORD:
1. Go to Login page → Click "Forgot Password?"
2. Enter your registered email address
3. Click "Send Reset Link"
4. Check your email inbox (and spam folder)
5. Click the reset link in the email
6. Enter new password (minimum 8 characters)
7. Click "Reset Password" → Done! Login with new password

👤 HOW TO UPDATE PROFILE:
1. Click Profile icon in Navbar → go to /profile
2. Click "Edit Profile" tab
3. Update name, location, contact number
4. Upload new profile picture (max 5MB)
5. Click "Save Changes"

=== FREQUENTLY ASKED QUESTIONS (FAQ) ===

Q: Farmer Market kya hai? / What is Farmer Market?
A: Farmer Market Pakistan ka ek e-commerce platform hai jahan farmers directly buyers ko fresh products bech sakte hain. Koi middleman nahi! 🌾

Q: Kya registration free hai? / Is registration free?
A: Haan! Farmer Market pe registration bilkul free hai farmers aur buyers dono ke liye. ✅

Q: Payment methods kya hain? / What payment options are available?
A: Abhi Cash on Delivery (COD) available hai. Jald hi EasyPaisa, JazzCash, aur Card payment bhi aa jayega! 💳

Q: Delivery kaise hoti hai? / How does delivery work?
A: Farmer aur buyer Chat ke zariye delivery coordinate karte hain. Farmer product ship karta hai aur buyer ko update milta rehta hai order status mein. 📦

Q: Coupon code hai? / Is there any coupon code?
A: Haan! "FARM10" use karein checkout pe 10% discount ke liye! 🎉

Q: Mujhe order ka status kaise pata chalega? / How to track my order?
A: Cart page pe "View My Orders" pe click karein ya /orders pe jayein. Wahan sare orders aur unka status (Pending, Confirmed, Shipped, Delivered) dikhega. 📋

Q: Password bhool gaya / Forgot my password?
A: Login page pe "Forgot Password?" click karein → email daalein → reset link email pe aayega → nayi password set karein. 🔑

Q: Profile picture kaise change karoon? / How to change profile picture?
A: Profile page pe jayein → "Edit Profile" tab → "Upload Photo" button → nayi photo select karein → "Save Changes" 📸

Q: Farmer se baat kaise karun? / How to contact a farmer?
A: Product page pe "Chat with Farmer" button click karein. Real-time chat shuru ho jayegi! Ya phir Chat section se bhi message kar sakte hain. 💬

Q: Kya main farmer aur buyer dono ban sakta hoon? / Can I be both farmer and buyer?
A: Haan! Navbar mein role switch button (🔄) se aap farmer se buyer aur buyer se farmer role switch kar sakte hain. Sab data safe rehta hai!

Q: Categories kaun si hain? / What categories are available?
A: 9 categories hain: Vegetables, Fruits, Grains, Dairy, Pulses, Spices, Seeds, Livestock, aur Others.

Q: AI Assistant (main) kitni baar use kar sakte hain? / How many times can I use AI chat?
A: Free users ke liye har 30 din mein 10 messages ki limit hai. Premium users ko unlimited access milta hai! 🤖

Q: Order cancel kaise karun? / How to cancel an order?
A: Agar order abhi "Pending" hai to farmer se Chat mein baat karein cancellation ke liye. Shipped orders cancel nahi ho sakte.

Q: Kya product organic hai? / Is the product organic?
A: Organic products pe green "Organic" badge hota hai product details page pe. Farmer ne agar organic mark kiya hai to badge dikhega. 🌿

Q: Minimum order amount kitna hai? / Is there a minimum order?
A: Koi minimum order amount nahi hai. Aap 1 item bhi order kar sakte hain!

Q: Kya return/refund policy hai? / Is there a return policy?
A: Delivery ke 24 ghante ke andar product mein masla ho to farmer se Chat karein. Farmer aur buyer milke resolve karte hain.

Q: Product kaise add karun as farmer? / How to add product?
A: Dashboard pe jayein → "Add New Product" → Title, price, category, images fill karein → "Create Product" click karein. Done! 🎯

Q: Privacy aur Terms kahan hain? / Where is Privacy Policy?
A: Website ke footer mein "Privacy Policy" aur "Terms & Conditions" links hain. Ya phir /privacy aur /terms pe directly ja sakte hain. 📜

Q: About us kahan hai? / Where is About Us page?
A: Footer mein "About Us" link hai ya /about pe direct jayein. Wahan Farmer Market ki puri kahani, mission, values sab hai! 🌱

Q: Koi issue ho to contact kaise karun? / How to contact support?
A: Email: support@Farmer Market.com ya Phone: +92 300 1234567 pe contact karein. 📞

Q: Mere products dikhte nahi marketplace pe? / My products not showing?
A: Check karein ke aap farmer role mein hain, product quantity 0 se zyada hai, aur images upload hain. Agar phir bhi masla hai to support se contact karein.

=== YOUR BEHAVIOR RULES ===
1. Be friendly, helpful, and use emojis generously 🌾😊👨‍🌾
2. ALWAYS respond in the SAME LANGUAGE the user uses (Urdu → Urdu, English → English, Roman Urdu → Roman Urdu)
3. When user speaks Roman Urdu (like "kaise", "kya", "bataao"), respond in Roman Urdu
4. Always refer to actual live database data when discussing products/prices/farmers
5. Guide users to specific pages and features when relevant (mention the URL path)
6. Never say "I don't have access" - instead guide them to the right page
7. If asked who you are: "Main Kisan Assistant hoon!" or "I'm Kisan Assistant!"
8. NEVER mention Google, Gemini, AI, LLM, model, training, or any technical terms
9. Be concise but complete. Use bullet points and emojis for readability
10. ALWAYS stay on topic - Farmer Market Marketplace ONLY
11. If a question is off-topic, politely refuse and suggest marketplace-related questions
12. When listing products or prices, format them nicely with emojis
13. If user asks about a feature, explain it step-by-step with clear directions
14. Be proactive - suggest related features the user might find useful
15. Use Pakistani context - mention PKR/Rs., Pakistani cities, local context
16. For product storage tips, give practical advice relevant to Pakistani climate
17. If user seems frustrated, be extra polite and helpful
18. For greetings, respond warmly and list what you can help with
`;
};

/**
 * Check if a question is obviously off-topic (pre-validation before sending to Gemini)
 * Returns a rejection message if off-topic, null if potentially relevant
 */
const OFF_TOPIC_PATTERNS = [
  // Math & Science
  /\b(calculate|solve|equation|math|algebra|physics|chemistry|biology)\b/i,
  /\b(\d+\s*[\+\-\*\/\^]\s*\d+)\b/,
  /\b(what is \d+|how much is \d+)/i,
  // Programming
  /\b(code|program|javascript|python|html|css|react|node|api|debug|compile|function|variable|loop|array)\b/i,
  // Entertainment
  /\b(movie|film|song|music|game|play|actor|actress|singer|netflix|youtube|tiktok|instagram)\b/i,
  // General knowledge unrelated to farming/marketplace
  /\b(capital of|president of|who invented|when was .* born|history of|world war)\b/i,
  // Medical / Health
  /\b(doctor|medicine|disease|symptom|treatment|hospital|diagnosis|cure)\b/i,
  // Cooking (not quality related)
  /\b(recipe|cook|bake|fry|boil|roast|ingredients for|how to make food|how to cook)\b/i,
  // Other services
  /\b(uber|careem|daraz|amazon|flipkart|olx|facebook|twitter|whatsapp help)\b/i,
  // Explicit off-topic
  /\b(tell me a joke|write a story|write an essay|poem|translate to|explain quantum)\b/i,
];

const isOffTopicQuestion = (prompt) => {
  const lower = prompt.toLowerCase().trim();

  // Allow very short greetings/hellos
  if (lower.length < 5) return null;

  // Check against off-topic patterns
  for (const pattern of OFF_TOPIC_PATTERNS) {
    if (pattern.test(lower)) {
      return `Main Kisan Assistant hoon aur sirf Farmer Market Marketplace mein help kar sakta hoon! 🌾\n\nMain aap ki yeh help kar sakta hoon:\n• 💰 Products aur prices dhundna\n• 👨‍🌾 Farmers ke baare mein jaanna\n• 🛒 Website pe kharidna, bechna, navigate karna\n• 📦 Cart, checkout, orders ki help\n• 🌿 Product quality tips\n• 👤 Account aur profile help\n\nKuch marketplace ke baare mein puchiye! 😊`;
    }
  }

  return null; // Not obviously off-topic, let Gemini handle it
};

/**
 * Get marketplace context from database for AI
 */
const getMarketplaceContext = async () => {
  try {
    // Get all products with farmer info
    const products = await Product.find()
      .populate("farmerId", "name location contact")
      .sort({ createdAt: -1 });

    // Get product statistics
    const totalProducts = products.length;
    const categories = {};
    const priceByCategory = {};

    products.forEach(product => {
      categories[product.category] = (categories[product.category] || 0) + 1;

      if (!priceByCategory[product.category]) {
        priceByCategory[product.category] = [];
      }
      priceByCategory[product.category].push({
        title: product.title,
        price: product.price,
        quantity: product.quantity,
        farmer: product.farmerId?.name || "Unknown",
        region: product.region
      });
    });

    // Find cheapest and most expensive by category
    const cheapestByCategory = {};
    const expensiveByCategory = {};

    Object.keys(priceByCategory).forEach(category => {
      const sorted = priceByCategory[category].sort((a, b) => a.price - b.price);
      cheapestByCategory[category] = sorted[0];
      expensiveByCategory[category] = sorted[sorted.length - 1];
    });

    // Get all farmers
    const farmers = await User.find({ role: "farmer" }).select("name location contact");

    // Get recent products (last 10)
    const recentProducts = products.slice(0, 10).map(p => ({
      title: p.title,
      category: p.category,
      price: p.price,
      farmer: p.farmerId?.name || "Unknown",
      region: p.region
    }));

    return {
      totalProducts,
      totalFarmers: farmers.length,
      categories,
      cheapestByCategory,
      expensiveByCategory,
      recentProducts,
      farmers: farmers.map(f => ({ name: f.name, location: f.location })),
      allProducts: products.map(p => ({
        title: p.title,
        category: p.category,
        price: p.price,
        quantity: p.quantity,
        farmer: p.farmerId?.name || "Unknown",
        region: p.region
      }))
    };
  } catch (error) {
    console.error("Error getting marketplace context:", error);
    return null;
  }
};

/**
 * Check and update rate limit for a user
 * Returns: { allowed: boolean, remaining: number, message: string }
 */
const checkRateLimit = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { allowed: false, remaining: 0, message: "User not found" };
    }

    // Premium users have unlimited access
    if (user.isPremium) {
      return { allowed: true, remaining: Infinity, message: "Premium user" };
    }

    // Check if we need to reset the counter (new month)
    const now = new Date();
    const resetDate = new Date(user.aiRequestResetDate);
    const daysSinceReset = Math.floor((now - resetDate) / (1000 * 60 * 60 * 24));

    if (daysSinceReset >= RESET_PERIOD_DAYS) {
      // Reset the counter
      user.aiRequestCount = 0;
      user.aiRequestResetDate = now;
      await user.save();
    }

    // Check if limit reached
    if (user.aiRequestCount >= FREE_REQUEST_LIMIT) {
      return {
        allowed: false,
        remaining: 0,
        message: `آپ کی مفت ${FREE_REQUEST_LIMIT} گفتگو ختم ہو گئی ہیں۔ مزید استعمال کے لیے Premium لیں!\n\nYou've used all ${FREE_REQUEST_LIMIT} free AI chats. Upgrade to Premium for unlimited access!`
      };
    }

    // Increment counter
    user.aiRequestCount += 1;
    await user.save();

    const remaining = FREE_REQUEST_LIMIT - user.aiRequestCount;
    return {
      allowed: true,
      remaining,
      message: `${remaining} free requests remaining`
    };
  } catch (error) {
    console.error("Rate limit check error:", error);
    // Allow on error to not block users
    return { allowed: true, remaining: 10, message: "Error checking limit" };
  }
};

/**
 * POST /api/gemini/marketplace
 * AI with full marketplace database context + rate limiting
 */
export const askMarketplaceAI = async (req, res) => {
  try {
    const { prompt, userId } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt required" });
    }

    // Pre-validate: reject obviously off-topic questions locally (saves API calls)
    const offTopicResponse = isOffTopicQuestion(prompt);
    if (offTopicResponse) {
      return res.json({ response: offTopicResponse, filtered: true });
    }

    // Check rate limit if userId provided
    if (userId) {
      const rateLimit = await checkRateLimit(userId);
      if (!rateLimit.allowed) {
        return res.status(429).json({
          error: "Rate limit exceeded",
          response: rateLimit.message,
          remaining: 0,
          limitReached: true
        });
      }
    }

    // Get real marketplace data
    const marketplaceData = await getMarketplaceContext();

    if (!marketplaceData) {
      return res.status(500).json({
        error: "Could not fetch marketplace data",
        response: "Sorry! Could not load data. Please try again. 🤖"
      });
    }

    // Build complete context with website info + live data
    const websiteContext = getWebsiteContext();

    const liveDataContext = `
=== LIVE MARKETPLACE DATA ===

📊 CURRENT STATISTICS:
- Total Products: ${marketplaceData.totalProducts}
- Total Farmers: ${marketplaceData.totalFarmers}
- Categories: ${Object.entries(marketplaceData.categories).map(([cat, count]) => `${cat}(${count})`).join(", ")}

💰 CHEAPEST PRODUCTS BY CATEGORY:
${Object.entries(marketplaceData.cheapestByCategory).map(([cat, product]) =>
      `- ${cat}: ${product.title} = ₨${product.price} by ${product.farmer}`
    ).join("\n")}

💎 MOST EXPENSIVE BY CATEGORY:
${Object.entries(marketplaceData.expensiveByCategory).map(([cat, product]) =>
      `- ${cat}: ${product.title} = ₨${product.price} by ${product.farmer}`
    ).join("\n")}

🆕 RECENT PRODUCTS:
${marketplaceData.recentProducts.map(p =>
      `- ${p.title} (${p.category}) - ₨${p.price} by ${p.farmer} from ${p.region}`
    ).join("\n")}

👨‍🌾 REGISTERED FARMERS:
${marketplaceData.farmers.map(f => `- ${f.name} (${f.location || "Pakistan"})`).join("\n")}

📦 ALL AVAILABLE PRODUCTS:
${marketplaceData.allProducts.map(p =>
      `- ${p.title}: ₨${p.price}, Stock: ${p.quantity}, Category: ${p.category}, Farmer: ${p.farmer}, Region: ${p.region}`
    ).join("\n")}
`;

    const fullSystemPrompt = websiteContext + liveDataContext;

    // Retry logic with model fallback
    const maxRetries = 3;
    const models = ["gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro"];
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const modelName = models[Math.min(attempt - 1, models.length - 1)];
        console.log(`Attempt ${attempt}: Using model ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });

        const fullPrompt = `${fullSystemPrompt}\n\n=== USER QUESTION ===\n${prompt}\n\n=== YOUR RESPONSE (as Kisan Assistant) ===`;
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        console.log("Kisan Assistant Response:", text.substring(0, 100) + "...");

        // Get remaining requests count
        let remaining = FREE_REQUEST_LIMIT;
        if (userId) {
          const user = await User.findById(userId);
          if (user && !user.isPremium) {
            remaining = FREE_REQUEST_LIMIT - user.aiRequestCount;
          }
        }

        return res.json({ response: text, remaining });

      } catch (retryError) {
        lastError = retryError;
        console.error(`Attempt ${attempt} failed:`, retryError.message);

        if (retryError.message?.includes("retry") || retryError.message?.includes("429")) {
          if (attempt < maxRetries) {
            const waitTime = Math.pow(2, attempt) * 1000;
            console.log(`Rate limited. Waiting ${waitTime / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
        } else {
          break;
        }
      }
    }

    // Fallback response using local data
    console.error("All AI attempts failed:", lastError?.message);
    const fallbackResponse = generateFallbackResponse(prompt, marketplaceData);
    if (fallbackResponse) {
      return res.json({ response: fallbackResponse });
    }

    return res.status(500).json({
      error: "Service temporarily unavailable",
      response: "Sorry! Service is busy. Please try again later. 😊"
    });

  } catch (err) {
    console.error("Marketplace AI Error:", err.message);
    res.status(500).json({
      error: "Failed to get response",
      response: "Something went wrong. Please try again. 😊"
    });
  }
};

/**
 * Generate fallback response using database data directly
 */
const generateFallbackResponse = (prompt, data) => {
  const lowerPrompt = prompt.toLowerCase();

  // Greetings
  if (/^(hello|hi|hey|assalam|salam|aoa|helo|greetings|sup)/i.test(lowerPrompt)) {
    return `Assalam-o-Alaikum! 🌾\n\nMain Kisan Assistant hoon, aap ka Farmer Market marketplace helper!\n\nMain aap ki yeh help kar sakta hoon:\n• 💰 Products aur prices dhundna\n• 👨‍🌾 Farmers ke baare mein jaanna\n• 🛒 Kharidne aur bechne ka tareeqa\n• 📦 Cart, checkout, orders ki help\n• 🌿 Product quality tips\n• 🔑 Password reset, profile help\n\nKya jaanna chahte hain? 😊`;
  }

  // How to buy
  if (lowerPrompt.includes("buy") || lowerPrompt.includes("khareed") || lowerPrompt.includes("kharid") || lowerPrompt.includes("purchase") || lowerPrompt.includes("order kaise")) {
    return `🛒 Farmer Market pe kharidne ka tareeqa:\n\n1️⃣ Register karein as Buyer (/register)\n2️⃣ Login karein\n3️⃣ Marketplace pe jayein → Products browse karein\n4️⃣ Product click karein → Details dekhein\n5️⃣ "Add to Cart" click karein\n6️⃣ Cart mein jayein → Items review karein\n7️⃣ "FARM10" coupon lagayein 10% discount ke liye! 🎉\n8️⃣ "Proceed to Checkout" → Address bharein\n9️⃣ Payment method chunein (COD recommended)\n🔟 "Place Order" → Done! 🎊\n\nOrders track karein: Cart page → "View My Orders"`;
  }

  // How to sell
  if (lowerPrompt.includes("sell") || lowerPrompt.includes("bech") || lowerPrompt.includes("product add") || lowerPrompt.includes("listing") || lowerPrompt.includes("farmer ban")) {
    return `👨‍🌾 Farmer Market pe bechne ka tareeqa:\n\n1️⃣ Register karein as Farmer (/register)\n2️⃣ Login karein\n3️⃣ Dashboard pe jayein\n4️⃣ "Add New Product" click karein\n5️⃣ Details bharein: title, price, category, quantity\n6️⃣ Photo upload karein (main + 5 extra images)\n7️⃣ "Create Product" → Live on Marketplace! 🎉\n\nProducts manage: Dashboard se Edit/Delete\nBuyers ke messages: Chat section mein`;
  }

  // Cheapest / prices
  if (lowerPrompt.includes("cheap") || lowerPrompt.includes("lowest") || lowerPrompt.includes("sasta") || lowerPrompt.includes("price") || lowerPrompt.includes("rate") || lowerPrompt.includes("qeemat") || lowerPrompt.includes("kimat")) {
    const categories = Object.entries(data.cheapestByCategory);
    if (categories.length > 0) {
      let response = "💰 Sab se saste products (category wise):\n\n";
      categories.forEach(([cat, product]) => {
        response += `• ${cat}: ${product.title} - Rs.${product.price} (${product.farmer})\n`;
      });
      response += `\n📊 Total ${data.totalProducts} products available hain!\nMarketplace pe jayein: /marketplace`;
      return response;
    }
  }

  // Farmers
  if (lowerPrompt.includes("farmer") || lowerPrompt.includes("seller") || lowerPrompt.includes("kisan") || lowerPrompt.includes("bechne wala")) {
    if (data.farmers.length > 0) {
      let response = `👨‍🌾 Farmer Market pe ${data.totalFarmers} registered farmers hain:\n\n`;
      data.farmers.forEach(f => {
        response += `• ${f.name} - ${f.location || "Pakistan"}\n`;
      });
      response += `\nFarmer se baat karein: Product page → "Chat with Farmer" 💬`;
      return response;
    }
  }

  // Products / categories
  if (lowerPrompt.includes("product") || lowerPrompt.includes("available") || lowerPrompt.includes("kya mil") || lowerPrompt.includes("categories") || lowerPrompt.includes("kitne")) {
    let response = `📦 Farmer Market pe ${data.totalProducts} products available hain!\n\n📂 Categories:\n`;
    Object.entries(data.categories).forEach(([cat, count]) => {
      response += `• ${cat}: ${count} items\n`;
    });
    response += `\n🔍 Marketplace pe browse karein: /marketplace`;
    return response;
  }

  // Vegetables
  if (lowerPrompt.includes("vegetable") || lowerPrompt.includes("sabzi") || lowerPrompt.includes("sabzee")) {
    const veg = data.cheapestByCategory["Vegetables"];
    if (veg) {
      return `🥬 Vegetables:\n\n• Sab se sasti sabzi: ${veg.title} - Rs.${veg.price}\n• Farmer: ${veg.farmer}\n\nSari sabzian dekhein: Marketplace → Category: Vegetables\n/marketplace`;
    }
  }

  // Fruits
  if (lowerPrompt.includes("fruit") || lowerPrompt.includes("phal")) {
    const fruit = data.cheapestByCategory["Fruits"];
    if (fruit) {
      return `🍎 Fruits:\n\n• Sab se sasta fruit: ${fruit.title} - Rs.${fruit.price}\n• Farmer: ${fruit.farmer}\n\nSare fruits dekhein: Marketplace → Category: Fruits\n/marketplace`;
    }
  }

  // Orders / tracking
  if (lowerPrompt.includes("order") || lowerPrompt.includes("track") || lowerPrompt.includes("delivery status") || lowerPrompt.includes("mera order")) {
    return `📦 Orders Track karna:\n\n1️⃣ Cart page pe jayein (/cart)\n2️⃣ "View My Orders" link click karein\n3️⃣ Ya direct /orders pe jayein\n\nOrder Statuses:\n• 🟡 Pending - Order placed, farmer confirmation pending\n• 🔵 Confirmed - Farmer ne accept kiya\n• 🟣 Shipped - Order on the way!\n• 🟢 Delivered - Successfully delivered!\n• 🔴 Cancelled - Order cancel hua\n\nKisi bhi order pe click karein full details ke liye! 📋`;
  }

  // Password / forgot
  if (lowerPrompt.includes("password") || lowerPrompt.includes("bhool") || lowerPrompt.includes("forgot") || lowerPrompt.includes("reset")) {
    return `🔑 Password Reset karna:\n\n1️⃣ Login page pe jayein (/login)\n2️⃣ "Forgot Password?" click karein\n3️⃣ Apna registered email daalein\n4️⃣ "Send Reset Link" click karein\n5️⃣ Email check karein (spam bhi dekhein)\n6️⃣ Link pe click karein → nayi password set karein\n7️⃣ Done! Nayi password se login karein 🎉`;
  }

  // Payment
  if (lowerPrompt.includes("payment") || lowerPrompt.includes("pay") || lowerPrompt.includes("paisa") || lowerPrompt.includes("cod") || lowerPrompt.includes("easypaisa") || lowerPrompt.includes("jazzcash")) {
    return `💳 Payment Methods:\n\n✅ Cash on Delivery (COD) - Available now!\n🔜 EasyPaisa - Coming soon\n🔜 JazzCash - Coming soon\n🔜 Credit/Debit Card - Coming soon\n\nAbhi ke liye COD best option hai! Order place karein aur delivery pe payment karein. 📦`;
  }

  // Coupon / discount
  if (lowerPrompt.includes("coupon") || lowerPrompt.includes("discount") || lowerPrompt.includes("offer") || lowerPrompt.includes("code")) {
    return `🎉 Discount Code:\n\n🏷️ Code: FARM10\n💰 Discount: 10% off\n📍 Where: Cart page → Coupon code field mein daalein\n\nCart mein jayein → "FARM10" type karein → Apply! ✅`;
  }

  // Profile
  if (lowerPrompt.includes("profile") || lowerPrompt.includes("photo") || lowerPrompt.includes("picture") || lowerPrompt.includes("tasveer")) {
    return `👤 Profile Update karna:\n\n1️⃣ Navbar mein Profile icon click karein\n2️⃣ /profile pe jayein\n3️⃣ "Edit Profile" tab select karein\n4️⃣ Name, location, contact update karein\n5️⃣ "Upload Photo" → nayi tasveer select karein (max 5MB)\n6️⃣ "Save Changes" click karein ✅\n\nPassword change karne ke liye "Forgot Password" use karein Login page se! 🔑`;
  }

  // Role switch
  if (lowerPrompt.includes("switch") || lowerPrompt.includes("role") || lowerPrompt.includes("farmer ban") || lowerPrompt.includes("buyer ban")) {
    return `🔄 Role Switch:\n\nAap farmer aur buyer dono ban sakte hain!\n\n1️⃣ Navbar mein 🔄 icon dekhein\n2️⃣ Click karein → Role switch ho jayega\n3️⃣ Farmer → Buyer: Ab khareed sakte hain!\n4️⃣ Buyer → Farmer: Ab products add kar sakte hain!\n\nSab data safe rehta hai - chat, profile sab! ✅`;
  }

  // Chat / contact farmer
  if (lowerPrompt.includes("chat") || lowerPrompt.includes("message") || lowerPrompt.includes("baat") || lowerPrompt.includes("contact") || lowerPrompt.includes("rabta")) {
    return `💬 Farmer se Chat karna:\n\n1️⃣ Marketplace pe jayein → Product click karein\n2️⃣ "Chat with Farmer" button click karein\n3️⃣ Message likhen aur send karein\n4️⃣ Real-time reply aayega! ⚡\n\nYa directly Chat section se (/chat) purane conversations access karein.\n\nMujh se (Kisan Assistant) baat karna:\nChat section mein mera naam sabse upar dikhega! 🤖`;
  }

  // About / company
  if (lowerPrompt.includes("about") || lowerPrompt.includes("company") || lowerPrompt.includes("Farmer Market") || lowerPrompt.includes("kya hai") || lowerPrompt.includes("platform")) {
    return `🌱 Farmer Market ke baare mein:\n\nFarmer Market Pakistan ka farm-to-consumer platform hai!\n\n✅ Farmers directly buyers ko fresh products bechte hain\n✅ Koi middleman nahi - fair prices!\n✅ Rs. (PKR) mein sab prices\n✅ 9 categories: Vegetables, Fruits, Grains, Dairy, Pulses, Spices, Seeds, Livestock, Others\n✅ Real-time chat, AI assistant (main! 😊)\n\n📊 Stats: ${data.totalFarmers} farmers, ${data.totalProducts} products\n\nFull details: /about`;
  }

  // Privacy / Terms
  if (lowerPrompt.includes("privacy") || lowerPrompt.includes("terms") || lowerPrompt.includes("policy") || lowerPrompt.includes("rules")) {
    return `📜 Policies:\n\n🔒 Privacy Policy: /privacy\n📋 Terms & Conditions: /terms\n\nYa footer mein "Legal" section mein links hain!\n\nKoi specific sawal hai privacy ya terms ke baare mein? Puchiye! 😊`;
  }

  // Registration
  if (lowerPrompt.includes("register") || lowerPrompt.includes("sign up") || lowerPrompt.includes("account") || lowerPrompt.includes("bana")) {
    return `📝 Account Banana:\n\n1️⃣ /register pe jayein\n2️⃣ Name, email, password bharein\n3️⃣ Role chunein: "I'm a Farmer" ya "I'm a Buyer"\n4️⃣ "Create Account" click karein\n5️⃣ Done! Login karein aur start karein! 🎉\n\n✅ Registration bilkul FREE hai!\n✅ Baad mein role switch bhi kar sakte hain! 🔄`;
  }

  // Cancel order
  if (lowerPrompt.includes("cancel") || lowerPrompt.includes("refund") || lowerPrompt.includes("return") || lowerPrompt.includes("wapas")) {
    return `❌ Order Cancel/Return:\n\n• Pending orders: Farmer se Chat mein baat karein\n• Shipped orders: Cancel nahi ho sakte\n• Delivered orders: 24 ghante ke andar masla ho to farmer se Chat karein\n\nFarmer aur buyer milke resolve karte hain. 🤝\n\nSupport: support@Farmer Market.com | +92 300 1234567`;
  }

  // Default welcome with stats
  return `🌾 Farmer Market Marketplace mein khush aamdeed!\n\n📊 Current Stats:\n• ${data.totalProducts} products available\n• ${data.totalFarmers} farmers registered\n• Categories: ${Object.keys(data.categories).join(", ")}\n\nMain Kisan Assistant hoon! Yeh puch sakte hain:\n• 💰 "Sab se sasta kya hai?"\n• 🛒 "Kaise khareedun?"\n• 👨‍🌾 "Kaise bechun?"\n• 📦 "Order track kaise karun?"\n• 🔑 "Password kaise change karun?"\n\nPuchiye! 😊`;
};

/**
 * GET /api/gemini/insights
 */
export const getMarketplaceInsights = async (req, res) => {
  try {
    const context = await getMarketplaceContext();

    if (!context) {
      return res.status(500).json({ error: "Could not fetch marketplace data" });
    }

    res.json({
      success: true,
      data: {
        statistics: {
          totalProducts: context.totalProducts,
          totalFarmers: context.totalFarmers,
          categories: context.categories
        },
        cheapestByCategory: context.cheapestByCategory,
        expensiveByCategory: context.expensiveByCategory,
        recentProducts: context.recentProducts
      }
    });
  } catch (error) {
    console.error("Insights Error:", error);
    res.status(500).json({ error: "Failed to get insights" });
  }
};

/**
 * GET /api/gemini/products/cheap
 */
export const getCheapestProducts = async (req, res) => {
  try {
    const { category, limit = 10 } = req.query;
    let query = {};
    if (category) query.category = category;

    const products = await Product.find(query)
      .populate("farmerId", "name location contact")
      .sort({ price: 1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: products.length,
      data: products.map(p => ({
        _id: p._id,
        title: p.title,
        price: p.price,
        category: p.category,
        quantity: p.quantity,
        farmer: { name: p.farmerId?.name || "Unknown", location: p.farmerId?.location || "" },
        region: p.region,
        mainImage: p.mainImage
      }))
    });
  } catch (error) {
    console.error("Cheapest Products Error:", error);
    res.status(500).json({ error: "Failed to get cheapest products" });
  }
};

/**
 * GET /api/gemini/products/search
 */
export const searchProducts = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, region } = req.query;
    let query = {};

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ];
    }
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (region) query.region = { $regex: region, $options: "i" };

    const products = await Product.find(query)
      .populate("farmerId", "name location contact")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      count: products.length,
      data: products.map(p => ({
        _id: p._id,
        title: p.title,
        price: p.price,
        category: p.category,
        quantity: p.quantity,
        farmer: { _id: p.farmerId?._id, name: p.farmerId?.name || "Unknown", location: p.farmerId?.location || "" },
        region: p.region,
        mainImage: p.mainImage
      }))
    });
  } catch (error) {
    console.error("Search Products Error:", error);
    res.status(500).json({ error: "Failed to search products" });
  }
};

/**
 * GET /api/gemini/farmers/:id
 */
export const getFarmerInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const farmer = await User.findById(id).select("-password");

    if (!farmer || farmer.role !== "farmer") {
      return res.status(404).json({ error: "Farmer not found" });
    }

    const products = await Product.find({ farmerId: id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        farmer: {
          _id: farmer._id,
          name: farmer.name,
          email: farmer.email,
          location: farmer.location,
          contact: farmer.contact,
          photo: farmer.photo
        },
        products: products.map(p => ({
          _id: p._id,
          title: p.title,
          price: p.price,
          category: p.category,
          quantity: p.quantity,
          mainImage: p.mainImage
        })),
        totalProducts: products.length
      }
    });
  } catch (error) {
    console.error("Farmer Info Error:", error);
    res.status(500).json({ error: "Failed to get farmer info" });
  }
};

/**
 * GET /api/gemini/farmers
 */
export const getAllFarmers = async (req, res) => {
  try {
    const farmers = await User.find({ role: "farmer" }).select("-password");

    const farmerData = await Promise.all(
      farmers.map(async (farmer) => {
        const productCount = await Product.countDocuments({ farmerId: farmer._id });
        return {
          _id: farmer._id,
          name: farmer.name,
          location: farmer.location,
          contact: farmer.contact,
          photo: farmer.photo,
          productCount
        };
      })
    );

    res.json({
      success: true,
      count: farmerData.length,
      data: farmerData
    });
  } catch (error) {
    console.error("All Farmers Error:", error);
    res.status(500).json({ error: "Failed to get farmers" });
  }
};

/**
 * GET /api/gemini/rate-limit/:userId
 * Check user's remaining AI requests
 */
export const getRateLimitStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const remaining = user.isPremium ? Infinity : Math.max(0, FREE_REQUEST_LIMIT - user.aiRequestCount);
    const resetDate = new Date(user.aiRequestResetDate);
    resetDate.setDate(resetDate.getDate() + RESET_PERIOD_DAYS);

    res.json({
      success: true,
      data: {
        isPremium: user.isPremium,
        used: user.aiRequestCount,
        remaining: remaining,
        limit: FREE_REQUEST_LIMIT,
        resetDate: resetDate
      }
    });
  } catch (error) {
    console.error("Rate Limit Status Error:", error);
    res.status(500).json({ error: "Failed to get rate limit status" });
  }
};
