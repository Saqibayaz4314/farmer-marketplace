import React, { useState } from "react";
import { FaEnvelope, FaTractor, FaSeedling, FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await forgotPassword(email);
      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.message || "Something went wrong");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to send reset email. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-yellow-50 px-4 py-12">
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-green-500 to-green-700 p-3 rounded-2xl shadow-lg">
              <FaTractor className="text-white text-2xl" />
              <FaSeedling className="text-green-200 absolute -top-1 -right-1 text-xs" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-green-900 font-bold text-2xl">Farmer</span>
              <span className="text-green-600 font-semibold text-2xl -mt-1">Market</span>
            </div>
          </div>
        </div>

        <div className="w-full text-center border border-green-200/60 rounded-3xl px-8 py-10 bg-white/80 shadow-2xl">
          {!success ? (
            <>
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">🔐</span>
                </div>
              </div>

              <h1 className="text-green-900 text-3xl font-black mb-3">Forgot Password?</h1>
              <p className="text-gray-600 mb-8">
                No worries! Enter your email and we'll send you a reset link.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-6 flex items-start gap-3 text-left">
                  <span className="text-red-500 text-xl">⚠️</span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Error</p>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <div className="flex items-center bg-green-50 border border-green-200 h-14 rounded-2xl pl-6 gap-4">
                    <FaEnvelope className="text-green-600 text-lg" />
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-transparent w-full outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 rounded-2xl text-white bg-gradient-to-r from-green-500 to-green-600 font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-60"
                >
                  {isLoading ? (
                    "Sending..."
                  ) : (
                    <>
                      <FaPaperPlane /> Send Reset Link
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                  <span className="text-4xl">📧</span>
                </div>
              </div>

              <h2 className="text-green-900 text-2xl font-black mb-3">Check Your Email! 📬</h2>
              <p className="text-gray-600 mb-2">
                If an account exists with <strong className="text-green-700">{email}</strong>, we've sent a password reset link.
              </p>
              <p className="text-gray-500 text-sm mb-8">
                The link will expire in <strong>15 minutes</strong>. Check your spam folder too!
              </p>

              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
                <p className="text-green-800 text-sm">
                  💡 <strong>Tip:</strong> If you don't receive the email, make sure you entered the correct email address and try again.
                </p>
              </div>

              <button
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                }}
                className="text-green-600 font-semibold hover:underline text-sm"
              >
                Try with a different email
              </button>
            </>
          )}

          <div className="mt-8">
            <Link
              to="/login"
              className="text-green-700 font-bold hover:underline flex items-center justify-center gap-2"
            >
              <FaArrowLeft className="text-sm" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
