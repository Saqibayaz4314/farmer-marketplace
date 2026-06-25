import React, { useEffect, useState } from "react";
import { 
  FaTrash, 
  FaArrowLeft, 
  FaShoppingCart, 
  FaPlus, 
  FaMinus, 
  FaTruck,  
  FaLeaf,
  FaCheckCircle,
  FaCreditCard,
  FaLock,
  FaSpinner
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { getCart, removeFromCart as removeCartItem, updateCartItemQuantity, clearCart } from "../services/cartService";
import { getCurrentUser } from "../services/authService";
import { getImageUrl, handleApiError, formatPrice } from "../utils/apiHelpers";
import { useToast } from "../components/Toast";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItem, setUpdatingItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const { toast } = useToast();

  // Fetch cart items from backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const user = getCurrentUser();
        if (!user) {
          setError("Please log in to view your cart");
          setLoading(false);
          return;
        }

        const response = await getCart(user._id || user.id);
        // Handle different response structures
        const cart = response.data?.cart || response.cart || response.data || response;
        setCartItems(cart?.items || []);
      } catch (err) {
        console.error("Error fetching cart items:", err);
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // Remove item from cart
  const handleRemoveFromCart = async (productId) => {
    try {
      setUpdatingItem(productId);
      const user = getCurrentUser();
      await removeCartItem(user._id || user.id, productId);
      setCartItems(cartItems.filter((item) => {
        const itemProductId = item.product?._id || item.productId?._id || item.productId;
        return itemProductId !== productId;
      }));
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (err) {
      console.error("Error removing item:", err);
      toast.error(handleApiError(err));
    } finally {
      setUpdatingItem(null);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdatingItem(productId);
      const user = getCurrentUser();
      await updateCartItemQuantity(user._id || user.id, productId, newQuantity);
      
      setCartItems(cartItems.map(item => {
        const itemProductId = item.product?._id || item.productId?._id || item.productId;
        return itemProductId === productId 
          ? { ...item, quantity: newQuantity }
          : item;
      }));
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast.error(handleApiError(err));
    } finally {
      setUpdatingItem(null);
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => {
    const price = item.product?.price || item.price || 0;
    return total + (price * item.quantity);
  }, 0);
  const shippingFee = subtotal > 2000 ? 0 : 200;
  const discount = appliedCoupon ? subtotal * 0.1 : 0; // 10% discount for demo
  const totalPrice = subtotal + shippingFee - discount;

  // Apply coupon
  const applyCoupon = () => {
    if (couponCode.trim() === "FARM10") {
      setAppliedCoupon({
        code: couponCode,
        discount: 0.1 // 10%
      });
    } else {
      toast.warning("Invalid coupon code. Try 'FARM10' for 10% off!");
    }
    setCouponCode("");
  };

  // Open delete confirmation modal
  const confirmDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-green-600 text-5xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-green-800">Loading your cart...</h2>
          <p className="text-gray-600 mt-2">Getting your fresh products ready</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            <p className="font-semibold">Error loading cart</p>
            <p className="text-sm">{error}</p>
          </div>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            <FaLeaf />
            Go to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <Link
              to="/marketplace"
              className="flex items-center gap-2 text-green-600 hover:text-green-800 font-medium transition-colors mb-2"
            >
              <FaArrowLeft /> Continue Shopping
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-green-800 flex items-center gap-3">
              <FaShoppingCart className="text-green-600" /> 
              Shopping Cart
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-gray-600">
                {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
              </p>
              <Link
                to="/orders"
                className="text-green-600 hover:text-green-800 text-sm font-semibold transition-colors flex items-center gap-1"
              >
                📦 View My Orders
              </Link>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-4 bg-white rounded-2xl shadow-sm p-4 border border-green-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <span className="text-sm font-medium text-green-800">Cart</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <span className="text-sm font-medium text-gray-500">Checkout</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <span className="text-sm font-medium text-gray-500">Complete</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cartItems.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 text-center border border-green-100">
                <FaShoppingCart className="mx-auto text-6xl text-green-400 mb-6" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Looks like you haven't added any products to your cart yet. Explore our marketplace to find fresh farm products!
                </p>
                <Link
                  to="/marketplace"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg hover:shadow-green-400/30 transition-all duration-300 hover:-translate-y-1"
                >
                  <FaLeaf />
                  Explore Marketplace
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-green-100">
                {/* Cart Header */}
                <div className="bg-green-50 px-6 py-4 border-b border-green-100">
                  <h2 className="text-lg font-semibold text-green-800">Cart Items</h2>
                </div>

                {/* Cart Items List */}
                <div className="divide-y divide-green-100">
                  {cartItems.map((item) => {
                    // Handle both populated and non-populated cart items
                    const product = item.productId || item.product || {};
                    const productName = product.title || item.name || 'Untitled';
                    const productPrice = product.price || item.price || 0;
                    const productImage = product.mainImage || item.image || '';
                    const productUnit = product.unit || item.unit || 'kg';
                    const productId = product._id || item.productId || item._id;
                    const seller = product.farmerId || product.seller || {};
                    
                    return (
                      <div
                        key={productId}
                        className="p-6 hover:bg-green-50/50 transition-colors duration-200"
                      >
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={getImageUrl(productImage)}
                              alt={productName}
                              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl border-2 border-green-200 shadow-sm"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/100?text=No+Image";
                              }}
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                              <div className="flex-1">
                                <h3 className="font-bold text-lg text-gray-800 mb-1">{productName}</h3>
                                <p className="text-green-600 font-semibold text-lg mb-2">
                                  {formatPrice(productPrice)} / {productUnit}
                                </p>
                                <p className="text-gray-500 text-sm flex items-center gap-1">
                                  <FaLeaf className="text-green-500" />
                                  Sold by: {seller.fullName || seller.name || "Farmer"}
                                </p>
                                <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                                  <FaTruck className="text-blue-500" />
                                  Delivery: 2-5 days
                                </p>
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-3 sm:gap-4">
                                <div className="flex items-center gap-2 bg-green-50 rounded-xl p-1 border border-green-200">
                                  <button
                                    onClick={() => updateQuantity(productId, item.quantity - 1)}
                                    disabled={item.quantity <= 1 || updatingItem === productId}
                                    className="w-8 h-8 flex items-center justify-center text-green-700 hover:bg-green-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <FaMinus size={12} />
                                  </button>
                                  
                                  <span className="w-8 text-center font-semibold text-green-900">
                                    {updatingItem === productId ? (
                                      <FaSpinner className="animate-spin w-4 h-4 mx-auto" />
                                    ) : (
                                      item.quantity
                                    )}
                                  </span>
                                  
                                  <button
                                    onClick={() => updateQuantity(productId, item.quantity + 1)}
                                    disabled={item.quantity >= (product.quantity || 999) || updatingItem === productId}
                                    className="w-8 h-8 flex items-center justify-center text-green-700 hover:bg-green-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <FaPlus size={12} />
                                  </button>
                                </div>

                                {/* Item Total */}
                                <div className="text-right min-w-20">
                                  <p className="font-bold text-green-700 text-lg">
                                    {formatPrice(productPrice * item.quantity)}
                                  </p>
                                </div>

                                {/* Remove Button */}
                                <button
                                  onClick={() => confirmDelete(item)}
                                  disabled={updatingItem === productId}
                                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 disabled:opacity-50"
                                  title="Remove item"
                                >
                                  <FaTrash size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Trust Badges */}
            {cartItems.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-white rounded-2xl p-4 border border-green-100 shadow-sm text-center">
                  <FaTruck className="text-green-600 text-xl mx-auto mb-2" />
                  <p className="font-semibold text-green-800">Free Shipping</p>
                  <p className="text-sm text-gray-600">On orders over Rs 2,000</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-green-100 shadow-sm text-center">
                  {/* <FaShield className="text-green-600 text-xl mx-auto mb-2" /> */}
                  <p className="font-semibold text-green-800">Quality Guarantee</p>
                  <p className="text-sm text-gray-600">Fresh from farms</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-green-100 shadow-sm text-center">
                  <FaCheckCircle className="text-green-600 text-xl mx-auto mb-2" />
                  <p className="font-semibold text-green-800">Easy Returns</p>
                  <p className="text-sm text-gray-600">7-day return policy</p>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl p-6 border border-green-100 sticky top-6">
                <h3 className="text-xl font-bold text-green-800 mb-6 flex items-center gap-2">
                  <FaCreditCard />
                  Order Summary
                </h3>

                {/* Coupon Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Have a coupon?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    />
                    <button
                      onClick={applyCoupon}
                      className="bg-green-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-700 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedCoupon && (
                    <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                      <FaCheckCircle />
                      Coupon applied! 10% discount
                    </p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>Rs {subtotal.toLocaleString()}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>- Rs {discount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shippingFee === 0 ? 'Free' : `Rs ${shippingFee}`}</span>
                  </div>
                  
                  <div className="border-t border-green-200 pt-3">
                    <div className="flex justify-between text-lg font-bold text-green-800">
                      <span>Total</span>
                      <span>Rs {totalPrice.toLocaleString()}</span>
                    </div>
                    {shippingFee === 0 && (
                      <p className="text-green-600 text-sm mt-1">
                        🎉 You qualify for free shipping!
                      </p>
                    )}
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  to="/checkout"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-green-400/30 transition-all duration-300 hover:-translate-y-1 mb-4"
                >
                  <FaLock />
                  Proceed to Checkout
                </Link>

                {/* Security Notice */}
                <div className="text-center">
                  <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                    {/* <FaShield className="text-green-500" /> */}
                    Your payment is secure and encrypted
                  </p>
                </div>

                {/* Estimated Delivery */}
                <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <FaTruck />
                    Estimated Delivery
                  </h4>
                  <p className="text-sm text-gray-600">
                    2 - 5 days
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && itemToDelete && (() => {
        const product = itemToDelete.productId || itemToDelete.product || {};
        const productName = product.title || itemToDelete.name || 'this product';
        const productId = product._id || itemToDelete.productId || itemToDelete._id;
        
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Remove Item</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to remove "{productName}" from your cart?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setItemToDelete(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRemoveFromCart(productId)}
                  disabled={updatingItem === productId}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {updatingItem === itemToDelete.product._id ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Removing...
                  </>
                ) : (
                  <>
                    <FaTrash />
                    Remove
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        );
      })()}
    </div>
  );
};

export default Cart;