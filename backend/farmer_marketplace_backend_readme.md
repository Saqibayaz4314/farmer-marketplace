# Farmer-to-Buyer Marketplace Backend

## Overview
This backend is built using the MERN stack with AI integration and real-time chat functionality. It supports a marketplace connecting farmers directly with buyers, enabling crop listings, product price suggestions, and chat communication.

## Project Setup

1. Initialize Node.js project:
```bash
mkdir farmer-marketplace-backend
cd farmer-marketplace-backend
npm init -y
```

2. Install dependencies:
```bash
npm install express mongoose dotenv bcrypt jsonwebtoken cors socket.io openai
npm install nodemon --save-dev
```

3. Folder structure:
```
farmer-marketplace-backend/
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── chatController.js
│   └── aiController.js
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Message.js
│   └── Chat.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── chatRoutes.js
│   └── aiRoutes.js
├── middleware/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
├── .env
├── server.js
└── package.json
```

4. Configure `.env`:
```
PORT=5000
MONGO_URI=<YourMongoDBURI>
JWT_SECRET=<YourJWTSecret>
OPENAI_API_KEY=<YourOpenAIKey>
```

## Models

### User
- Fields: `name, email, password, role (farmer/buyer), location, contact, createdAt`
- Purpose: Authentication, authorization, linking products/messages.

### Product
- Fields: `farmerId, title, description, price, aiSuggestedPrice, quantity, category, region, createdAt`
- Purpose: Crop listings, AI suggestions, buyer browsing.

### Message
- Fields: `chatId, senderId, receiverId, text, timestamp`
- Purpose: Store chat messages for real-time and history.

### Chat
- Fields: `members (farmer + buyer)`
- Purpose: Organize chat threads for structured real-time communication.

## Controllers & Functions

### Auth Controller
- `register(req,res)`: Create user, hash password, return JWT
- `login(req,res)`: Validate credentials, return JWT
- `getProfile(req,res)`: Return user profile

### Product Controller
- `addProduct(req,res)`: Farmer adds crop; optional AI description/price
- `getProducts(req,res)`: Fetch all products; support filters
- `getProductById(req,res)`: Fetch single product
- `updateProduct(req,res)`: Farmer updates crop
- `deleteProduct(req,res)`: Farmer deletes crop

### Chat Controller
- `createChat(req,res)`: Start chat between buyer & farmer
- `getChats(req,res)`: Get all chats for a user
- `sendMessage(req,res)`: Save message, emit via Socket.IO
- `getMessages(req,res)`: Fetch all messages in a chat

### AI Controller
- `generateDescription(req,res)`: Input crop → AI → return description
- `suggestPrice(req,res)`: Input crop → AI → return suggested price
- `chatAssistant(req,res)`: Input user query → AI → return advice/Q&A

## Middleware

- **Auth Middleware:** Verify JWT token for protected routes.
- **Role Middleware:** Restrict actions based on user role (farmer vs buyer).
- **Error Handling Middleware:** Catch async errors, send standardized response.

## API Endpoints

| Module | Endpoint | Method | Purpose |
|--------|---------|--------|---------|
| Auth | /api/auth/register | POST | Register user |
| Auth | /api/auth/login | POST | Login |
| Auth | /api/auth/profile | GET | Get profile |
| Products | /api/products | POST | Add crop |
| Products | /api/products | GET | List crops |
| Products | /api/products/:id | GET | Crop details |
| Products | /api/products/:id | PUT | Update crop |
| Products | /api/products/:id | DELETE | Delete crop |
| Chat | /api/chats | POST | Create chat |
| Chat | /api/chats/:userId | GET | Get chats of user |
| Messages | /api/messages | POST | Send message |
| Messages | /api/messages/:chatId | GET | Get chat messages |
| AI | /api/ai/description | POST | Generate product description |
| AI | /api/ai/price | POST | Suggest price |
| AI | /api/ai/chat | POST | Chat assistant |

## Real-Time Chat (Socket.IO)

- Users join a chat room (`chatId`).
- Messages emitted in real-time.
- Messages stored in MongoDB for history.

**Flow:**
```
User sends message → Backend stores → Socket emits → Recipient receives instantly
```

## AI Integration (OpenAI API)

- **Description:** Generates appealing product descriptions.
- **Price Suggestion:** Suggests fair crop prices.
- **Chat Assistant:** Provides advice, farming Q&A, or translations.

**Flow:**
```
Frontend → Backend AI route → OpenAI API → Response → Frontend displays
```

## Development Flow

1. Setup server & MongoDB connection
2. Create Models (User, Product, Chat, Message)
3. Build Controllers (CRUD + AI integration)
4. Setup Routes for API endpoints
5. Add Middleware (Auth, Role, Error Handling)
6. Integrate Socket.IO for real-time chat
7. Integrate OpenAI API for AI features
8. Testing & Debugging
9. Deployment (Render, Railway, or Heroku)

## Optional Enhancements

- Search & filters for products
- Analytics dashboard for farmers and buyers
- Notifications for new messages or relevant listings
- Multi-language support using AI
- Historical AI price suggestions for trends

