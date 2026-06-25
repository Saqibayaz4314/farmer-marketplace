<div align="center">

# Farmer Marketplace

### Bridging the Gap Between Farmers & Consumers in Pakistan

[![React](https://img.shields.io/badge/React-19.1-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Express](https://img.shields.io/badge/Express-5.1-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101?style=flat-square&logo=socketdotio&logoColor=white)](https://socket.io)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Powered-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

<br/>

A full-stack e-commerce platform that eliminates middlemen by connecting Pakistani farmers directly with consumers — featuring real-time chat, AI-powered assistance, multi-role authentication, and a complete order management system.

[Features](#-key-features) &nbsp;•&nbsp; [Tech Stack](#-tech-stack) &nbsp;•&nbsp; [Architecture](#-system-architecture) &nbsp;•&nbsp; [Getting Started](#-getting-started) &nbsp;•&nbsp; [API Endpoints](#-api-endpoints)

</div>

---

## The Problem

Pakistan's agricultural sector faces critical challenges that affect both farmers and consumers:

| Challenge | Impact |
|-----------|--------|
| **Middleman Exploitation** | Farmers receive only 30–40% of the final retail price. Multiple intermediaries inflate costs at every step of the supply chain. |
| **Price Opacity** | Consumers have no visibility into actual farm-gate prices, leading to overpaying for basic produce. |
| **No Direct Channel** | Farmers lack a digital platform to reach consumers directly, limiting their market to local mandis. |
| **Communication Gap** | Buyers cannot verify product quality, negotiate prices, or coordinate delivery directly with farmers. |
| **Financial Exclusion** | Traditional e-commerce platforms have high listing fees and complex onboarding, excluding small-scale farmers. |

---

## Our Solution

| Problem | Solution |
|---------|----------|
| Middleman Exploitation | Direct farmer-to-consumer sales with zero commission |
| Price Opacity | Transparent pricing in PKR with category-wise comparison |
| No Direct Channel | Digital marketplace with 9 product categories, search, and filters |
| Communication Gap | Real-time chat (Socket.IO) + AI Assistant for instant support |
| Financial Exclusion | Free registration, simple product listing, cash-on-delivery support |

---

## Key Features

### Multi-Role Authentication
- Dual roles: Farmer & Buyer with distinct dashboards and permissions
- Role switching: seamlessly toggle between Farmer and Buyer without losing data
- JWT-based secure authentication with token refresh
- Forgot password flow with email-based reset links (Nodemailer + EJS templates)
- Profile management with photo upload (Multer)

### Complete E-Commerce Flow
- Product catalog with 9 categories: Vegetables, Fruits, Grains, Dairy, Pulses, Spices, Seeds, Livestock, Others
- Advanced filtering by category, region, and search keywords
- Shopping cart with quantity management and coupon codes (FARM10 for 10% off)
- Multi-step checkout with shipping address, delivery notes, and payment selection
- Order tracking with status updates: Pending → Confirmed → Shipped → Delivered
- Order history with expandable details, visual progress timeline, and status filters

### Real-Time Chat
- Socket.IO powered instant messaging between buyers and farmers
- WhatsApp-style UI with sidebar, conversation list, and message bubbles
- Online/offline indicators with green dot status
- Unread message badges in navbar and chat sidebar
- Chat initiation directly from product detail pages
- Mobile-responsive sidebar with slide-in/out behavior

### AI-Powered Assistant (Kisan Assistant)
- Google Gemini AI integration with full marketplace context
- Live database awareness — knows all products, prices, farmers, and categories in real-time
- Bilingual support — responds in English, Urdu, and Roman Urdu
- Smart topic filtering — only answers marketplace-related questions
- 20+ pre-built FAQ responses covering buying, selling, orders, payments, and more
- Fallback system — local keyword-based responses when API is unavailable

### Farmer Dashboard
- Product management — add, edit, delete products with multi-image upload (up to 6 images)
- Sales overview with statistics and activity tracking
- Quick action panel for common tasks

### UI/UX
- Responsive design — mobile-first, works on all screen sizes
- Framer Motion animations — smooth page transitions and micro-interactions
- Glassmorphism & gradients — modern UI with green/emerald theme
- Custom loading states — animated spinners and skeleton screens
- Toast notifications — real-time feedback for all user actions

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.1 | UI component library |
| Vite | 7.1 | Build tool & dev server |
| Tailwind CSS | 4.1 | Utility-first CSS framework |
| React Router | 7.9 | Client-side routing |
| Framer Motion | 12.x | Animations & transitions |
| Socket.IO Client | 4.8 | Real-time WebSocket communication |
| Axios | 1.12 | HTTP client for API calls |
| React Hook Form | 7.65 | Form management & validation |
| Yup | 1.7 | Schema-based validation |
| React Icons | 5.5 | Icon library |
| date-fns | 4.1 | Date formatting & manipulation |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 22.x | JavaScript runtime |
| Express | 5.1 | Web framework |
| MongoDB | — | NoSQL database |
| Mongoose | 8.19 | MongoDB ODM |
| Socket.IO | 4.8 | Real-time communication server |
| Google Generative AI | 0.24 | Gemini AI integration |
| JWT | 9.0 | Authentication tokens |
| bcrypt | 6.0 | Password hashing |
| Multer | 2.0 | File upload handling |
| Nodemailer | 8.0 | Email service |
| Stripe | 19.1 | Payment gateway |
| EJS | 3.1 | Email template engine |

---

## System Architecture

```
farmer-marketplace/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── aiController.js
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── chatController.js
│   │   ├── messageController.js
│   │   ├── orderController.js
│   │   └── productController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── roleCheck.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   ├── Chat.js
│   │   └── Message.js
│   ├── routes/
│   ├── sockets/
│   │   └── chatSocket.js
│   ├── utils/
│   │   ├── emailService.js
│   │   └── emailTemplates.js
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── HeroSection.jsx
│       │   ├── ChatBox.jsx
│       │   ├── Toast.jsx
│       │   ├── Loader.jsx
│       │   └── ProtectedRoute.jsx
│       ├── pages/
│       │   ├── MarketPlace.jsx
│       │   ├── ProductDetails.jsx
│       │   ├── Chat.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Checkout.jsx
│       │   ├── Cart.jsx
│       │   ├── Orders.jsx
│       │   ├── Profile.jsx
│       │   └── ...
│       ├── services/
│       ├── context/
│       └── utils/
│
└── start.bat
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB running locally or a MongoDB Atlas URI
- Google Gemini API Key (free tier at [ai.google.dev](https://ai.google.dev))

### 1. Clone the Repository

```bash
git clone https://github.com/Saqibayaz4314/farmer-marketplace.git
cd farmer-marketplace
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/farmer-marketplace
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
STRIPE_SECRET_KEY=your_stripe_key
```

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 4. Access the App

Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Quick Start:** Use `start.bat` in the root directory to launch both servers simultaneously.

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & receive JWT |
| POST | `/api/auth/forgot-password` | Send password reset email |
| POST | `/api/auth/reset-password/:token` | Reset password with token |
| PUT | `/api/auth/profile` | Update user profile |
| POST | `/api/auth/switch-role` | Toggle Farmer ↔ Buyer role |

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (with filters) |
| GET | `/api/products/:id` | Get single product with farmer info |
| POST | `/api/products` | Add product (Farmer only) |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

### Cart & Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart/:userId` | Get user's cart |
| POST | `/api/cart/add` | Add item to cart |
| PUT | `/api/cart/update` | Update item quantity |
| DELETE | `/api/cart/remove` | Remove item from cart |
| POST | `/api/orders` | Create new order |
| GET | `/api/orders/my` | Get logged-in user's orders |
| PUT | `/api/orders/:id/status` | Update order status |

### Chat & AI

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/chat` | Get user's chat rooms |
| POST | `/api/messages` | Send message |
| GET | `/api/messages/:chatId` | Get chat messages |
| POST | `/api/gemini/marketplace` | Ask AI assistant |
| GET | `/api/gemini/insights` | Get marketplace analytics |

---

## Future Roadmap

- [ ] EasyPaisa & JazzCash payment integration
- [ ] Multi-language support (full Urdu UI)
- [ ] Product reviews & ratings system
- [ ] Farmer verification badge system
- [ ] Push notifications for order updates
- [ ] Admin panel for platform management
- [ ] Google Maps for delivery tracking
- [ ] PWA support for mobile users

---

## Developer

**Saqib Ayaz** — Full Stack Developer & Software Engineering Student at MUET

[![Gmail](https://img.shields.io/badge/ayazs4314%40gmail.com-EA4335?style=flat-square&logo=gmail&logoColor=white)](mailto:ayazs4314@gmail.com)
[![GitHub](https://img.shields.io/badge/Saqibayaz4314-171515?style=flat-square&logo=github&logoColor=white)](https://github.com/Saqibayaz4314)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/saqib-ayaz)

---

<div align="center">

![Profile Views](https://komarev.com/ghpvc/?username=Saqibayaz4314&label=Profile+Views&color=47A248&style=flat-square)

If this project helped you, consider giving it a star.

</div>
