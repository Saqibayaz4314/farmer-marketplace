import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaBox,
  FaArrowLeft,
  FaSpinner,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaShoppingBag,
  FaChevronDown,
  FaChevronUp,
  FaMapMarkerAlt,
  FaPhone,
  FaCalendarAlt,
} from "react-icons/fa";
import { getMyOrders } from "../services/orderService";
import { getImageUrl, handleApiError } from "../utils/apiHelpers";
import { useToast } from "../components/Toast";

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: <FaClock className="text-yellow-600" />,
    dotColor: "bg-yellow-500",
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: <FaCheckCircle className="text-blue-600" />,
    dotColor: "bg-blue-500",
  },
  shipped: {
    label: "Shipped",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: <FaTruck className="text-purple-600" />,
    dotColor: "bg-purple-500",
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: <FaCheckCircle className="text-green-600" />,
    dotColor: "bg-green-500",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: <FaTimesCircle className="text-red-600" />,
    dotColor: "bg-red-500",
  },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getMyOrders();
        setOrders(response.data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(handleApiError(err));
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-PK", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-green-600 text-5xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-green-800">
            Loading your orders...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center max-w-md bg-white rounded-2xl shadow-lg p-8">
          <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Failed to Load Orders
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            <FaShoppingBag />
            Go Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-yellow-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-medium mb-4 transition-colors"
          >
            <FaArrowLeft />
            Continue Shopping
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-green-900 flex items-center gap-3">
                <FaBox className="text-green-600" />
                My Orders
              </h1>
              <p className="text-gray-600 mt-1">
                {orders.length} order{orders.length !== 1 ? "s" : ""} placed
              </p>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap gap-2">
              {["all", "pending", "confirmed", "shipped", "delivered", "cancelled"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      filterStatus === status
                        ? "bg-green-600 text-white shadow-sm"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-green-300"
                    }`}
                  >
                    {status === "all"
                      ? "All"
                      : statusConfig[status]?.label || status}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-green-100">
            <FaBox className="text-green-400 text-6xl mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {filterStatus === "all"
                ? "No orders yet"
                : `No ${filterStatus} orders`}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {filterStatus === "all"
                ? "Start shopping from our marketplace to place your first order!"
                : `You don't have any orders with '${filterStatus}' status.`}
            </p>
            {filterStatus === "all" ? (
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                <FaShoppingBag />
                Explore Marketplace
              </Link>
            ) : (
              <button
                onClick={() => setFilterStatus("all")}
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
              >
                View All Orders
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const isExpanded = expandedOrder === order._id;

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  {/* Order Header */}
                  <button
                    onClick={() =>
                      setExpandedOrder(isExpanded ? null : order._id)
                    }
                    className="w-full p-4 sm:p-6 text-left"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className={`w-3 h-3 rounded-full flex-shrink-0 ${status.dotColor}`}
                        />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-bold text-gray-900 truncate">
                              Order #{order._id.slice(-8).toUpperCase()}
                            </p>
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${status.color}`}
                            >
                              {status.icon}
                              {status.label}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <FaCalendarAlt className="text-xs" />
                              {formatDate(order.createdAt)}
                            </span>
                            <span>
                              {order.items?.length || 0} item
                              {(order.items?.length || 0) !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-xl font-extrabold text-green-700">
                          Rs. {(order.total || 0).toLocaleString()}
                        </p>
                        {isExpanded ? (
                          <FaChevronUp className="text-gray-400" />
                        ) : (
                          <FaChevronDown className="text-gray-400" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-green-100 bg-green-50/30 p-4 sm:p-6">
                      {/* Status Timeline */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                          Order Progress
                        </h4>
                        <div className="flex items-center gap-0 overflow-x-auto pb-2">
                          {["pending", "confirmed", "shipped", "delivered"].map(
                            (step, i) => {
                              const stepOrder = [
                                "pending",
                                "confirmed",
                                "shipped",
                                "delivered",
                              ];
                              const currentIndex = stepOrder.indexOf(
                                order.status
                              );
                              const stepIndex = stepOrder.indexOf(step);
                              const isCompleted =
                                order.status !== "cancelled" &&
                                stepIndex <= currentIndex;
                              const isCancelled = order.status === "cancelled";

                              return (
                                <React.Fragment key={step}>
                                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                                    <div
                                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                        isCancelled
                                          ? "bg-gray-200 text-gray-500"
                                          : isCompleted
                                          ? "bg-green-500 text-white"
                                          : "bg-gray-200 text-gray-500"
                                      }`}
                                    >
                                      {isCompleted && !isCancelled ? (
                                        "✓"
                                      ) : (
                                        i + 1
                                      )}
                                    </div>
                                    <span className="text-xs text-gray-600 capitalize whitespace-nowrap">
                                      {step}
                                    </span>
                                  </div>
                                  {i < 3 && (
                                    <div
                                      className={`flex-1 h-0.5 min-w-6 mx-1 mt-[-16px] ${
                                        isCancelled
                                          ? "bg-gray-200"
                                          : stepIndex < currentIndex
                                          ? "bg-green-500"
                                          : "bg-gray-200"
                                      }`}
                                    />
                                  )}
                                </React.Fragment>
                              );
                            }
                          )}
                        </div>
                        {order.status === "cancelled" && (
                          <p className="text-red-600 text-sm font-semibold mt-2 flex items-center gap-1">
                            <FaTimesCircle />
                            This order was cancelled
                          </p>
                        )}
                      </div>

                      {/* Items */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                          Order Items
                        </h4>
                        <div className="space-y-3">
                          {order.items?.map((item, j) => (
                            <div
                              key={j}
                              className="flex items-center gap-4 bg-white rounded-xl p-3 border border-green-100"
                            >
                              <img
                                src={getImageUrl(item.image)}
                                alt={item.name}
                                className="w-14 h-14 object-cover rounded-lg"
                                onError={(e) => {
                                  e.target.src =
                                    "https://via.placeholder.com/60?text=Product";
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 truncate">
                                  {item.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Qty: {item.quantity} × Rs.{" "}
                                  {item.price?.toLocaleString()}
                                </p>
                              </div>
                              <p className="font-bold text-green-700 flex-shrink-0">
                                Rs.{" "}
                                {(
                                  (item.price || 0) * (item.quantity || 1)
                                ).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping & Price Summary */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Shipping Address */}
                        <div className="bg-white rounded-xl p-4 border border-green-100">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <FaMapMarkerAlt className="text-green-600" />
                            Shipping Address
                          </h4>
                          <p className="text-sm text-gray-700 font-medium">
                            {order.shippingAddress?.fullName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.shippingAddress?.address}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.shippingAddress?.city},{" "}
                            {order.shippingAddress?.province}
                          </p>
                          {order.shippingAddress?.phone && (
                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                              <FaPhone className="text-xs" />
                              {order.shippingAddress.phone}
                            </p>
                          )}
                        </div>

                        {/* Price Breakdown */}
                        <div className="bg-white rounded-xl p-4 border border-green-100">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">
                            Price Summary
                          </h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between text-gray-600">
                              <span>Subtotal</span>
                              <span>
                                Rs. {(order.subtotal || 0).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                              <span>Delivery Fee</span>
                              <span>
                                {order.deliveryFee === 0
                                  ? "FREE"
                                  : `Rs. ${(
                                      order.deliveryFee || 0
                                    ).toLocaleString()}`}
                              </span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                              <span>Tax</span>
                              <span>
                                Rs. {(order.tax || 0).toLocaleString()}
                              </span>
                            </div>
                            <div className="border-t pt-1 flex justify-between font-bold text-green-800">
                              <span>Total</span>
                              <span>
                                Rs. {(order.total || 0).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Payment: {order.paymentMethod?.toUpperCase() || "COD"}
                          </p>
                        </div>
                      </div>

                      {order.deliveryNote && (
                        <div className="mt-4 bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">
                              Delivery Note:
                            </span>{" "}
                            {order.deliveryNote}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
