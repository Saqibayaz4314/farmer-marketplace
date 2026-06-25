import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { PageLoader } from "./components/Loader";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

// Context
import { SocketProvider } from "./context/SocketContext";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MarketPlace from "./pages/MarketPlace";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import ProductDetails from "./pages/ProductDetails";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AboutUs from "./pages/AboutUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import Orders from "./pages/Orders";

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <PageLoader />;

  return (
    <SocketProvider>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300">
        <div className="fixed top-0 left-0 w-full z-50">
          <Navbar />
        </div>

        <main className="flex-grow pt-20 px-4 md:px-10">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsConditions />} />
            
            {/* Farmer Only Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles="farmer">
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/add-product" 
              element={
                <ProtectedRoute allowedRoles="farmer">
                  <AddProduct />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit-product/:id" 
              element={
                <ProtectedRoute allowedRoles="farmer">
                  <EditProduct />
                </ProtectedRoute>
              } 
            />
            
            {/* Buyer Only Routes */}
            <Route 
              path="/cart" 
              element={
                <ProtectedRoute allowedRoles="buyer">
                  <Cart />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/checkout" 
              element={
                <ProtectedRoute allowedRoles="buyer">
                  <Checkout />
                </ProtectedRoute>
              } 
            />
            
            {/* Both Farmer and Buyer Routes */}
            <Route 
              path="/marketplace" 
              element={
                <ProtectedRoute allowedRoles={["farmer", "buyer"]}>
                  <MarketPlace />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute allowedRoles={["farmer", "buyer"]}>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chat" 
              element={
                <ProtectedRoute allowedRoles={["farmer", "buyer"]}>
                  <Chat />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/product/:id" 
              element={
                <ProtectedRoute allowedRoles={["farmer", "buyer"]}>
                  <ProductDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/onboarding" 
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/orders" 
              element={
                <ProtectedRoute allowedRoles={["farmer", "buyer"]}>
                  <Orders />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </SocketProvider>
  );
};

export default App;
