import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaShoppingCart,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
  FaEnvelope,
  FaCreditCard,
  FaMoneyBillWave,
  FaTruck,
  FaCheckCircle,
  FaSpinner,
  FaArrowLeft,
  FaHome,
} from "react-icons/fa";
import { getCurrentUser } from "../services/authService";
import { getCart, clearCart } from "../services/cartService";
import { createOrder } from "../services/orderService";
import { getImageUrl, handleApiError } from "../utils/apiHelpers";
import { useToast } from "../components/Toast";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    paymentMethod: "cod", // cod, card, easypaisa, jazzcash
    deliveryNote: "",
  });

  const [errors, setErrors] = useState({});

  // Provinces in Pakistan
  const provinces = ["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan", "Gilgit-Baltistan", "Azad Kashmir"];

  // Fetch user and cart data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
          navigate("/login");
          return;
        }

        setUser(currentUser);
        
        // Pre-fill form with user data
        setFormData(prev => ({
          ...prev,
          fullName: currentUser.name || "",
          email: currentUser.email || "",
          phone: currentUser.contact || "",
        }));

        // Fetch cart
        const cartData = await getCart(currentUser._id);
        const items = cartData?.data?.items || cartData?.cart?.items || cartData?.items || [];
        
        if (items.length === 0) {
          navigate("/cart");
          return;
        }

        setCart(items);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(handleApiError(error));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Calculate totals
  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => {
      const price = item.price || item.product?.price || 0;
      const quantity = item.quantity || 1;
      return sum + price * quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const deliveryFee = subtotal > 5000 ? 0 : 200; // Free delivery over Rs. 5000
  const tax = Math.round(subtotal * 0.05); // 5% tax
  const total = subtotal + deliveryFee + tax;

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^(\+92|0)?[0-9]{10}$/.test(formData.phone.replace(/[-\s]/g, ""))) {
      newErrors.phone = "Phone number is invalid";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.province) {
      newErrors.province = "Province is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle order placement — REAL API CALL
  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      toast.warning("Please fill in all required fields correctly");
      return;
    }

    try {
      setProcessingOrder(true);

      const orderData = {
        items: cart.map(item => ({
          productId: item.productId || item.product?._id,
          name: item.name || item.product?.title,
          price: item.price || item.product?.price,
          quantity: item.quantity,
          image: item.image || item.product?.images?.[0] || item.product?.mainImage || "",
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode,
        },
        paymentMethod: formData.paymentMethod,
        deliveryNote: formData.deliveryNote,
        subtotal,
        deliveryFee,
        tax,
        total,
      };

      const result = await createOrder(orderData);
      
      if (result.success) {
        setOrderSuccess(true);
        // Redirect to marketplace after 3 seconds
        setTimeout(() => {
          navigate("/marketplace");
        }, 3000);
      } else {
        toast.error(result.message || "Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(handleApiError(error));
    } finally {
      setProcessingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-6xl text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-yellow-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="mb-6">
            <FaCheckCircle className="text-8xl text-green-500 mx-auto animate-bounce" />
          </div>
          <h2 className="text-3xl font-bold text-green-900 mb-4">Order Placed Successfully! 🎉</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your order! You will receive a confirmation email shortly.
          </p>
          <div className="bg-green-50 rounded-xl p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Order Total</p>
            <p className="text-3xl font-bold text-green-700">Rs. {total.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-2">Payment Method: {formData.paymentMethod.toUpperCase()}</p>
          </div>
          <p className="text-sm text-gray-500">Redirecting to marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-yellow-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 text-green-700 hover:text-green-800 font-medium mb-4 transition-colors"
          >
            <FaArrowLeft />
            Back to Cart
          </button>
          <div className="flex items-center gap-3">
            <FaShoppingCart className="text-4xl text-green-600" />
            <h1 className="text-4xl font-bold text-green-900">Checkout</h1>
          </div>
          <p className="text-gray-600 mt-2">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-100 p-3 rounded-xl">
                  <FaTruck className="text-2xl text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-900">Shipping Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUser className="inline mr-2 text-green-600" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                      errors.fullName ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaEnvelope className="inline mr-2 text-green-600" />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                      errors.email ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaPhone className="inline mr-2 text-green-600" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                      errors.phone ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholder="03XX-XXXXXXX"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaHome className="inline mr-2 text-green-600" />
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                      errors.city ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholder="Enter your city"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                {/* Address - Full Width */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaMapMarkerAlt className="inline mr-2 text-green-600" />
                    Complete Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                      errors.address ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholder="House/Flat No, Street, Area, Landmark"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                {/* Province */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Province *
                  </label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                      errors.province ? "border-red-500" : "border-gray-200"
                    }`}
                  >
                    <option value="">Select Province</option>
                    {provinces.map(province => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                  {errors.province && (
                    <p className="text-red-500 text-sm mt-1">{errors.province}</p>
                  )}
                </div>

                {/* Postal Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code (Optional)
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    placeholder="12345"
                  />
                </div>

                {/* Delivery Note - Full Width */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Instructions (Optional)
                  </label>
                  <textarea
                    name="deliveryNote"
                    value={formData.deliveryNote}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    placeholder="Any special instructions for delivery..."
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-100 p-3 rounded-xl">
                  <FaCreditCard className="text-2xl text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-900">Payment Method</h2>
              </div>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-500 transition-all">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-green-600"
                  />
                  <FaMoneyBillWave className="text-2xl text-green-600" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Cash on Delivery</p>
                    <p className="text-sm text-gray-500">Pay when you receive the order</p>
                  </div>
                </label>

                {/* Credit/Debit Card */}
                <label className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-500 transition-all">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === "card"}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-green-600"
                  />
                  <FaCreditCard className="text-2xl text-blue-600" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Credit/Debit Card</p>
                    <p className="text-sm text-gray-500">Pay securely with your card</p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                    Coming Soon
                  </span>
                </label>

                {/* EasyPaisa */}
                <label className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-500 transition-all">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="easypaisa"
                    checked={formData.paymentMethod === "easypaisa"}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-green-600"
                  />
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    E
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">EasyPaisa</p>
                    <p className="text-sm text-gray-500">Pay with EasyPaisa wallet</p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                    Coming Soon
                  </span>
                </label>

                {/* JazzCash */}
                <label className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-500 transition-all">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="jazzcash"
                    checked={formData.paymentMethod === "jazzcash"}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-green-600"
                  />
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                    J
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">JazzCash</p>
                    <p className="text-sm text-gray-500">Pay with JazzCash wallet</p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                    Coming Soon
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 sticky top-8">
              <h2 className="text-2xl font-bold text-green-900 mb-6">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item, index) => {
                  const itemName = item.name || item.product?.title || "Unknown Product";
                  const itemPrice = item.price || item.product?.price || 0;
                  const itemImage = item.image || item.product?.images?.[0] || "";
                  const itemQuantity = item.quantity || 1;

                  return (
                    <div key={index} className="flex gap-3 items-center pb-4 border-b border-gray-100">
                      <img
                        src={getImageUrl(itemImage)}
                        alt={itemName}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/100?text=Product";
                        }}
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm line-clamp-1">
                          {itemName}
                        </p>
                        <p className="text-sm text-gray-500">Qty: {itemQuantity}</p>
                      </div>
                      <p className="font-bold text-green-700">
                        Rs. {(itemPrice * itemQuantity).toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `Rs. ${deliveryFee.toLocaleString()}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (5%)</span>
                  <span className="font-semibold">Rs. {tax.toLocaleString()}</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-3 flex justify-between text-xl font-bold text-green-900">
                  <span>Total</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Free Delivery Badge */}
              {subtotal > 5000 && (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 mb-6">
                  <p className="text-green-700 text-sm font-semibold text-center">
                    🎉 You got FREE delivery!
                  </p>
                </div>
              )}

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={processingOrder}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                  processingOrder
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                }`}
              >
                {processingOrder ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    Place Order
                  </>
                )}
              </button>

              {/* Security Note */}
              <p className="text-xs text-gray-500 text-center mt-4">
                🔒 Your payment information is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
