import React from "react";
import { Link } from "react-router-dom";
import { FaTractor, FaHome, FaShoppingBag, FaSeedling } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-yellow-50 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Animated tractor icon */}
        <div className="relative mb-8">
          <div className="text-9xl font-black text-green-200 select-none">404</div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="animate-bounce">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-2xl shadow-2xl shadow-green-300/50">
                <FaTractor className="text-white text-5xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-3xl font-bold text-green-800 mb-3">
          Oops! Page Not Found
        </h1>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          Looks like this field hasn't been planted yet! 🌾
          <br />
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-300/40 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <FaHome /> Go Home
          </Link>
          <Link
            to="/marketplace"
            className="bg-white text-green-700 px-8 py-3.5 rounded-xl font-semibold border-2 border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <FaShoppingBag /> Marketplace
          </Link>
        </div>

        {/* Decorative plants */}
        <div className="flex justify-center gap-6 mt-12 text-3xl opacity-50">
          <FaSeedling className="text-green-400 animate-pulse" style={{ animationDelay: "0s" }} />
          <FaSeedling className="text-green-500 animate-pulse" style={{ animationDelay: "0.5s" }} />
          <FaSeedling className="text-green-600 animate-pulse" style={{ animationDelay: "1s" }} />
          <FaSeedling className="text-green-500 animate-pulse" style={{ animationDelay: "1.5s" }} />
          <FaSeedling className="text-green-400 animate-pulse" style={{ animationDelay: "2s" }} />
        </div>
      </div>
    </div>
  );
};

export default NotFound;