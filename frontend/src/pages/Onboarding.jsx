import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import {
  FaSeedling,
  FaShoppingBag,
  FaChartLine,
  FaTractor,
  FaComments,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

const Onboarding = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const isFarmer = user?.role === "farmer";

  const steps = isFarmer
    ? [
        {
          icon: <FaTractor className="text-3xl" />,
          title: "Add Your Products",
          description: "List your fresh produce with images, prices, and details. Set your location so nearby buyers can find you.",
          color: "from-yellow-400 to-orange-500",
        },
        {
          icon: <FaChartLine className="text-3xl" />,
          title: "Manage from Dashboard",
          description: "Track your products, edit listings, and view your sales statistics all from one place.",
          color: "from-green-400 to-emerald-500",
        },
        {
          icon: <FaComments className="text-3xl" />,
          title: "Chat with Buyers",
          description: "Negotiate prices, discuss delivery, and build relationships with buyers through real-time chat.",
          color: "from-blue-400 to-cyan-500",
        },
      ]
    : [
        {
          icon: <FaShoppingBag className="text-3xl" />,
          title: "Browse Fresh Products",
          description: "Explore our marketplace to find fresh vegetables, fruits, grains, dairy and more directly from farmers.",
          color: "from-green-400 to-emerald-500",
        },
        {
          icon: <FaComments className="text-3xl" />,
          title: "Chat with Farmers",
          description: "Ask questions about products, negotiate prices, and get delivery details through real-time chat.",
          color: "from-blue-400 to-cyan-500",
        },
        {
          icon: <FaCheckCircle className="text-3xl" />,
          title: "Easy Checkout",
          description: "Add items to your cart, choose your payment method (COD, Card, EasyPaisa, JazzCash), and place your order.",
          color: "from-purple-400 to-pink-500",
        },
      ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-yellow-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-2xl shadow-green-300/50 mb-6">
            <FaSeedling className="text-white text-4xl" />
          </div>
          <h1 className="text-4xl font-bold text-green-800 mb-3">
            Welcome to Farmer Market, {user?.name?.split(" ")[0] || "there"}! 🌾
          </h1>
          <p className="text-gray-600 text-lg max-w-lg mx-auto">
            {isFarmer
              ? "You're all set to start selling your fresh produce directly to buyers. Here's how to get started:"
              : "Discover the freshest farm products in Pakistan. Here's how to get started:"}
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6 mb-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 flex items-start gap-5 hover:-translate-y-1"
            >
              <div className={`bg-gradient-to-br ${step.color} p-4 rounded-xl text-white shadow-lg shrink-0`}>
                {step.icon}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    Step {index + 1}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800">{step.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={() => navigate(isFarmer ? "/dashboard" : "/marketplace")}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-green-300/50 transition-all duration-300 hover:-translate-y-1 flex items-center gap-3 mx-auto"
          >
            {isFarmer ? "Go to Dashboard" : "Explore Marketplace"}
            <FaArrowRight />
          </button>
          <p className="text-gray-400 text-sm mt-4">
            You can always access this guide from your profile
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;